export interface TAccessToken {
    token_info: string;
    expireIn: string;
}
export interface TRefreshToken {
    refreshToken_Cookie: string;
    refreshToken: string;
}
export interface TFavourBook {
    bookID: string;
    createDate: Date;
}
export interface TReadRecord {
    _id: string;
    bookID: string;
    currentPage: number;
    startTime: Date;
    lastReadTime: Date;
    readTimes: number;
    readDuration: number;
}
