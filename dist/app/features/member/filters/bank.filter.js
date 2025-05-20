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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembers = void 0;
const error_config_1 = require("../../../config/error.config");
exports.getMembers = (0, error_config_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    let filters = {};
    for (const key in query) {
        console.log("key", key);
        if (["stateId", "typeId", "regionId", "councilFellowshipId"].includes(key)) {
            console.log("key", key);
            //@ts-ignore
            const value = query[key];
            filters = Object.assign(Object.assign({}, filters), { [key]: value });
        }
    }
    if (query.isInEthiopia) {
        const isInEthiopia = query.isInEthiopia === "yes" ? true : false;
        filters = Object.assign(Object.assign({}, filters), { isInEthiopia });
    }
    if (query._search) {
        filters = Object.assign(Object.assign({}, filters), { OR: [
                {
                    name: {
                        contains: query._search,
                        //   mode: "insensitive",
                    },
                },
                {
                    certificateNo: {
                        contains: query._search,
                        //   mode: "insensitive",
                    },
                },
                {
                    city: {
                        contains: query._search,
                        //   mode: "insensitive",
                    },
                },
            ] });
    }
    if (query.reportYear) {
        filters = Object.assign(Object.assign({}, filters), { reports: {
                some: {
                    year: Number(query.reportYear), // Filter by the year 2014
                    statusId: query.reportStatus
                },
            } });
    }
    req.filters = filters;
    next();
}));
