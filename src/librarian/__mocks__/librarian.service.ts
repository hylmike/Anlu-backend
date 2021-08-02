import { libStub, accessTokenStub, optLogStub } from '../test/stubs/lib.stub';

export const LibrarianService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue(libStub()),
  getProfile: jest.fn().mockResolvedValue(libStub()),
  updateProfile: jest.fn().mockResolvedValue(libStub()._id),
  changePwd: jest.fn().mockResolvedValue(libStub().username),
  login: jest.fn().mockResolvedValue(accessTokenStub()),
  tokenRefresh: jest.fn().mockReturnValue(accessTokenStub()),
  logout: jest.fn().mockResolvedValue(libStub()._id),
  addOperationLog: jest.fn().mockResolvedValue(optLogStub()),
  getOperationLog: jest.fn().mockResolvedValue([optLogStub()]),
  checkAdmin: jest.fn().mockResolvedValue(true),
});
