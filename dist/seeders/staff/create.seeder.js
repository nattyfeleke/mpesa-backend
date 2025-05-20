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
exports.seedStaff = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_config_1 = __importDefault(require("../../app/config/db.config"));
const role_type_enum_1 = require("../../app/features/role/enums/role-type.enum");
const data_lookup_enum_1 = require("../../app/features/data-lookup/enums/data-lookup.enum");
const envalid_1 = require("envalid");
const env = (0, envalid_1.cleanEnv)(process.env, {
    SUPER_ADMIN_EMAIL: (0, envalid_1.email)(),
    SUPER_ADMIN_PASSWORD: (0, envalid_1.str)(),
});
const seedStaff = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = (yield db_config_1.default.dataLookup.findUnique({
        where: { value: data_lookup_enum_1.CommonObjectState.ACTIVE }
    }));
    const owner = (yield db_config_1.default.role.findFirst({
        where: { type: {
                value: role_type_enum_1.RoleType.OWNER
            } }
    }));
    const password = yield bcryptjs_1.default.hash(env.SUPER_ADMIN_PASSWORD, 10);
    const superAdmin = yield db_config_1.default.staff.upsert({
        where: { email: env.SUPER_ADMIN_EMAIL },
        update: {
            firstName: 'Super',
            lastName: 'Admin',
            fullName: 'Super Admin',
            password: password,
            phoneNumber: '123456789',
            roleId: owner.id,
            stateId: state.id
        },
        create: {
            email: env.SUPER_ADMIN_EMAIL,
            firstName: 'Super',
            lastName: 'Admin',
            fullName: 'Super Admin',
            password: password,
            phoneNumber: '123456789',
            roleId: owner.id,
            stateId: state.id
        }
    });
});
exports.seedStaff = seedStaff;
