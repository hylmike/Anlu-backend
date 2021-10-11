"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSchema = exports.ReaderSchema = exports.ReaderReadHistorySchema = exports.ReaderProfileSchema = void 0;
const mongoose = require("mongoose");
exports.ReaderProfileSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    birthday: Date,
    phoneNumber: String,
    address: {
        homeAddress: String,
        province: String,
        postcode: String,
    },
    readTimes: Number,
    readDuration: Number,
    score: Number,
    securityQuestion: String,
    securityAnswer: String,
});
exports.ReaderReadHistorySchema = new mongoose.Schema({
    bookID: String,
    currentPage: Number,
    startTime: Date,
    lastReadTime: Date,
    readTimes: Number,
    readDuration: Number,
});
exports.ReaderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: false,
    },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true },
    registerDate: Date,
    isActive: { type: Boolean, default: true },
    currentRefreshToken: { type: String, select: false },
    favouriteBook: [{ bookID: String, createDate: Date }],
    readerProfile: exports.ReaderProfileSchema,
    readHistory: [exports.ReaderReadHistorySchema],
});
exports.TokenSchema = new mongoose.Schema({
    readerName: String,
    email: String,
    token: String,
    createTime: Date,
});
//# sourceMappingURL=reader.schema.js.map