import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { logger } from '../../test/util/winston';
import { ReaderSchema, TokenSchema } from '../schemas/reader.schema';
import { mongooseTestModule } from '../schemas/test/mongo.test.module';
import { ResetPwdDto } from './reader.dto';
import { ReaderDocument } from './reader.interface';
import { readerStub } from './test/stubs/reader.stub';
import { tokenData1, tokenDataStub, tokenStub } from './test/stubs/token.stub';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let readerModel: Model<ReaderDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Token', schema: TokenSchema },
          { name: 'Reader', schema: ReaderSchema },
        ]),
      ],
      providers: [
        TokenService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    readerModel = module.get<Model<ReaderDocument>>('ReaderModel');
    jest.clearAllMocks();

    //add one reader record for test
    const newReader = new readerModel({
      username: readerStub().username,
      password: readerStub().password,
      email: readerStub().email,
      registerDate: new Date(),
      readerProfile: null,
    });
    newReader.save();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('createToken', () => {
    describe('when createToken is called', () => {
      let result: { readerName: string; token: string };

      beforeEach(async () => {
        result = await tokenService.createToken(tokenDataStub().email);
      });

      test('it should return readerName and token', () => {
        expect(result.readerName).toBe('michael');
        expect(result.token).not.toEqual(tokenStub().token);
        tokenData1.token = result.token;
      });
    });
  });

  describe('verifyToken', () => {
    describe('when verifyToken is called', () => {
      let result: boolean;

      beforeEach(async () => {
        result = await tokenService.verifyToken(
          tokenStub().readerName,
          tokenStub().token,
        );
      });

      test('it should return true for given inputs', () => {
        expect(result).toEqual(true);
      });
    });
  });

  describe('resetPwd', () => {
    describe('when resetPwd is called', () => {
      let result: string;
      const newPassword = 'newPassword';
      const resetPwdDto: ResetPwdDto = {
        username: tokenStub().readerName,
        token: tokenStub().token,
        newPassword: newPassword,
      };

      beforeEach(async () => {
        result = await tokenService.resetPwd(resetPwdDto);
      });

      test('it should return readerName', () => {
        expect(result).toEqual(JSON.stringify(tokenStub().readerName));
      });
    });
  });

  describe('verifyEmail', () => {
    describe('when verifyEmail is called', () => {
      let result: string;

      beforeEach(async () => {
        result = await tokenService.verifyEmail(tokenDataStub().email);
      });

      test('it should return readerName', () => {
        expect(result).toEqual(JSON.stringify(tokenStub().readerName));
      });
    });
  });

  describe('delToken', () => {
    describe('when delToken is called', () => {
      let result: string;

      beforeEach(async () => {
        await tokenService.createToken(tokenDataStub().email);
        result = await tokenService.delToken(tokenStub().readerName);
      });

      test('it should return readerName', () => {
        expect(result).toEqual(tokenStub().readerName);
      });
    });
  });
});
