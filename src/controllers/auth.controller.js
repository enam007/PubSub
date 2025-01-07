import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { sendOtp } from "../utils/otpService.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const loginUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "Invalid email address.");
  }
  let user = await User.findOne({ email });
  console.log(user);
  if (user) {
    throw new ApiError(409, "User with this email already exist");
  }
  user = await User.create({ email, isSeller: false });

  const otpSent = await sendOtp(email);
  if (!otpSent) {
    throw new ApiError(500, "Failed to Send Otp, pls try again");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Created Successfully"));
});

export { loginUser };
