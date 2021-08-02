import 'dotenv/config';
import { Reader } from '../../reader.interface';
export declare const readerData: Reader;
export declare const readerStub: () => Reader;
export declare const accessTokenStub: () => {
    token_info: string;
    expireIn: string;
};
export declare const refreshTokenStub: () => {
    refreshToken_Cookie: string;
    refreshToken: string;
};
