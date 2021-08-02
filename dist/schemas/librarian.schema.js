"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationLogSchema = exports.LibrarianSchema = void 0;
const mongoose = require("mongoose");
exports.LibrarianSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    phoneNumber: String,
    registerDate: Date,
    creator: String,
    currentRefreshToken: { type: String, select: false },
    isActive: { type: Boolean, default: true },
});
exports.OperationLogSchema = new mongoose.Schema({
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Librarian',
    },
    time: Date,
    operation: String,
    details: String,
});
//# sourceMappingURL=librarian.schema.js.map