import nodeoutlook from "nodejs-nodemailer-outlook";

export class Email {
    sendToEmail = async (email: string, message: any) => {
        const emailUsername = process.env.EMAIL_OUTLOOK_USERNAME;
        const emailPassword = process.env.EMAIL_OUTLOOK_PASSWORD;

        nodeoutlook.sendEmail({
            auth: {
                user: emailUsername,
                pass: emailPassword,
            },
            from: emailUsername,
            to: email,
            subject: "OTP",
            text: message,
        });
    };
}