import { Model } from 'mongoose';
import { Logger } from 'winston';
import { Reader, ReaderDocument, ReaderProDocument, ReaderReadHistory, ReaderReadHisDocument } from './reader.interface';
import { ChangeReaderPwdDto, RegisterReaderDto, UpdateReaderDto, FavourBookDto } from './reader.dto';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { Book, BookDocument } from '../book/book.interface';
export declare class ReaderService {
    private readonly logger;
    private readonly readerModel;
    private readonly readerProfileModel;
    private readonly readerReadHistoryModel;
    private readonly bookModel;
    private readonly jwtService;
    constructor(logger: Logger, readerModel: Model<ReaderDocument>, readerProfileModel: Model<ReaderProDocument>, readerReadHistoryModel: Model<ReaderReadHisDocument>, bookModel: Model<BookDocument>, jwtService: JwtService);
    register(registerReaderDto: RegisterReaderDto): Promise<ReaderDocument>;
    getProfile(readerID: any): Promise<Reader | undefined>;
    getAllReader(): Promise<Reader[]>;
    getTopN(num: string): Promise<Reader[]>;
    updateProfile(updateReaderDto: UpdateReaderDto): Promise<any>;
    changePwd(changeReaderPwdDto: ChangeReaderPwdDto): Promise<string>;
    deaReader(readerID: string): Promise<boolean>;
    actReader(readerID: string): Promise<boolean>;
    login(request: any): Promise<{
        token_info: string;
        expireIn: string;
    }>;
    findOne(username: string): Promise<Reader | undefined>;
    getRefreshById(readerID: string): Promise<Reader | undefined>;
    getJwtAccessToken(readerID: string): string;
    setRefreshToken(refresh_token: string, readerID: string): Promise<string>;
    getCookieJwtRefreshToken(readerID: string): string[];
    refreshTokenValidate(refreshToken: string, readerID: string): Promise<Reader | undefined>;
    tokenRefresh(request: any): {
        token_info: string;
        expireIn: string;
    };
    logout(request: any): Promise<any>;
    delReader(readerID: any): Promise<string>;
    addFavourBook(readerID: string, favourBookDto: FavourBookDto): Promise<1 | 0 | -1>;
    getFavourBookList(readerID: string): Promise<Book[]>;
    delFavourBook(readerID: string, favourBookDto: FavourBookDto): Promise<number>;
    getReadBooks(readerID: any): Promise<Book[]>;
    getReadHistory(readerID: any): Promise<ReaderReadHistory[]>;
    delReadHistory(readerID: any): Promise<any>;
}
