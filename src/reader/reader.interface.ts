import { Document } from 'mongoose';
import { Request } from 'express';

export interface ReaderProfile {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthday: Date;
  phoneNumber: string;
  address: {
    homeAddress: string;
    province: string;
    postcode: string;
  };
  readTimes: number;
  readDuration: number;
  score: number;
  securityQuestion: string;
  securityAnswer: string;
}

export type ReaderProDocument = ReaderProfile & Document;

export interface Reader {
  _id: string;
  username: string;
  password: string;
  email: string;
  isActive: boolean;
  registerDate: Date;
  currentRefreshToken: string;
  favouriteBook: [{ bookID: string; createDate: Date }];
  readerProfile: ReaderProfile;
  readHistory: [ReaderReadHistory];
}

export type ReaderDocument = Reader & Document;

export interface RequestWithReader extends Request {
  user: Reader;
}

export interface ReaderReadHistory {
  _id: string;
  bookID: string;
  currentPage: number;
  startTime: Date;
  lastReadTime: Date;
  readTimes: number;
  readDuration: number;
}

export type ReaderReadHisDocument = ReaderReadHistory & Document;

export interface Token {
  _id: string;
  readerName: string;
  email: string;
  token: string;
  createTime: Date;
}

export type TokenDocument = Token & Document;
