"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBankValidator = void 0;
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../../../shared/middlewares/validate.middleware");
exports.createBankValidator = [
    (0, express_validator_1.check)("value")
        .not()
        .isEmpty()
        .withMessage("Bank value is required.")
        .isString()
        .withMessage("Bank value must be a string"),
    validate_middleware_1.validate,
];
