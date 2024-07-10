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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const user_auth_1 = require("./user.auth");
const user_model_1 = __importDefault(require("./user.model"));
const user_service_1 = require("./user.service");
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNo } = req.body;
        const user = yield user_service_1.userServices.findUserByPhone(phoneNo);
        if (!user || !bcrypt_1.default.compareSync(req.body.password, user.password)) {
            throw new Error('Phone number or password is wrong');
        }
        const token = yield user_auth_1.userAuth.createToken(phoneNo, user.role);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = yield user_model_1.default.findOne({
            phoneNo,
        })
            .populate('userId')
            .lean(), { password, userId } = _a, others = __rest(_a, ["password", "userId"]);
        const { role } = others;
        const { _id } = user, rest = __rest(user, ["_id"]);
        const userInfo = Object.assign({ userId: _id, _id: others._id, role,
            phoneNo }, rest);
        res.cookie('token', token, {
            maxAge: 30 * 24 * 3600 * 1000,
        });
        res.json({
            status: true,
            message: 'log in successful',
            data: userInfo,
        });
    }
    catch (error) {
        res.status(401).json({
            status: false,
            message: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
const userLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNo } = req.body;
        const user = yield user_service_1.userServices.findUserByPhone(phoneNo);
        if (!user ||
            !bcrypt_1.default.compareSync(req.body.password, user.password) ||
            (user === null || user === void 0 ? void 0 : user.role) === 'Doctor') {
            throw new Error('Phone number or password is wrong');
        }
        const token = yield user_auth_1.userAuth.createToken(phoneNo, user.role);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _b = yield user_model_1.default.findOne({
            phoneNo,
        })
            .populate('userId')
            .lean(), { password, userId } = _b, others = __rest(_b, ["password", "userId"]);
        const { role } = others;
        const { _id } = user, rest = __rest(user, ["_id"]);
        const userInfo = Object.assign({ userId: _id, _id: others._id, role,
            phoneNo }, rest);
        res.cookie('token', token, {
            maxAge: 30 * 24 * 3600 * 1000,
        });
        res.json({
            status: true,
            message: 'log in successful',
            data: userInfo,
        });
    }
    catch (error) {
        res.status(401).json({
            status: false,
            message: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
const checkLoginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (!err) {
                const { phoneNo } = decoded;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const _c = yield user_model_1.default.findOne({
                    phoneNo,
                })
                    .populate('userId')
                    .lean(), { password, userId } = _c, others = __rest(_c, ["password", "userId"]);
                const { role } = others;
                const rest = __rest(userId, []);
                const userInfo = Object.assign({ 
                    // userId: _id,
                    _id: others._id, role,
                    phoneNo }, rest);
                res.status(200).json({
                    status: true,
                    message: 'already logged in',
                    data: userInfo,
                });
            }
            else {
                res.status(500).json({
                    status: false,
                    message: 'not logged in',
                });
            }
        }));
    }
    else {
        res.status(200).json({
            status: false,
            message: 'not logged in',
        });
    }
});
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { password } = req.body;
        const { oldPassword } = req.body;
        const { phoneNo } = req.decoded;
        const user = yield user_service_1.userServices.findUserByPhone(phoneNo);
        if (!user || !bcrypt_1.default.compareSync(oldPassword, user.password)) {
            throw new Error('Password is wrong');
        }
        password = yield bcrypt_1.default.hash(password, Number(config_1.default.salt_round));
        const updatedUser = yield user_service_1.userServices.updateUserPassword(phoneNo, password);
        res.status(200).json({
            status: true,
            message: 'password updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            status: false,
            message: error === null || error === void 0 ? void 0 : error.message,
        });
    }
});
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('token');
    res.status(200).json({
        status: true,
        message: 'Logged out',
    });
});
exports.userControllers = {
    loginController,
    checkLoginController,
    updatePasswordController,
    logoutController,
    userLoginController,
};
