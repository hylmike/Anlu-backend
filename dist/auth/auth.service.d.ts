import { Logger } from 'winston';
import 'dotenv/config';
import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';
export declare class AuthService {
    private readonly readerService;
    private readonly libService;
    private readonly logger;
    constructor(readerService: ReaderService, libService: LibrarianService, logger: Logger);
    validateReader(username: string, password: string): Promise<any>;
    validateLibrarian(username: string, password: string): Promise<any>;
}
