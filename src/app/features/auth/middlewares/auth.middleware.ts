import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import { cleanEnv, str } from "envalid";
import AppError from "../../../shared/errors/app.error";
import { catchAsync } from "../../../config/error.config";
import prisma from "../../../config/db.config";

const env = cleanEnv(process.env, {
  JWT_ACCESS_SECRET_KEY: str(),
  JWT_ACCESS_EXPIRES_IN: str(),
  JWT_REFRESH_SECRET_KEY: str(),
  JWT_REFRESH_EXPIRES_IN: str(),
});

export const verifyUser = catchAsync(
  async (req: Request, _: Response, next: NextFunction) => {
    let token: string | null = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Your not logged in", 401));
    }

    //Verify token

    //@ts-ignore
    const payload = (await promisify(jwt.verify)(
      token,
      //@ts-ignore
      env.JWT_ACCESS_SECRET_KEY
    )) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: payload.user.id,
      },
    });

    if (!user) {
      return next(
        new AppError("The user related to the token no longer exists", 401)
      );
    }

    req.user = user;

    next();
  }
);

export const restrictUser = (permission: string) =>
  catchAsync(async (req: Request, _: Response, next: NextFunction) => {
    if (req.user) {
      //@ts-ignore
      //   const permissions = req.user.role.permissions.map(
      //     (permission: RolePermission) => permission.codeName
      //   );
      //   if (!permissions.includes(permission)) {
      //     return next(
      //       new AppError("You're not allowed to perform current operation", 403)
      //     );
      //   }
    }
    next();
  });

export function restrictToOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.id != req.params.id) {
    return next(new AppError(`You can only update your own profile`, 400));
  }
  next();
}
