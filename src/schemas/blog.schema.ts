import * as mongoose from 'mongoose';

export const BlogSchema = new mongoose.Schema({
  topic: String,
  category: String,
  author: String,
  content: String,
  createTime: { type: Date, index: true },
  keyword: String,
});
