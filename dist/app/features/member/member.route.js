"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const MemberController = __importStar(require("./controllers/member.controller"));
const MembersFilter = __importStar(require("./filters/member.filter"));
const StaffAuthMiddleware = __importStar(require("../auth/middlewares/auth.middleware"));
const Permissions = __importStar(require("../permission/enums/permission.enum"));
const create_member_validator_1 = require("./validators/create-member.validator");
const edit_member_validator_1 = require("./validators/edit-member.validator");
const inactive_member_validator_1 = require("./validators/inactive-member.validator");
const create_seeder_1 = require("../../../seeders/members/selam/create.seeder");
const router = express_1.default.Router();
router
    .route("/")
    .get(StaffAuthMiddleware.verifyStaff, StaffAuthMiddleware.restrictStaff(Permissions.MemberPermission.MEMBER_VIEW), MembersFilter.getMembers, MemberController.getMembers)
    .put((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield (0, create_seeder_1.seedMembers)();
    res.json({
        status: "success",
        data: members,
    });
}))
    .post(StaffAuthMiddleware.verifyStaff, StaffAuthMiddleware.restrictStaff(Permissions.MemberPermission.MEMBER_ADD), create_member_validator_1.createMemberValidator, MemberController.createMember);
router
    .route("/:id")
    .get(StaffAuthMiddleware.verifyStaff, StaffAuthMiddleware.restrictStaff(Permissions.MemberPermission.MEMBER_VIEW), MemberController.getMember)
    .patch(StaffAuthMiddleware.verifyStaff, StaffAuthMiddleware.restrictStaff(Permissions.MemberPermission.MEMBER_CHANGE), edit_member_validator_1.editMemberValidator, MemberController.updateMember);
router
    .route("/:id/active")
    .patch(StaffAuthMiddleware.verifyStaff, StaffAuthMiddleware.restrictStaff(Permissions.MemberPermission.MEMBER_DEACTIVATE), MemberController.activeMember);
router
    .route("/:id/in-active")
    .patch(StaffAuthMiddleware.verifyStaff, StaffAuthMiddleware.restrictStaff(Permissions.MemberPermission.MEMBER_DEACTIVATE), inactive_member_validator_1.inactiveMemberValidator, MemberController.inactiveMember);
exports.default = router;
