import { Model } from 'mongoose';
import { Logger } from 'winston';
import { Workshop, Subscriber, WorkshopDocument, SubscriberDocument } from './workshop.interface';
import { RegisterWorkshopDto, SubWorkshopDto, UnsubWorkshopDto, UpdateWorkshopDto } from './workshop.dto';
export declare class WorkshopService {
    private readonly logger;
    private workshopModel;
    private subModel;
    constructor(logger: Logger, workshopModel: Model<WorkshopDocument>, subModel: Model<SubscriberDocument>);
    register(regWorkshopDto: RegisterWorkshopDto): Promise<Workshop>;
    getWorkshop(workshopID: any): Promise<Workshop>;
    getAllWorkshop(): Promise<Workshop[]>;
    updateWorkshop(workshopID: string, updateWorkshopDto: UpdateWorkshopDto): Promise<Workshop>;
    subWorkshop(subWorkshopDto: SubWorkshopDto): Promise<Subscriber>;
    unsubWorkshop(workshopID: string, unsubDto: UnsubWorkshopDto): Promise<any>;
    getSub(readerID: any): Promise<Subscriber>;
    getSubList(workshopID: any): Promise<string[]>;
}
