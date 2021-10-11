import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from 'winston';
export declare class EmailerService {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService, logger: Logger);
    sendResetEmail(email: string, tokenDoc: any): string;
}
