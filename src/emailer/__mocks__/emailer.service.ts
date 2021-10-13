import { tokenStub } from '../../reader/test/stubs/token.stub';

export const EmailerService = jest.fn().mockReturnValue({
  sendResetEmail: jest.fn().mockReturnValue(tokenStub().token),
});
