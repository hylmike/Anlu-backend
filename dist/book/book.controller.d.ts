/// <reference types="multer" />
import { Logger } from 'winston';
import { BookService } from './book.service';
import { BookDto, ReadRecordDto, BookCommentDto, CreateBookWishDto, UpdateWishStatusDto } from './book.dto';
export declare class BookController {
    private readonly logger;
    private readonly bookService;
    constructor(logger: Logger, bookService: BookService);
    fileUpload(file: Express.Multer.File): Promise<{
        fileUrl: string;
    }>;
    registerBook(createBookDto: BookDto): Promise<import("./book.interface").Book>;
    findBook(bookID: string): Promise<import("./book.interface").Book>;
    delBook(bookID: string): Promise<string>;
    updateBookInfo(bookDto: BookDto): Promise<any>;
    addReadRecord(readRecordDto: ReadRecordDto): Promise<import("./book.interface").BookReadRecordDocument>;
    getReadHistory(bookID: string): Promise<[string]>;
    addComment(bookCommentDto: BookCommentDto): Promise<import("./book.interface").BookComment>;
    getComments(bookID: string): Promise<[string]>;
    addBookWish(createWishDto: CreateBookWishDto): Promise<import("./book.interface").BookWishList>;
    getBookWish(wishID: string): Promise<import("./book.interface").BookWishList>;
    getWishList(): Promise<import("./book.interface").BookWishList[]>;
    updateWishStatus(updateWishStatusDto: UpdateWishStatusDto): Promise<any>;
    clearReadRecord(bookID: string): Promise<1>;
}
