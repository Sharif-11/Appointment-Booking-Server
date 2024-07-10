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
exports.userServices = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const findUserByPhone = (phoneNo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ phoneNo });
    return user;
});
const updateUserPassword = (phoneNo, password) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.default.updateOne({ phoneNo }, { password });
    return updatedUser;
});
exports.userServices = { findUserByPhone, updateUserPassword };
