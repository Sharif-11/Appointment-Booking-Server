"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddlewares = void 0;
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyTokenMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'No token provided',
        });
    }
    jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: false,
                message: 'Failed to authenticate token',
            });
        }
        req.decoded = decoded;
        next();
    });
};
const verifyUser = (userRole) => {
    const identifyRole = (req, res, next) => {
        const { role } = req.decoded;
        if (role === userRole) {
            next();
        }
        else {
            res.status(403).json({
                status: false,
                message: `Failed to authenticate ${userRole}`,
            });
        }
    };
    return identifyRole;
};
exports.authMiddlewares = { verifyTokenMiddleware, verifyUser };
