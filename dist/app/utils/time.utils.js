"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.getToday = void 0;
const getToday = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return today;
};
exports.getToday = getToday;
const formatDate = () => {
    const date = new Date(new Date().toLocaleDateString('en-US'));
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.formatDate = formatDate;
