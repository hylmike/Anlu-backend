import { Document } from 'mongoose';

export interface Book {
  _id: string;
  bookTitle: string;
  isbnCode: string;
  category: string;
  format: string;
  author: string;
  language: string;
  publisher: string;
  publishDate: Date;
  purchaseDate: Date;
  price: number;
  coverPic: string;
  bookFile: string;
  desc: string;
  keyword: string;
  isActive: boolean;
  createDate: Date;
  creator: string;
  readTimes: number;
  readDuration: number;
  initialScore: number;
  popularScore: number;
  comments: [string];
  readHistory: [string];
}

export type BookDocument = Book & Document;

export interface BookReadRecord {
  _id: string;
  book: string;
  readerID: string;
  startTime: Date;
  duration: number;
}

export type BookReadRecordDocument = BookReadRecord & Document;

export interface BookComment {
  _id: string;
  book: string;
  readerName: string;
  title: string;
  comment: string;
  createTime: Date;
}

export type BookCommentDocument = BookComment & Document;

export interface BookWishList {
  _id: string;
  bookTitle: string;
  readerID: string;
  language: string;
  createTime: Date;
  status: string;
}

export type BookWishDocument = BookWishList & Document;
