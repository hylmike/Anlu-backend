import { LibrarianService } from './librarian.service';
import { RegisterLibDto, UpdateLibProfileDto, ChangeLibPwdDto, OperationLogDto } from './lib.dto';
export declare class LibrarianController {
    private readonly libService;
    constructor(libService: LibrarianService);
    register(registerUserDto: RegisterLibDto): Promise<import("./librarian.interface").LibDocument>;
    getProfile(libID: string): Promise<import("./librarian.interface").Librarian>;
    updateProfile(updateLibDto: UpdateLibProfileDto): Promise<any>;
    login(req: any): Promise<{
        token_info: string;
        expireIn: string;
        role: any;
    }>;
    changePwd(changePwdDto: ChangeLibPwdDto): Promise<string>;
    refreshToken(req: any): {
        token_info: string;
        expireIn: string;
        role: any;
    };
    logout(req: any): Promise<any>;
    addOptLog(optLogDto: OperationLogDto): Promise<import("./librarian.interface").OptLogDocument>;
    getOptLog(libID: string): Promise<import("./librarian.interface").OperationLog[]>;
    checkAdmin(libID: string): Promise<boolean>;
}
