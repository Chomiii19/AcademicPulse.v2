import { Response } from "express";
import signToken from "./signToken";
import IUser from "../@types/userInterfaces";

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  const cookieExpiry = Number(process.env.JWT_COOKIE_EXPIRES_IN);
  console.log(cookieExpiry);

  if (!cookieExpiry)
    throw new Error("There was an error finding the secret key.");

  const cookieOptions: {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    expires: new Date(Date.now() + cookieExpiry * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("authToken", token, cookieOptions);

  //   res.redirect("/app");
  res.status(statusCode).json({
    status: "Success",
    data: {
      user,
    },
  });
};

export default createSendToken;
