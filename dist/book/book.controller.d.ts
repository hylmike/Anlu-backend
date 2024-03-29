/// <reference types="multer" />
import { Logger } from 'winston';
import { BookService } from './book.service';
import { BookDto, ReadRecordDto, BookCommentDto, CreateBookWishDto, UpdateWishStatusDto, SearchBookDto, GetWishListDto } from './book.dto';
export declare class BookController {
    private readonly logger;
    private readonly bookService;
    constructor(logger: Logger, bookService: BookService);
    fileUpload(file: Express.Multer.File): Promise<{
        fileUrl: string;
    }>;
    registerBook(createBookDto: BookDto): Promise<import("./book.interface").Book>;
    findBook(bookID: string): Promise<import("./book.interface").Book>;
    findAllBook(bookFormat: string): Promise<import("./book.interface").Book[]>;
    findBookList(searchDto: SearchBookDto): Promise<import("./book.interface").Book[]>;
    searchBook(searchValue: string): Promise<import("./book.interface").Book[]>;
    findHotBooks(num: number): Promise<import("./book.interface").Book[]>;
    sumInventory(): Promise<any[]>;
    delBook(bookID: string): Promise<string>;
    updateBookInfo(bookDto: BookDto): Promise<import("./book.interface").BookDocument>;
    addReadRecord(readRecordDto: ReadRecordDto): Promise<import("./book.interface").BookReadRecordDocument>;
    getReadHistory(bookID: string): Promise<[string]>;
    addComment(bookCommentDto: BookCommentDto): Promise<import("./book.interface").BookComment>;
    getComments(bookID: string): Promise<[string]>;
    addBookWish(createWishDto: CreateBookWishDto): Promise<import("./book.interface").BookWish>;
    getBookWish(wishID: string): Promise<import("./book.interface").BookWish>;
    getUnfulfilWishList(): Promise<import("./book.interface").BookWish[]>;
    getWishList(getWishListDto: GetWishListDto): Promise<import("./book.interface").BookWish[]>;
    updateWishStatus(updateWishStatusDto: UpdateWishStatusDto): Promise<any>;
    delWish(wishID: string): Promise<import("./book.interface").BookWish>;
    clearReadRecord(bookID: string): Promise<1>;
}
