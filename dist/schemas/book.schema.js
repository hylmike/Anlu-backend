"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookWishSchema = exports.BookCommentSchema = exports.BookReadRecordSchema = exports.BookSchema = void 0;
const mongoose = require("mongoose");
exports.BookSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        index: true,
        unique: true,
        trim: true,
        required: true,
    },
    isbnCode: {
        type: String,
        trim: true,
    },
    category: { type: String, required: true },
    format: { type: String, required: true },
    author: { type: String, required: true },
    language: { type: String, required: true },
    publisher: String,
    publishDate: Date,
    purchaseDate: Date,
    price: Number,
    coverPic: { type: String, required: true },
    bookFile: { type: String, required: true },
    desc: String,
    keywords: String,
    isActive: { type: Boolean, default: true },
    createDate: Date,
    creator: String,
    readTimes: Number,
    readDuration: Number,
    initialScore: Number,
    popularScore: { type: Number, index: true },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookComment',
        },
    ],
    readHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BookReadRecord',
        },
    ],
});
exports.BookReadRecordSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    readerID: String,
    startTime: Date,
    duration: Number,
});
exports.BookCommentSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    readerName: String,
    title: String,
    comment: String,
    createTime: Date,
});
exports.BookWishSchema = new mongoose.Schema({
    bookTitle: String,
    language: String,
    format: String,
    creator: String,
    createTime: Date,
    status: String,
});
//# sourceMappingURL=book.schema.js.map