import { Logger } from 'winston';
import { NGXLogInterface } from './frontLogInterface';
export declare class FrontLogController {
    private logger;
    constructor(logger: Logger);
    postLog(logInterface: NGXLogInterface): any;
}
