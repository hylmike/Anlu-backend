import { Strategy } from 'passport-jwt';
import 'dotenv/config';
import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';
import { Reader } from '../reader/reader.interface';
import { Librarian } from '../librarian/librarian.interface';
declare const UserJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class UserJwtStrategy extends UserJwtStrategy_base {
    private readonly readerService;
    constructor(readerService: ReaderService);
    validate(payload: any): Promise<Reader | undefined>;
}
declare const LibJwtStrategy_base: new (...args: any[]) => Strategy;
export declare class LibJwtStrategy extends LibJwtStrategy_base {
    private readonly libService;
    constructor(libService: LibrarianService);
    validate(payload: any): Promise<Librarian | undefined>;
}
export {};
