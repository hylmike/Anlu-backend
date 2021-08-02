"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = void 0;
const mongoose = require("mongoose");
exports.BlogSchema = new mongoose.Schema({
    topic: String,
    category: String,
    author: String,
    content: String,
    createTime: { type: Date, index: true },
    keyword: String,
});
//# sourceMappingURL=blog.schema.js.map