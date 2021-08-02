import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { RequestWithLib } from 'src/librarian/librarian.interface';
declare const UserLocalStrategy_base: new (...args: any[]) => Strategy;
export declare class UserLocalStrategy extends UserLocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<any>;
}
declare const LibLocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LibLocalStrategy extends LibLocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(username: string, password: string): Promise<RequestWithLib>;
}
export {};
