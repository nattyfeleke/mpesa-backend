import { NextFunction, Request, Response } from "express";
import { GetBanksQueryParams } from "../interfaces/query-params.interface";
import prisma from "../../../config/db.config";
import { catchAsync } from "../../../config/error.config";
import AppError from "../../../shared/errors/app.error";

export const getBanks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as GetBanksQueryParams;
    const page = Number(query._page) || 1;
    const limit = Number(query._limit) || 5;
    const skip = (page - 1) * limit;
    console.log("req.filters");
    console.log(req.filters);
    const [banks, total] = await Promise.all([
      prisma.bank.findMany({
        where: { ...req.filters },
        include: {},
        take: limit,
        skip,
      }),
      prisma.bank.count({
        where: { ...req.filters },
      }),
    ]);
    res.status(200).json({
      status: "success",
      data: {
        banks,
        meta: {
          page,
          limit,
          total,
        },
      },
    });
  }
);

export const getBank = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bank = await prisma.bank.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {},
    });

    if (!bank) {
      return next(
        new AppError(`Bank with ID ${req.params.id} does not exist`, 400)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        bank,
      },
    });
  }
);
