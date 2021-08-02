import { accessTokenStub, libStub } from '../test/stubs/lib.stub';

export const mockedJwtService = {
  sign: jest.fn().mockImplementation(() => {
    return accessTokenStub().token_info;
  }),
};

export const mockRequest = {
  user: libStub(),
  res: { setHeader: jest.fn() },
};
