import { TokenService } from '../reader/token.service';
import { EmailerService } from './emailer.service';
export declare class EmailerController {
    private readonly emailerService;
    private readonly tokenService;
    constructor(emailerService: EmailerService, tokenService: TokenService);
    sendResetEmail(input: {
        email: string;
    }): Promise<string>;
}
