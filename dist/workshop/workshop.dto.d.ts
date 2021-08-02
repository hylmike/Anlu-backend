export interface RegisterWorkshopDto {
    topic: string;
    place: string;
    organizer: string;
    startTime: string;
    duration: number;
    flyerContent: string;
    creator: string;
    remark: string;
}
export interface UpdateWorkshopDto {
    place: string;
    organizer: string;
    startTime: string;
    duration: string;
    flyerContent: string;
    remark: string;
}
export interface SubWorkshopDto {
    workshop: string;
    firstName: string;
    lastName: string;
    age: number;
    neighborhood: string;
}
export interface UnsubWorkshopDto {
    subID: string;
}
