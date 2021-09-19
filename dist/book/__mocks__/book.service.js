"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const book_stub_1 = require("../test/stubs/book.stub");
exports.BookService = jest.fn().mockReturnValue({
    register: jest.fn().mockResolvedValue(book_stub_1.bookStub()),
    findBook: jest.fn().mockResolvedValue(book_stub_1.bookStub()),
    findAllBook: jest.fn().mockResolvedValue([book_stub_1.bookStub()]),
    findBookList: jest.fn().mockResolvedValue([book_stub_1.bookStub()]),
    searchBook: jest.fn().mockResolvedValue([book_stub_1.bookStub()]),
    findHotBooks: jest.fn().mockResolvedValue([book_stub_1.bookStub()]),
    sumInventory: jest
        .fn()
        .mockResolvedValue([{ category: 'Romance', count: 5 }]),
    delBook: jest.fn().mockResolvedValue(book_stub_1.bookStub()._id),
    updateBookInfo: jest.fn().mockResolvedValue(book_stub_1.bookStub()),
    addReadRecord: jest.fn().mockResolvedValue(book_stub_1.readRecordStub()),
    getReadHistory: jest.fn().mockResolvedValue([book_stub_1.readRecordStub()]),
    addBookComment: jest.fn().mockResolvedValue(book_stub_1.bookCommentStub()),
    getBookComments: jest.fn().mockResolvedValue([book_stub_1.bookCommentStub()]),
    addBookWish: jest.fn().mockResolvedValue(book_stub_1.bookWishStub()),
    getBookWish: jest.fn().mockResolvedValue(book_stub_1.bookWishStub()),
    getBookWishList: jest.fn().mockResolvedValue([book_stub_1.bookWishStub()]),
    updateWishStatus: jest.fn().mockResolvedValue(book_stub_1.bookWishStub()._id),
});
//# sourceMappingURL=book.service.js.map