import express from "express";

import * as BanksController from "./controllers/branch.controller";
import * as BanksFilter from "./filters/branch.filter";
import * as UserAuthMiddleware from "../auth/middlewares/auth.middleware";
// import * as Permissions from "../permission/enums/permission.enum";

const router = express.Router();

router.route("/").get(
  UserAuthMiddleware.verifyUser,
  // UserAuthMiddleware.restrictUser(Permissions.MemberPermission.MEMBER_VIEW),
  BanksFilter.getBanks,
  BanksController.getBanks
);

router.route("/:id").get(
  UserAuthMiddleware.verifyUser,
  // UserAuthMiddleware.restrictUser(Permissions.MemberPermission.MEMBER_VIEW),
  BanksController.getBank
);

export default router;
