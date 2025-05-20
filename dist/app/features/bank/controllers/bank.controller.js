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
exports.getBank = exports.getBanks = void 0;
const db_config_1 = __importDefault(require("../../../config/db.config"));
const error_config_1 = require("../../../config/error.config");
const app_error_1 = __importDefault(require("../../../shared/errors/app.error"));
exports.getBanks = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const page = Number(query._page) || 1;
    const limit = Number(query._limit) || 5;
    const skip = (page - 1) * limit;
    console.log("req.filters");
    console.log(req.filters);
    const [banks, total] = yield Promise.all([
        db_config_1.default.bank.findMany({
            where: Object.assign({}, req.filters),
            include: {},
            take: limit,
            skip,
        }),
        db_config_1.default.bank.count({
            where: Object.assign({}, req.filters),
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
}));
exports.getBank = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bank = yield db_config_1.default.bank.findUnique({
        where: {
            id: Number(req.params.id),
        },
        include: {},
    });
    if (!bank) {
        return next(new app_error_1.default(`Bank with ID ${req.params.id} does not exist`, 400));
    }
    res.status(200).json({
        status: "success",
        data: {
            bank,
        },
    });
}));
