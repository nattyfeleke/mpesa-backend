"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = exports.FILTERS = exports.FILENAME = exports.DESTINANTIONS = exports.RESOURCES = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const app_error_1 = __importDefault(require("../shared/errors/app.error"));
exports.RESOURCES = {
    BANK: "BANK",
};
exports.DESTINANTIONS = {
    IMAGE: {
        BANK: "../../../public/images/bank",
    },
};
exports.FILENAME = {
    BANK: (originalname) => `bank-${(0, uuid_1.v4)()}${path_1.default.extname(originalname)}`,
};
exports.FILTERS = {
    IMAGE: {
        CONTENT: ["image/png", "image/jpg", "image/jpeg"],
        MESSAGE: "Only .png, .jpg and .jpeg format allowed!",
    },
};
const multerConfig = (resource, destination, filter) => {
    /**
     * Multer disk storage
     */
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path_1.default.join(__dirname, destination));
        },
        filename: function (req, file, cb) {
            cb(null, exports.FILENAME[resource](file.originalname));
        },
    });
    /**
     * Multer file upload with filters
     */
    const upload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: 1024 * 1024 * 1024,
            fieldSize: 1024 * 1024 * 1024,
        },
        fileFilter: function (req, file, cb) {
            if (filter.CONTENT.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(null, false);
                return cb(new app_error_1.default(filter.MESSAGE, 400));
            }
        },
    });
    return upload;
};
exports.multerConfig = multerConfig;
