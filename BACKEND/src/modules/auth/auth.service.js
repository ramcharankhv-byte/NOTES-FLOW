import { asyncHandler } from "../utils/asynchandler.js";
import { OAuth2Client } from "google-auth-library";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "./auth.model.js";
import jwt from "jsonwebtoken";

export const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // console.log("access token : ", accessToken);
    // console.log("refresh token: ", refreshToken);

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Unknown Error Occured while creating tokens");
  }
};

export const createUser = async (username, email, password) => {
  if (await User.findOne({ $or: [{ email: email }, { username: username }] })) {
    throw new ApiError(409, "user already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  await user.save();

  // Generate tokens after user creation
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return { createdUser, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordValid = await user.isPassCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "wrong password entered");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return { loggedInUser, accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken) => {
  // console.log("cookie: ", req.cookies);
  // console.log("cookie-header: ", req.headers.cookie);

  const incomingToken = refreshToken;

  // console.log("incoming token : ", incomingToken);

  if (!incomingToken) {
    throw new ApiError(404, "No refresh token found please relogin");
  }

  const decodedToken = await jwt.verify(incomingToken, process.env.JWT_SECRET);

  // console.log("decoded token :", decodedToken);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid Token");
  }

  if (incomingToken !== user?.refreshToken) {
    throw new ApiError(401, "No Token Found in DATABASE");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id,
  );

  user.refreshToken = refreshToken;

  await user.save();

  return { accessToken, refreshToken };
};
