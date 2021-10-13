import { Test, TestingModule } from '@nestjs/testing';
import { tokenStub } from '../reader/test/stubs/token.stub';
import { TokenService } from '../reader/token.service';
import { EmailerController } from './emailer.controller';
import { EmailerService } from './emailer.service';

jest.mock('./emailer.service');
const MockTokenService = {
  createToken: jest.fn().mockImplementation(() => {
    return tokenStub();
  }),
};

describe('EmailerController', () => {
  let emailerController: EmailerController;
  let emailerService: EmailerService;
  let createTokenSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailerController],
      providers: [
        EmailerService,
        {
          provide: TokenService,
          useValue: MockTokenService,
        },
      ],
    }).compile();

    emailerController = module.get<EmailerController>(EmailerController);
    emailerService = module.get<EmailerService>(EmailerService);
    createTokenSpy = jest.spyOn(MockTokenService, 'createToken');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(emailerController).toBeDefined();
  });

  describe('sendResetEmail', () => {
    describe('when sendResetEmail is called', () => {
      let result: string;
      const dummyEmail = { email: 'dummy@email.com' };

      beforeEach(async () => {
        result = await emailerController.sendResetEmail(dummyEmail);
      });

      test('then it should call tokenService and emailerService', () => {
        expect(createTokenSpy).toHaveBeenCalledWith(dummyEmail.email);
        expect(emailerService.sendResetEmail).toHaveBeenCalledWith(
          dummyEmail.email,
          tokenStub(),
        );
      });

      test('then it should return valid token', () => {
        expect(result).toBe(tokenStub().token);
      });
    });
  });
});
