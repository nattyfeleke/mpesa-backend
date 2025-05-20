import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { cleanEnv, str } from "envalid";
import { catchAsync } from "../../../config/error.config";
import AppError from "../../../shared/errors/app.error";
import prisma from "../../../config/db.config";

const env = cleanEnv(process.env, {
  JWT_ACCESS_SECRET_KEY: str(),
  JWT_ACCESS_EXPIRES_IN: str(),
  JWT_REFRESH_SECRET_KEY: str(),
  JWT_REFRESH_EXPIRES_IN: str(),
});

export const getAuthenticatedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.user");
    console.log(req.user);
    let user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });
    res.json({
      data: {
        status: "success",
        user,
      },
    });
  }
);
export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.body");
    console.log(req.body);
    const { email, password } = req.body;

    let user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return next(new AppError(`User not found`, 400));
    }

    // console.log(user);
    //Check Password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(400).json({
        errors: [{ msg: "Password not correct." }],
      });
    }

    //Return jsonwebtoken :to login the user
    const payload = {
      user: {
        id: user.id,
      },
    };

    const accessToken = await promisify(jwt.sign)(
      payload,
      //@ts-ignore
      env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
    );
    const refreshToken = await promisify(jwt.sign)(
      payload,
      //@ts-ignore
      env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      }
    );
    res.status(200).json({
      data: {
        status: "success",
        user,
        accessToken,
        refreshToken,
      },
    });
  }
);
