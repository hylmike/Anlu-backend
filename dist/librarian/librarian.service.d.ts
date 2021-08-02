import { Model } from 'mongoose';
import { Logger } from 'winston';
import { Librarian, LibDocument, OperationLog, OptLogDocument } from './librarian.interface';
import { RegisterLibDto, UpdateLibProfileDto, ChangeLibPwdDto, OperationLogDto } from './lib.dto';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
export declare class LibrarianService {
    private readonly logger;
    private libModel;
    private optLogModel;
    private readonly jwtService;
    constructor(logger: Logger, libModel: Model<LibDocument>, optLogModel: Model<OptLogDocument>, jwtService: JwtService);
    register(registerLibDto: RegisterLibDto): Promise<LibDocument>;
    getProfile(libID: any): Promise<Librarian | undefined>;
    updateProfile(updateLibDto: UpdateLibProfileDto): Promise<any>;
    changePwd(changeLibPwdDto: ChangeLibPwdDto): Promise<string>;
    login(request: any): Promise<{
        token_info: string;
        expireIn: string;
        role: any;
    }>;
    findOne(username: string): Promise<Librarian | undefined>;
    getRefreshById(libID: string): Promise<Librarian | undefined>;
    getJwtAccessToken(libID: string): string;
    setRefreshToken(refresh_token: string, libID: string): Promise<string>;
    getCookieJwtRefreshToken(libID: string): string[];
    refreshTokenValidate(refreshToken: string, libID: string): Promise<Librarian>;
    tokenRefresh(request: any): {
        token_info: string;
        expireIn: string;
        role: any;
    };
    logout(request: any): Promise<any>;
    addOperationLog(optLogDto: OperationLogDto): Promise<OptLogDocument>;
    getOperationLog(libID: string): Promise<OperationLog[] | undefined>;
    checkAdmin(libID: any): Promise<boolean>;
}
