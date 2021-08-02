export interface BookDto {
    bookTitle: string;
    isbnCode: string;
    category: string;
    bookType: string;
    author: string;
    language: string;
    publisher: string;
    publishDate: string;
    purchaseDate: string;
    coverPic: string;
    bookFile: string;
    price: string;
    desc: string;
    keyword: string;
    initialScore: string;
    creator: string;
    isActive: string;
}
export interface ReadRecordDto {
    bookID: string;
    readerID: string;
    startTime: Date;
    currentPage: number;
    duration: number;
}
export interface BookCommentDto {
    bookID: string;
    readerName: string;
    title: string;
    comment: string;
}
export interface CreateBookWishDto {
    bookTitle: string;
    readerID: string;
    language: string;
}
export interface UpdateWishStatusDto {
    WishID: string;
    status: string;
}
