import { Test, TestingModule } from '@nestjs/testing';

import {
  TAccessToken,
  TFavourBook,
  TReadRecord,
} from './test/stubs/test.interface';
import {
  RegisterReaderDto,
  UpdateReaderDto,
  ChangeReaderPwdDto,
  FavourBookDto,
  ResetPwdDto,
} from './reader.dto';
import { readerStub, accessTokenStub } from './test/stubs/reader.stub';
import { Reader } from './reader.interface';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { TokenService } from './token.service';
import { MockTokenService } from './__mocks__/mock.service';
import { tokenStub } from './test/stubs/token.stub';

jest.mock('./reader.service');

describe('ReaderController', () => {
  let readerController: ReaderController;
  let readerService: ReaderService;
  let verifyEmailSpy: jest.SpyInstance;
  let resetPwdSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ReaderController],
      providers: [
        ReaderService,
        {
          provide: TokenService,
          useValue: MockTokenService,
        },
      ],
    }).compile();

    readerController = module.get<ReaderController>(ReaderController);
    readerService = module.get<ReaderService>(ReaderService);
    verifyEmailSpy = jest.spyOn(MockTokenService, 'verifyEmail');
    resetPwdSpy = jest.spyOn(MockTokenService, 'resetPwd');
    jest.clearAllMocks();
  });

  describe('register', () => {
    describe('when register is called', () => {
      let reader: Reader;
      let regReaderDto: RegisterReaderDto;

      beforeEach(async () => {
        regReaderDto = {
          username: readerStub().username,
          password: readerStub().password,
          confirmPassword: readerStub().password,
          email: readerStub().email,
          firstName: readerStub().readerProfile.firstName,
          lastName: readerStub().readerProfile.lastName,
          gender: readerStub().readerProfile.gender,
          birthday: readerStub().readerProfile.birthday.toString(),
          phoneNumber: readerStub().readerProfile.phoneNumber,
          homeAddress: readerStub().readerProfile.address.homeAddress,
          province: readerStub().readerProfile.address.province,
          postcode: readerStub().readerProfile.address.postcode,
          securityQuestion: readerStub().readerProfile.securityQuestion,
          securityAnswer: readerStub().readerProfile.securityAnswer,
        };
        reader = await readerController.register(regReaderDto);
      });

      test('then it should call readerService', () => {
        expect(readerService.register).toHaveBeenCalledWith(regReaderDto);
      });

      test('then it should return registered reader object', () => {
        expect(reader).toEqual(readerStub());
      });
    });
  });

  describe('getProfile', () => {
    describe('when getProfile is called', () => {
      let reader: Reader;

      beforeEach(async () => {
        reader = await readerController.getProfile(readerStub()._id);
      });

      test('then it should call readerService', () => {
        expect(readerService.getProfile).toHaveBeenCalledWith(readerStub()._id);
      });

      test('then it should return a reader object', () => {
        expect(reader).toEqual(readerStub());
      });
    });
  });

  describe('updateReaderProfile', () => {
    describe('when updateReaderProfile is called', () => {
      let readerID: string;
      let updateReaderDto: UpdateReaderDto;

      beforeEach(async () => {
        updateReaderDto = {
          username: readerStub().username,
          email: readerStub().email,
          firstName: '',
          lastName: '',
          gender: '',
          birthday: '',
          phoneNumber: '',
          homeAddress: readerStub().readerProfile.address.homeAddress,
          province: '',
          postcode: '',
          securityQuestion: '',
          securityAnswer: '',
        };
        readerID = await readerController.updateReaderProfile(updateReaderDto);
      });

      test('then it should call readerService', () => {
        expect(readerService.updateProfile).toHaveBeenCalledWith(
          updateReaderDto,
        );
      });

      test('then it should return updated reader id', () => {
        expect(readerID).toEqual(readerStub()._id);
      });
    });
  });

  describe('changePassword', () => {
    describe('when changePassword is called', () => {
      let username: string;
      let changePwdDto: ChangeReaderPwdDto;

      beforeEach(async () => {
        changePwdDto = {
          username: readerStub().username,
          currentPassword: readerStub().password,
          newPassword: 'asdfgh54321',
        };
        username = await readerController.changePwd(changePwdDto);
      });

      test('then it should call readerService', () => {
        expect(readerService.changePwd).toHaveBeenCalledWith(changePwdDto);
      });

      test("then it should return chenged reader's username", () => {
        expect(username).toEqual(readerStub().username);
      });
    });
  });

  describe('verifyEmail', () => {
    describe('when verifyEmail is called', () => {
      let result: string;
      const dummyEmail = 'dummy@email.com';

      beforeEach(async () => {
        result = await readerController.verifyEmail({ email: dummyEmail });
      });

      test('it should call tokenService', () => {
        expect(verifyEmailSpy).toHaveBeenCalledWith(dummyEmail);
      });

      test('it should return readerName', () => {
        expect(result).toEqual(tokenStub().readerName);
      });
    });
  });

  describe('resetPwd', () => {
    describe('when resetPwd is called', () => {
      let result: string;
      const resetPwdDto: ResetPwdDto = {
        username: tokenStub().readerName,
        token: tokenStub().token,
        newPassword: 'newPassword',
      };

      beforeEach(async () => {
        result = await readerController.resetPwd(resetPwdDto);
      });

      test('it should call tokenService', () => {
        expect(resetPwdSpy).toHaveBeenCalledWith(resetPwdDto);
      });

      test('it should return readerName', () => {
        expect(result).toEqual(tokenStub().readerName);
      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      let accessToken: TAccessToken;

      beforeEach(async () => {
        accessToken = await readerController.login(readerStub()._id);
      });

      test('then it should call readerService', () => {
        expect(readerService.login).toHaveBeenCalledWith(readerStub()._id);
      });

      test('then it should return a access token', () => {
        expect(accessToken).toEqual(accessTokenStub());
      });
    });
  });

  describe('refreshToken', () => {
    describe('when refreshToken is called', () => {
      let accessToken: TAccessToken;

      beforeEach(async () => {
        accessToken = await readerController.refreshToken(readerStub()._id);
      });

      test('then it should call readerService', () => {
        expect(readerService.tokenRefresh).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should return a new access token', () => {
        expect(accessToken).toEqual(accessTokenStub());
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let readerID: string;

      beforeEach(async () => {
        readerID = await readerController.logout(readerStub()._id);
      });

      test('then it should call readerService', () => {
        expect(readerService.logout).toHaveBeenCalledWith(readerStub()._id);
      });

      test('then it should return logout reader id', () => {
        expect(readerID).toEqual(readerStub()._id);
      });
    });
  });

  describe('addFavourBook', () => {
    describe('when addFavourBook is called', () => {
      let listLength: number;
      let favourBookDto: FavourBookDto;

      beforeEach(async () => {
        favourBookDto = {
          bookID: readerStub().favouriteBook[0].bookID,
        };
        listLength = await readerController.addFavourBook(
          readerStub()._id,
          favourBookDto,
        );
      });

      test('then it should call readerService', () => {
        expect(readerService.addFavourBook).toHaveBeenCalledWith(
          readerStub()._id,
          favourBookDto,
        );
      });

      test('then it should return new favourbook list length', () => {
        expect(listLength).toEqual(2);
      });
    });
  });

  describe('getFavourBookList', () => {
    describe('when getFavourBookLis is called', () => {
      let list: [TFavourBook];

      beforeEach(async () => {
        list = await readerController.getFavourBookList(readerStub()._id);
      });

      test('then it should call readerService', () => {
        expect(readerService.getFavourBookList).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should return favourbook list', () => {
        expect(list).toEqual(readerStub().favouriteBook);
      });
    });
  });

  describe('getReadHistory', () => {
    describe('when getReadHistory is called', () => {
      let readHistory: TReadRecord[];

      beforeEach(async () => {
        readHistory = await readerController.getReadHistory(readerStub()._id);
      });

      test('then it should call readerService', () => {
        expect(readerService.getReadHistory).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should return book read history', () => {
        expect(readHistory).toEqual(readerStub().readHistory);
      });
    });
  });

});
