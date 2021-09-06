import { Model } from 'mongoose';
import { Logger } from 'winston';
import { Workshop, Subscriber, WorkshopDocument, SubscriberDocument } from './workshop.interface';
import { RegisterWorkshopDto, SubWorkshopDto, UnsubWorkshopDto, UpdateWorkshopDto } from './workshop.dto';
import { ReaderDocument } from '../reader/reader.interface';
export declare class WorkshopService {
    private readonly logger;
    private workshopModel;
    private subModel;
    private readerModel;
    constructor(logger: Logger, workshopModel: Model<WorkshopDocument>, subModel: Model<SubscriberDocument>, readerModel: Model<ReaderDocument>);
    register(regWorkshopDto: RegisterWorkshopDto): Promise<Workshop>;
    getWorkshop(workshopID: any): Promise<Workshop>;
    getWsList(num: any): Promise<Workshop[]>;
    updateWorkshop(workshopID: string, updateWorkshopDto: UpdateWorkshopDto): Promise<Workshop>;
    delWorkshop(workshopID: any): Promise<string>;
    subWorkshop(subWorkshopDto: SubWorkshopDto): Promise<Subscriber>;
    unsubWorkshop(workshopID: string, unsubDto: UnsubWorkshopDto): Promise<any>;
    getSub(readerID: any): Promise<Subscriber>;
    getSubName(subID: any): Promise<string>;
    getSubList(workshopID: any): Promise<string[]>;
}
