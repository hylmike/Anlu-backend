/// <reference types="multer" />
import { Logger } from 'winston';
import { WorkshopService } from './workshop.service';
import { RegisterWorkshopDto, SubWorkshopDto, UpdateWorkshopDto, UnsubWorkshopDto } from './workshop.dto';
export declare class WorkshopController {
    private readonly workshopService;
    private readonly logger;
    constructor(workshopService: WorkshopService, logger: Logger);
    fileUpload(file: Express.Multer.File): Promise<{
        fileUrl: string;
    }>;
    register(regWorkshopDto: RegisterWorkshopDto): Promise<import("./workshop.interface").Workshop>;
    getWorkshop(workshopID: string): Promise<import("./workshop.interface").Workshop>;
    getWsList(num: number): Promise<import("./workshop.interface").Workshop[]>;
    updateWorkshop(workshopID: string, updateWorkshopDto: UpdateWorkshopDto): Promise<import("./workshop.interface").Workshop>;
    delWorkshop(workshopID: string): Promise<string>;
    getSub(readerID: string): Promise<import("./workshop.interface").Subscriber>;
    getSubList(workshopID: string): Promise<string[]>;
    getSubName(subID: string): Promise<string>;
    subWorkshop(subWorkshopDto: SubWorkshopDto): Promise<import("./workshop.interface").Subscriber>;
    unsubWorkshop(workshopID: string, unsubWsDto: UnsubWorkshopDto): Promise<any>;
}
