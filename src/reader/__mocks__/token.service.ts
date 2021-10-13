import { tokenStub } from '../test/stubs/token.stub';

export const MockTokenService = jest.fn().mockReturnValue({
  createToken: jest.fn().mockResolvedValue(tokenStub()),
  verifyToken: jest.fn().mockResolvedValue(true),
  delToken: jest.fn().mockResolvedValue(tokenStub().readerName),
  resetPwd: jest.fn().mockResolvedValue(tokenStub().readerName),
  verifyEmail: jest.fn().mockResolvedValue(tokenStub().readerName),
});
