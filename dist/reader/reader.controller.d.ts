import { ReaderService } from './reader.service';
import { ChangeReaderPwdDto, RegisterReaderDto, UpdateReaderDto, FavourBookDto } from './reader.dto';
export declare class ReaderController {
    private readonly readerService;
    constructor(readerService: ReaderService);
    register(regReaderDto: RegisterReaderDto): Promise<import("./reader.interface").ReaderDocument>;
    getProfile(readerID: string): Promise<import("./reader.interface").Reader>;
    getAllReader(): Promise<import("./reader.interface").Reader[]>;
    getTopReader(num: any): Promise<import("./reader.interface").Reader[]>;
    updateReaderProfile(updateReaderDto: UpdateReaderDto): Promise<any>;
    changePwd(changeReaderPwdDto: ChangeReaderPwdDto): Promise<string>;
    deaReader(readerID: string): Promise<boolean>;
    actReader(readerID: string): Promise<boolean>;
    login(req: any): Promise<{
        token_info: string;
        expireIn: string;
    }>;
    refreshToken(req: any): {
        token_info: string;
        expireIn: string;
    };
    logout(req: any): Promise<any>;
    delReader(readerID: string): Promise<string>;
    addFavourBook(readerID: string, favourBookDto: FavourBookDto): Promise<1 | 0 | -1>;
    getFavourBookList(readerID: string): Promise<import("../book/book.interface").Book[]>;
    delFavourBook(readerID: string, favourBookDto: FavourBookDto): Promise<number>;
    getReadBooks(readerID: string): Promise<import("../book/book.interface").Book[]>;
    getReadHistory(readerID: string): Promise<import("./reader.interface").ReaderReadHistory[]>;
    delReadHistory(readerID: string): Promise<any>;
}
