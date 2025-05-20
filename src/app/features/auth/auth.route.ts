import express from "express";
import * as AuthController from "./controllers/auth.controller";
import * as UserAuthMiddleware from "./middlewares/auth.middleware";
import { loginValidator } from "./validators/login.validator";

const router = express.Router();

// Log in user
router.post("/login", loginValidator, AuthController.loginUser);

router.get(
  "/",
  UserAuthMiddleware.verifyUser,
  AuthController.getAuthenticatedUser
);

export default router;
