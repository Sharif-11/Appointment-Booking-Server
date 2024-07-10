"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilityFunction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stringToObjectId = (id) => {
    const objectId = new mongoose_1.default.Types.ObjectId(id);
    return objectId;
};
exports.utilityFunction = { stringToObjectId };
