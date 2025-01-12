import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { sendOtp, verifyOtp } from "../utils/otpService.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ ValidityBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went Wrong while generating refresh and access token"
    );
  }
};

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
  user = await User.create({
    email,
    isProfileComplete: false,
  });

  const otpSent = await sendOtp(email);
  if (!otpSent) {
    throw new ApiError(500, "Failed to Send Otp, pls try again");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Created Successfully"));
});

const verifyUserOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!otp) {
    throw new ApiError(400, "Otp required to login");
  }

  const user = await User.findOne({ email }).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(400, "User Does not exist");
  }

  const isValidOtp = await verifyOtp(email, otp);
  if (!isValidOtp) {
    throw new ApiError(400, "Otp Not Valid or Expired");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User Not found");
  }
  const otpSent = await sendOtp(email);
  if (!otpSent) {
    throw new ApiError(500, "Failed to Send Otp, pls try again");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, email, "Otp has been resent Succesfully"));
});

export { loginUser, verifyUserOtp, resendOtp };
