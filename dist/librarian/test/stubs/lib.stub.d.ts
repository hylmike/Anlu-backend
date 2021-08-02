import 'dotenv/config';
import { Librarian, OperationLog } from '../../librarian.interface';
export declare const libData: Librarian;
export declare const libStub: () => Librarian;
export declare const accessTokenStub: () => {
    token_info: string;
    expireIn: string;
    role: string;
};
export declare const refreshTokenStub: () => {
    refreshToken_Cookie: string;
    refreshToken: string;
};
export declare const logData: OperationLog;
export declare const optLogStub: () => OperationLog;
