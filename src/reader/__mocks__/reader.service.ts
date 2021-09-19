import { bookStub } from '../../book/test/stubs/book.stub';
import { readerStub, accessTokenStub } from '../test/stubs/reader.stub';

export const ReaderService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue(readerStub()),
  findOne: jest.fn().mockResolvedValue(readerStub()),
  getProfile: jest.fn().mockResolvedValue(readerStub()),
  updateProfile: jest.fn().mockResolvedValue(readerStub()._id),
  changePwd: jest.fn().mockResolvedValue(readerStub().username),
  login: jest.fn().mockResolvedValue(accessTokenStub()),
  tokenRefresh: jest.fn().mockReturnValue(accessTokenStub()),
  logout: jest.fn().mockResolvedValue(readerStub()._id),
  addFavourBook: jest.fn().mockResolvedValue(2),
  getFavourBookList: jest.fn().mockResolvedValue(readerStub().favouriteBook),
  delFavourBook: jest.fn().mockResolvedValue(2),
  getReadBooks: jest.fn().mockResolvedValue([bookStub()]),
  getReadHistory: jest.fn().mockResolvedValue(readerStub().readHistory),
});
