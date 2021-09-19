"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readerReadHistoryStub = exports.bookWishStub = exports.bookCommentStub = exports.readRecordStub = exports.bookStub = exports.readerHisData = exports.bookWishData = exports.bookData = exports.bookReadRecord = exports.bookComment = void 0;
exports.bookComment = {
    _id: '60ee3a7f125ae918860429d7',
    book: '60e90c226c00f7f43273e3ce',
    readerName: 'michael',
    title: 'Awesome book with amazing story',
    comment: 'Awesome book with amazing story, ......',
    createTime: new Date('2021-07-18T00:00:00Z'),
};
exports.bookReadRecord = {
    _id: '60ee3bcdf54b1618e6dcf69b',
    book: '60e90c226c00f7f43273e3ce',
    readerID: '60e914e8b5dafaf6b7b0d8b7',
    startTime: new Date('2021-07-16T00:00:00Z'),
    duration: 600,
};
exports.bookData = {
    _id: '60e90c226c00f7f43273e3ce',
    bookTitle: 'Book Sample',
    isbnCode: '111-1-1111-1111-1',
    category: 'Information Technology',
    format: 'e-Book',
    author: 'Jordan XXX',
    language: 'English',
    publisher: 'Publisher',
    publishDate: new Date('2021-08-01T00:00:00Z'),
    purchaseDate: new Date('2021-06-01T00:00:00Z'),
    price: 19.99,
    coverPic: '/fileUpload/Book_sample_cover.png',
    bookFile: '/fileUpload/Book_sample.pdf',
    desc: 'book sample content',
    keywords: 'book, IT, Coding, Sample',
    isActive: true,
    createDate: new Date('2021-07-01T00:00:00Z'),
    creator: 'Michael Jordan',
    readTimes: 0,
    readDuration: 0,
    initialScore: 1000,
    popularScore: 1000,
    comments: ['60ee3a7f125ae918860429d7'],
    readHistory: ['60ee3bcdf54b1618e6dcf69b'],
};
exports.bookWishData = {
    _id: '60ee3b86375cba18bf9dea39',
    bookTitle: 'The Wish Story',
    readerID: 'michael',
    language: 'English',
    createTime: new Date('2021-07-19T00:00:00Z'),
    status: 'Under Review',
};
exports.readerHisData = {
    _id: '60e9c285b318a3061ff6b29c',
    bookID: '60e90c226c00f7f43273e3ce',
    currentPage: 100,
    startTime: new Date('2021-07-16T00:00:00Z'),
    lastReadTime: new Date('2021-07-16T00:00:00Z'),
    readTimes: 1,
    readDuration: 600,
};
const bookStub = () => {
    return exports.bookData;
};
exports.bookStub = bookStub;
const readRecordStub = () => {
    return exports.bookReadRecord;
};
exports.readRecordStub = readRecordStub;
const bookCommentStub = () => {
    return exports.bookComment;
};
exports.bookCommentStub = bookCommentStub;
const bookWishStub = () => {
    return exports.bookWishData;
};
exports.bookWishStub = bookWishStub;
const readerReadHistoryStub = () => {
    return [exports.readerHisData];
};
exports.readerReadHistoryStub = readerReadHistoryStub;
//# sourceMappingURL=book.stub.js.map