import { WorkshopService } from './workshop.service';
import { RegisterWorkshopDto, SubWorkshopDto, UpdateWorkshopDto, UnsubWorkshopDto } from './workshop.dto';
export declare class WorkshopController {
    private readonly workshopService;
    constructor(workshopService: WorkshopService);
    register(regWorkshopDto: RegisterWorkshopDto): Promise<import("./workshop.interface").Workshop>;
    getWorkshop(workshopID: string): Promise<import("./workshop.interface").Workshop>;
    updateWorkshop(workshopID: string, updateWorkshopDto: UpdateWorkshopDto): Promise<import("./workshop.interface").Workshop>;
    getSubList(workshopID: string): Promise<string[]>;
    subWorkshop(subWorkshopDto: SubWorkshopDto): Promise<import("./workshop.interface").Subscriber>;
    unsubWorkshop(workshopID: string, unsubWsDto: UnsubWorkshopDto): Promise<any>;
}
