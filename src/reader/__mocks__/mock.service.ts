import { accessTokenStub, readerStub } from '../test/stubs/reader.stub';
import { tokenStub } from '../test/stubs/token.stub';

export const mockedJwtService = {
  sign: jest.fn().mockImplementation(() => {
    return accessTokenStub().token_info;
  }),
};

export const mockRequest = {
  user: readerStub(),
  res: { setHeader: jest.fn() },
};

export const MockTokenService = {
  resetPwd: jest.fn().mockImplementation(() => {
    return tokenStub().readerName;
  }),
  verifyEmail: jest.fn().mockImplementation(() => {
    return tokenStub().readerName;
  }),
};
