import { User } from "@prisma/client";
import { IFilter } from "../../src/app/shared/interfaces/filter.interface";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAdminRole: boolean;
      filters: IFilter;
    }
  }
}
