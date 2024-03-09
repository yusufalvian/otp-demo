const { REDIS_ACCESS } = process.env;
import { createClient } from "redis";

const redisClient = createClient({
  url: REDIS_ACCESS,
  socket: {
    tls: false,
  },
});

export const getRedisClient = async () => {
  if (!redisClient.isOpen) {
    await redisClient
      .connect()
      .then(() => console.log("redis connected"))
      .catch((e) => console.log("failed to connect to redis"));
  }

  return redisClient;
};
