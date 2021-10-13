import {
  bookCommentStub,
  bookStub,
  bookWishStub,
  readRecordStub,
} from '../test/stubs/book.stub';

export const BookService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue(bookStub()),
  findBook: jest.fn().mockResolvedValue(bookStub()),
  findAllBook: jest.fn().mockResolvedValue([bookStub()]),
  findBookList: jest.fn().mockResolvedValue([bookStub()]),
  searchBook: jest.fn().mockResolvedValue([bookStub()]),
  findHotBooks: jest.fn().mockResolvedValue([bookStub()]),
  sumInventory: jest
    .fn()
    .mockResolvedValue([{ category: 'Romance', count: 5 }]),
  delBook: jest.fn().mockResolvedValue(bookStub()._id),
  updateBookInfo: jest.fn().mockResolvedValue(bookStub()),
  addReadRecord: jest.fn().mockResolvedValue(readRecordStub()),
  getReadHistory: jest.fn().mockResolvedValue([readRecordStub()]),
  addBookComment: jest.fn().mockResolvedValue(bookCommentStub()),
  getBookComments: jest.fn().mockResolvedValue([bookCommentStub()]),
  addBookWish: jest.fn().mockResolvedValue(bookWishStub()),
  getBookWish: jest.fn().mockResolvedValue(bookWishStub()),
  getWishList: jest.fn().mockResolvedValue([bookWishStub()]),
  updateWishStatus: jest.fn().mockResolvedValue(bookWishStub()._id),
});
