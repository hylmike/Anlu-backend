import { ReaderReadHistory } from '../../../reader/reader.interface';
import { Book, BookComment, BookReadRecord, BookWish } from '../../book.interface';
export declare const bookComment: BookComment;
export declare const bookReadRecord: BookReadRecord;
export declare const bookData: Book;
export declare const bookWishData: BookWish;
export declare const readerHisData: ReaderReadHistory;
export declare const bookStub: () => Book;
export declare const readRecordStub: () => BookReadRecord;
export declare const bookCommentStub: () => BookComment;
export declare const bookWishStub: () => BookWish;
export declare const readerReadHistoryStub: () => ReaderReadHistory[];
