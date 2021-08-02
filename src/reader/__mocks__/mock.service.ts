import { accessTokenStub, readerStub } from '../test/stubs/reader.stub';

export const mockedJwtService = {
  sign: jest.fn().mockImplementation(() => {
    return accessTokenStub().token_info;
  }),
};

export const mockRequest = {
  user: readerStub(),
  res: { setHeader: jest.fn() },
};
