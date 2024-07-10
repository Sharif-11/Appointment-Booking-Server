"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseUtility = void 0;
const successResponse = (message, data) => {
    return { status: true, message, data };
};
const errorResponse = (message, errors) => {
    return { status: false, message, errors };
};
exports.responseUtility = { successResponse, errorResponse };
