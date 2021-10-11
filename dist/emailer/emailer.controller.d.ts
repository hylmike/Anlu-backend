import { TokenService } from 'src/reader/token.service';
import { EmailerService } from './emailer.service';
export declare class EmailerController {
    private readonly emailService;
    private readonly tokenService;
    constructor(emailService: EmailerService, tokenService: TokenService);
    sendResetEmail(input: {
        email: string;
    }): Promise<string>;
}
