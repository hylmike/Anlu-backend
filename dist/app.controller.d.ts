import { AppService } from './app.service';
import { Logger } from 'winston';
import 'dotenv/config';
export declare class AppController {
    private readonly appService;
    private readonly logger;
    constructor(appService: AppService, logger: Logger);
    getHello(): string;
}
