"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatDate = () => {
    const date = new Date(new Date().toLocaleDateString('en-US'));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.default = formatDate;
