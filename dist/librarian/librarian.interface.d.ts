import { Request } from 'express';
import { Document } from 'mongoose';
export interface Librarian {
    _id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    registerDate: Date;
    currentRefreshToken: string;
    isActive: boolean;
}
export declare type LibDocument = Librarian & Document;
export interface RequestWithLib extends Request {
    user: Librarian;
}
export interface OperationLog {
    _id: string;
    operator: string;
    time: Date;
    operation: string;
    details: string;
}
export declare type OptLogDocument = OperationLog & Document;
