import { Model } from 'mongoose';
import { Logger } from 'winston';
import { ReaderDocument, TokenDocument } from './reader.interface';
import { ResetPwdDto } from './reader.dto';
export declare class TokenService {
    private readonly tokenModel;
    private readonly readerModel;
    private readonly logger;
    constructor(tokenModel: Model<TokenDocument>, readerModel: Model<ReaderDocument>, logger: Logger);
    createToken(email: string): Promise<{
        readerName: string;
        token: string;
    }>;
    verifyToken(readerName: any, tokenInfo: any): Promise<boolean>;
    delToken(readerName: string): Promise<string>;
    resetPwd(resetDto: ResetPwdDto): Promise<string>;
    verifyEmail(email: string): Promise<string>;
}
