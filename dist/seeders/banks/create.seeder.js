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
exports.seedBanks = void 0;
const db_config_1 = __importDefault(require("../../app/config/db.config"));
const seedBanks = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Sample bank data
    const banks = [
        { value: "Bank of Abysinia" },
        { value: "Commercial Bank of Ethiopia" },
        { value: "Zemen Bank" },
        { value: "Nib Bank" },
        { value: "Zamzam Bank" },
    ];
    // Create banks
    for (const bank of banks) {
        yield db_config_1.default.bank.upsert({
            where: {
                // Since there's no unique field other than id, we'll use a compound where condition
                id: ((_a = (yield db_config_1.default.bank.findFirst({ where: { value: bank.value } }))) === null || _a === void 0 ? void 0 : _a.id) ||
                    -1,
            },
            update: {
                value: bank.value,
            },
            create: {
                value: bank.value,
            },
        });
    }
    console.log(`${banks.length} banks seeded successfully.`);
});
exports.seedBanks = seedBanks;
