import otpGenerator from "otp-generator";
import Redis from "ioredis";
import nodemailer from "nodemailer";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP",
      text: `Your Otp for login is ${otp} This OTP is valid for 5 minutes`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <h2 style="color: #333333; text-align: center;">Your OTP for Login</h2>
      <p style="font-size: 16px; color: #555555;">Your OTP for login is 
        <strong style="font-size: 18px; color: #4CAF50;">${otp}</strong> and is valid for <strong style="font-size: 18px; color: #4CAF50;">5 minutes</strong>.
      </p>
    </div>`,
    };
    await transpoter.sendMail(mailOptions);
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
