import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { tokenStub } from '../reader/test/stubs/token.stub';

import { logger } from '../../test/util/winston';
import { EmailerService } from './emailer.service';
import { MockMailService } from './__mocks__/mock.service';

describe('EmailerService', () => {
  let emailerService: EmailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailerService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
        {
          provide: MailerService,
          useValue: MockMailService,
        },
      ],
    }).compile();

    emailerService = module.get<EmailerService>(EmailerService);
  });

  it('should be defined', () => {
    expect(emailerService).toBeDefined();
  });

  describe('sendResetEmail', () => {
    describe('if sendResetEmail is called', () => {
      let result: string;
      const dummyEmail = 'dummy@email.com';
      let mailerSpy: jest.SpyInstance;

      beforeEach(() => {
        mailerSpy = jest.spyOn(MockMailService, 'sendMail');
        result = emailerService.sendResetEmail(dummyEmail, tokenStub());
      });

      test('then it should call Mailer service', () => {
        expect(mailerSpy).toHaveBeenCalled;
      });

      test('then it should return token value', () => {
        expect(result).toBe(tokenStub().token);
      });
    });
  });
});
