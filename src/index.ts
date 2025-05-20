import express, { NextFunction, Request, Response } from "express";

import cors from "cors";
import path from "path";
import { cleanEnv, port, str } from "envalid";
import "dotenv/config";
import morgan from "morgan";

import { errorController } from "./app/config/error.config";
import AppError from "./app/shared/errors/app.error";

/*Routes */
import authRouter from "./app/features/auth/auth.route";
import banksRouter from "./app/features/bank/bank.route";

const env = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
});

/**
 * Connect to database
 */

const app = express();

/**
 * Global Middlewares
 */

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

/**
 * REST API Route Middleware
 */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/banks", banksRouter);

/**
 * Non existing url middleware
 */

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on the server!`, 404)
  );
});

/**
 * Error middleware controller
 */
app.use(errorController);

/**
 * Start the server
 */
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
