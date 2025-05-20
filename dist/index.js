"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const envalid_1 = require("envalid");
require("dotenv/config");
const morgan_1 = __importDefault(require("morgan"));
const error_config_1 = require("./app/config/error.config");
const app_error_1 = __importDefault(require("./app/shared/errors/app.error"));
/*Routes */
const auth_route_1 = __importDefault(require("./app/features/auth/auth.route"));
const bank_route_1 = __importDefault(require("./app/features/bank/bank.route"));
const env = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, envalid_1.port)(),
    NODE_ENV: (0, envalid_1.str)(),
});
/**
 * Connect to database
 */
const app = (0, express_1.default)();
/**
 * Global Middlewares
 */
if (env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
/**
 * REST API Route Middleware
 */
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/banks", bank_route_1.default);
/**
 * Non existing url middleware
 */
app.use("*", (req, res, next) => {
    return next(new app_error_1.default(`Can't find ${req.originalUrl} on the server!`, 404));
});
/**
 * Error middleware controller
 */
app.use(error_config_1.errorController);
/**
 * Start the server
 */
const PORT = env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
