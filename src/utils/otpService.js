import otpGenerator from "otp-generator";
import Redis from "ioredis";
import { sendEmail } from "../services/email.service.js";
import template from "../utils/template.js";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

export const sendOtp = async (email) => {
  try {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (storedOtp) {
      await redisClient.del(`otp:${email}`);
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await redisClient.set(`otp:${email}`, otp, "EX", 300);
    const otpTemplate = template.otpTemplate(otp);
    sendEmail(email, "Your OTP for Login", otpTemplate);
    return true;
  } catch (error) {
    console.error("Error in sending Otp");
    return false;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const storedOtp = await redisClient.get(`otp:${email}`);

    if (storedOtp && storedOtp === otp) {
      await redisClient.del(`otp:${email}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error in verifying OTP: ", error);
    return false;
  }
};
