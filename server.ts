import express from "express";
import { getRedisClient } from "./redis";
import { generate } from 'shortid';
import { Repo, getDb } from "./db";
import { Email } from "./email";
import dotenv from 'dotenv';


async function main() {
  const app = express();
  const redisClient = await getRedisClient();
  app.use(express.json());
  dotenv.config();
  const db = await getDb();
  const repo = new Repo();
  const email = new Email();

  app.get("/", (req, res) => {
    res.send("Health check");
  });

  // register user 
  app.post("/register", async (req, res) => {

    // save user data to db with is_active = false
    await repo.addUser(db, {
      email: req.body.email,
      password: req.body.password,
      is_active: false,
    });

    // generate otp
    const OTP = generate();

    // save to redis with expiry time,
    await redisClient.set(req.body.email, OTP);
    await redisClient.expire(req.body.email, 60);

    // send otp to user email
    await email.sendToEmail(req.body.email, OTP);

    // return success message
    res.send("register success, next enter otp sent to your email to activate your account");
    res.status(200);
  });

  app.post('/verify', async (req, res) => {

    // user input email and otp 
    const validOtp = await redisClient.get(req.body.email);

    // otp is invalid and return error message
    if (req.body.otp !== validOtp) {
      res.send("OTP is false, try again");
      res.status(400);
    } else {

      // otp is valid, change is_active to true, and then return success message
      await repo.updateUser(db, {
        email: req.body.email,
        password: "",
        is_active: true,
      });
      res.send("your account is activated, you can now login");
      res.status(200);
    }
  });

  app.post('/resend', async (req, res) => {
    // generate new otp 
    const OTP = generate();

    // save to redis with expiry time. it will replace the old otp in redis
    await redisClient.set(req.body.email, OTP);
    await redisClient.expire(req.body.email, 60);

    // send otp to user email
    await email.sendToEmail(req.body.email, OTP);

    // return success message
    res.send("resend success, next enter otp sent to your email to activate your account");
    res.status(200);
  });

  // listen to port
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.log(error);
});
