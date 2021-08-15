import { LibrarianService } from './librarian.service';
import { RegisterLibDto, UpdateLibProfileDto, ChangeLibPwdDto, OperationLogDto } from './lib.dto';
export declare class LibrarianController {
    private readonly libService;
    constructor(libService: LibrarianService);
    register(registerUserDto: RegisterLibDto): Promise<import("./librarian.interface").LibDocument>;
    getAllAdmin(): Promise<import("./librarian.interface").LibDocument[]>;
    getAllLib(): Promise<import("./librarian.interface").LibDocument[]>;
    getProfile(libID: string): Promise<import("./librarian.interface").Librarian>;
    updateProfile(updateLibDto: UpdateLibProfileDto): Promise<any>;
    adminLogin(req: any): Promise<{
        token_info: string;
        expireIn: string;
    }>;
    libLogin(req: any): Promise<{
        token_info: string;
        expireIn: string;
    }>;
    changePwd(changePwdDto: ChangeLibPwdDto): Promise<string>;
    refreshToken(req: any): {
        token_info: string;
        expireIn: string;
    };
    logout(req: any): Promise<any>;
    deleteLib(libID: string): Promise<string>;
    addOptLog(optLogDto: OperationLogDto): Promise<import("./librarian.interface").OptLogDocument>;
    getOptLog(libID: string): Promise<import("./librarian.interface").OperationLog[]>;
    checkAdmin(libID: string): Promise<boolean>;
}
