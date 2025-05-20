import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../config/error.config";
import { GetBanksQueryParams } from "../interfaces/query-params.interface";
import { IFilter } from "../../../shared/interfaces/filter.interface";

export const getBanks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as unknown as GetBanksQueryParams;
    let filters: IFilter = {};

    for (const key in query) {
      console.log("key", key);

      if (["stateId"].includes(key)) {
        console.log("key", key);

        //@ts-ignore
        const value = query[key];
        filters = {
          ...filters,
          [key]: value,
        };
      }
    }

    if (query._search) {
      filters = {
        ...filters,
        OR: [
          {
            value: {
              contains: query._search,
              //   mode: "insensitive",
            },
          },
        ],
      };
    }

    req.filters = filters;
    next();
  }
);
