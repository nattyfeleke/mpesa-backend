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
exports.inactiveMember = exports.activeMember = exports.updateMember = exports.createMember = exports.getMember = exports.getMembers = void 0;
const db_config_1 = __importDefault(require("../../../config/db.config"));
const error_config_1 = require("../../../config/error.config");
const app_error_1 = __importDefault(require("../../../shared/errors/app.error"));
const data_lookup_enum_1 = require("../../data-lookup/enums/data-lookup.enum");
exports.getMembers = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const page = Number(query._page) || 1;
    const limit = Number(query._limit) || 5;
    const skip = (page - 1) * limit;
    console.log("req.filters");
    console.log(req.filters);
    const [members, total] = yield Promise.all([
        db_config_1.default.member.findMany({
            where: Object.assign({}, req.filters),
            include: {
                boardMembers: true,
                type: true,
                state: true,
                region: true,
                reports: { include: { status: true } },
            },
            take: limit,
            skip,
        }),
        db_config_1.default.member.count({
            where: Object.assign({}, req.filters),
        }),
    ]);
    res.status(200).json({
        status: "success",
        data: {
            members,
            meta: {
                page,
                limit,
                total,
            },
        },
    });
}));
exports.getMember = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield db_config_1.default.member.findUnique({
        where: {
            id: req.params.id,
        },
        include: {
            boardMembers: true,
            type: true,
            state: true,
            fellowship: true,
            region: true,
            reports: { include: { status: true } },
        },
    });
    if (!member) {
        return next(new app_error_1.default(`Member with ID ${req.params.id} does not exist`, 400));
    }
    res.status(200).json({
        status: "success",
        data: {
            member,
        },
    });
}));
exports.createMember = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let { name, country, regionId, city, subcity, zone, district, houseNumber, poBoxNumber, email, phoneNumber, certificateNo, certificateIssuedDate, isInEthiopia, councilFellowshipId, typeId, stateId, boardMembers, } = req.body;
    if (!stateId) {
        const state = (yield db_config_1.default.dataLookup.findUnique({
            where: { value: data_lookup_enum_1.CommonObjectState.ACTIVE },
        }));
        stateId = state.id;
    }
    const member = yield db_config_1.default.member.create({
        data: Object.assign(Object.assign({ name: name, councilFellowshipId: councilFellowshipId, certificateNo: certificateNo, certificateIssuedDate: new Date(certificateIssuedDate), isInEthiopia: isInEthiopia, country: country }, (regionId && { regionId })), { city: city, subcity: subcity ? subcity : "", zone: zone ? zone : "", district: district ? district : "", houseNumber: houseNumber ? houseNumber : "", poBoxNumber: poBoxNumber ? poBoxNumber : "", email: email ? email : "", phoneNumber: phoneNumber ? phoneNumber : "", typeId: typeId, stateId: stateId, boardMembers: {
                create: boardMembers,
            } }),
        include: {
            boardMembers: true,
            type: true,
            state: true,
            region: true,
            reports: { include: { status: true } },
        },
    });
    res.status(200).json({
        status: "success",
        data: {
            member,
        },
    });
}));
exports.updateMember = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, certificateNo, certificateIssuedDate, isInEthiopia, councilFellowshipId, memberCategoryId, regionId, stateId, phoneNumber, email, typeId, boardMembers, } = req.body;
    let member = yield db_config_1.default.member.findUnique({
        where: { id: req.params.id },
        include: {},
    });
    if (!member) {
        return next(new app_error_1.default(`Member with ID ${req.params.id} does not exist`, 400));
    }
    let updatedData = { isInEthiopia: Boolean(isInEthiopia) };
    if (typeId)
        updatedData.typeId = typeId;
    if (regionId)
        updatedData.regionId = regionId;
    if (stateId)
        updatedData.stateId = stateId;
    if (name)
        updatedData.name = name;
    if (email)
        updatedData.email = email;
    if (phoneNumber)
        updatedData.phoneNumber = phoneNumber;
    if (certificateNo)
        updatedData.certificateNo = certificateNo;
    if (certificateIssuedDate)
        updatedData.certificateIssuedDate = new Date(certificateIssuedDate);
    if (councilFellowshipId)
        updatedData.councilFellowshipId = councilFellowshipId;
    if (memberCategoryId)
        updatedData.memberCategoryId = memberCategoryId;
    if (councilFellowshipId)
        updatedData.councilFellowshipId = councilFellowshipId;
    if (boardMembers) {
        yield Promise.all(boardMembers.map((boardMember) => __awaiter(void 0, void 0, void 0, function* () {
            yield db_config_1.default.boardMember.upsert({
                where: { id: boardMember.id }, // Assuming 'email' is a unique field
                update: {
                    fullName: boardMember.fullName,
                    phoneNumber: boardMember.phoneNumber,
                },
                create: {
                    memberId: member === null || member === void 0 ? void 0 : member.id,
                    fullName: boardMember.fullName,
                    phoneNumber: boardMember.phoneNumber,
                },
            });
        })));
    }
    member = yield db_config_1.default.member.update({
        where: { id: req.params.id },
        data: Object.assign({}, updatedData),
        include: {
            boardMembers: true,
            type: true,
            state: true,
            region: true,
            reports: { include: { status: true } },
        },
    });
    res.status(200).json({
        status: "success",
        data: {
            member,
        },
    });
}));
exports.activeMember = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let member = yield db_config_1.default.member.findUnique({
        where: { id: req.params.id },
        include: {},
    });
    if (!member) {
        return next(new app_error_1.default(`Member with ID ${req.params.id} does not exist`, 400));
    }
    const activeState = (yield db_config_1.default.dataLookup.findUnique({
        where: { value: data_lookup_enum_1.CommonObjectState.ACTIVE },
    }));
    member = yield db_config_1.default.member.update({
        where: { id: req.params.id },
        data: { stateId: activeState.id },
        include: {
            boardMembers: true,
            type: true,
            state: true,
            region: true,
            fellowship: true,
            reports: { include: { status: true } },
        },
    });
    res.status(200).json({
        status: "success",
        data: {
            member,
        },
    });
}));
exports.inactiveMember = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reason } = req.body;
    let member = yield db_config_1.default.member.findUnique({
        where: { id: req.params.id },
        include: {},
    });
    if (!member) {
        return next(new app_error_1.default(`Member with ID ${req.params.id} does not exist`, 400));
    }
    const inactiveState = (yield db_config_1.default.dataLookup.findUnique({
        where: { value: data_lookup_enum_1.CommonObjectState.IN_ACTIVE },
    }));
    member = yield db_config_1.default.member.update({
        where: { id: req.params.id },
        data: { stateId: inactiveState.id, reasonForInactive: reason },
        include: {
            boardMembers: true,
            type: true,
            state: true,
            region: true,
            fellowship: true,
            reports: { include: { status: true } },
        },
    });
    res.status(200).json({
        status: "success",
        data: {
            member,
        },
    });
}));
