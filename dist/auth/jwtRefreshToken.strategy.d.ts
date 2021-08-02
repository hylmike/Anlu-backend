import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';
import 'dotenv/config';
declare const UserJwtRefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class UserJwtRefreshTokenStrategy extends UserJwtRefreshTokenStrategy_base {
    private readonly readerService;
    constructor(readerService: ReaderService);
    validate(request: Request, payload: any): Promise<import("../reader/reader.interface").Reader>;
}
declare const LibJwtRefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class LibJwtRefreshTokenStrategy extends LibJwtRefreshTokenStrategy_base {
    private readonly libService;
    constructor(libService: LibrarianService);
    validate(request: Request, payload: any): Promise<import("../librarian/librarian.interface").Librarian>;
}
export {};
