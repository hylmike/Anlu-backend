export interface RegisterWorkshopDto {
    topic: string;
    place: string;
    organizer: string;
    startTime: string;
    duration: string;
    poster: string;
    creator: string;
    remark: string;
}
export interface UpdateWorkshopDto {
    topic: string;
    place: string;
    organizer: string;
    startTime: string;
    duration: string;
    poster: string;
    remark: string;
}
export interface SubWorkshopDto {
    workshop: string;
    readerID: string;
}
export interface UnsubWorkshopDto {
    subID: string;
}
