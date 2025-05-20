"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.getAuthenticatedUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
const envalid_1 = require("envalid");
const error_config_1 = require("../../../config/error.config");
const app_error_1 = __importDefault(require("../../../shared/errors/app.error"));
const db_config_1 = __importDefault(require("../../../config/db.config"));
const env = (0, envalid_1.cleanEnv)(process.env, {
    JWT_ACCESS_SECRET_KEY: (0, envalid_1.str)(),
    JWT_ACCESS_EXPIRES_IN: (0, envalid_1.str)(),
    JWT_REFRESH_SECRET_KEY: (0, envalid_1.str)(),
    JWT_REFRESH_EXPIRES_IN: (0, envalid_1.str)(),
});
exports.getAuthenticatedUser = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("req.user");
    console.log(req.user);
    let user = yield db_config_1.default.user.findUnique({
        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
    });
    res.json({
        data: {
            status: "success",
            user,
        },
    });
}));
exports.loginUser = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body");
    console.log(req.body);
    const { email, password } = req.body;
    let user = yield db_config_1.default.user.findUnique({
        where: { email: email },
    });
    if (!user) {
        return next(new app_error_1.default(`User not found`, 400));
    }
    // console.log(user);
    //Check Password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
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
    const accessToken = yield (0, util_1.promisify)(jsonwebtoken_1.default.sign)(payload, 
    //@ts-ignore
    env.JWT_ACCESS_SECRET_KEY, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
    const refreshToken = yield (0, util_1.promisify)(jsonwebtoken_1.default.sign)(payload, 
    //@ts-ignore
    env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
    res.status(200).json({
        data: {
            status: "success",
            user,
            accessToken,
            refreshToken,
        },
    });
}));
