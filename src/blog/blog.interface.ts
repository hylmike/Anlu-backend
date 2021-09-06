import { Document } from 'mongoose';

export interface Blog {
  _id: string;
  topic: string;
  category: string;
  creator: string;
  content: string;
  createTime: Date;
  keywords: string;
}

export type BlogDocument = Blog & Document;
