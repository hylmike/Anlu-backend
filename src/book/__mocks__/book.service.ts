import {
  bookCommentStub,
  bookStub,
  bookWishStub,
  readRecordStub,
} from '../test/stubs/book.stub';

export const BookService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue(bookStub()),
  findBook: jest.fn().mockResolvedValue(bookStub()),
  delBook: jest.fn().mockResolvedValue(bookStub()._id),
  updateBookInfo: jest.fn().mockResolvedValue(bookStub()._id),
  addReadRecord: jest.fn().mockResolvedValue(readRecordStub()),
  getReadHistory: jest.fn().mockResolvedValue([readRecordStub()]),
  addBookComment: jest.fn().mockResolvedValue(bookCommentStub()),
  getBookComments: jest.fn().mockResolvedValue([bookCommentStub()]),
  addBookWish: jest.fn().mockResolvedValue(bookWishStub()),
  getBookWish: jest.fn().mockResolvedValue(bookWishStub()),
  getBookWishList: jest.fn().mockResolvedValue([bookWishStub()]),
  updateWishStatus: jest.fn().mockResolvedValue(bookWishStub()._id),
});
