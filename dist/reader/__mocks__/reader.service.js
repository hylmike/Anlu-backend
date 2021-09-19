"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderService = void 0;
const book_stub_1 = require("../../book/test/stubs/book.stub");
const reader_stub_1 = require("../test/stubs/reader.stub");
exports.ReaderService = jest.fn().mockReturnValue({
    register: jest.fn().mockResolvedValue(reader_stub_1.readerStub()),
    findOne: jest.fn().mockResolvedValue(reader_stub_1.readerStub()),
    getProfile: jest.fn().mockResolvedValue(reader_stub_1.readerStub()),
    updateProfile: jest.fn().mockResolvedValue(reader_stub_1.readerStub()._id),
    changePwd: jest.fn().mockResolvedValue(reader_stub_1.readerStub().username),
    login: jest.fn().mockResolvedValue(reader_stub_1.accessTokenStub()),
    tokenRefresh: jest.fn().mockReturnValue(reader_stub_1.accessTokenStub()),
    logout: jest.fn().mockResolvedValue(reader_stub_1.readerStub()._id),
    addFavourBook: jest.fn().mockResolvedValue(2),
    getFavourBookList: jest.fn().mockResolvedValue(reader_stub_1.readerStub().favouriteBook),
    delFavourBook: jest.fn().mockResolvedValue(2),
    getReadBooks: jest.fn().mockResolvedValue([book_stub_1.bookStub()]),
    getReadHistory: jest.fn().mockResolvedValue(reader_stub_1.readerStub().readHistory),
});
//# sourceMappingURL=reader.service.js.map