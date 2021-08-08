import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LibrarianService } from './librarian.service';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';

import {
  RegisterLibDto,
  UpdateLibProfileDto,
  ChangeLibPwdDto,
} from './lib.dto';
import {
  accessTokenStub,
  libData,
  libStub,
  refreshTokenStub,
  optLogStub,
  logData,
} from './test/stubs/lib.stub';
import { mockedJwtService, mockRequest } from './__mocks__/mock.service';
import { logger } from '../../test/util/winston';
import {
  mongooseTestModule,
  closeMongodConnection,
} from '../schemas/test/mongo.test.module';
import {
  LibrarianSchema,
  OperationLogSchema,
} from '../schemas/librarian.schema';
import { Librarian, OperationLog } from './librarian.interface';
import { TAccessToken } from './test/test.interface';

jest.mock('winston');

describe('LibrarianService', () => {
  let libService: LibrarianService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Librarian', schema: LibrarianSchema },
        ]),
        MongooseModule.forFeature([
          { name: 'OperationLog', schema: OperationLogSchema },
        ]),
      ],
      providers: [
        LibrarianService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    libService = module.get<LibrarianService>(LibrarianService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    describe('when register is called', () => {
      let lib: Librarian;
      let regLibDto: RegisterLibDto;

      beforeEach(async () => {
        regLibDto = {
          username: libStub().username,
          password: libStub().password,
          confirmPassword: libStub().password,
          email: libStub().email,
          role: libStub().role,
          firstName: libStub().firstName,
          lastName: libStub().lastName,
          phoneNumber: libStub().phoneNumber,
        };
        lib = await libService.register(regLibDto);
      });

      test('then it should return a new lib object', () => {
        expect(lib.registerDate).not.toEqual(libStub().registerDate);
        expect(lib.username).toEqual(libStub().username);
      });

      test('then it should return null for username conflict', () => {
        expect(lib).toBeNull;
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let lib: Librarian;

      beforeEach(async () => {
        lib = await libService.findOne(libStub().username);
        libData._id = lib._id;
      });

      test('then it should return a lib', () => {
        expect(lib._id).toEqual(libStub()._id);
        expect(lib.email).toEqual(libStub().email);
      });

      test('then return lib should includ password field', async () => {
        expect(lib.password).not.toBeNull;
      });
    });
  });

  describe('getProfile', () => {
    describe('when getProfile is called', () => {
      let lib: Librarian;

      beforeEach(async () => {
        lib = await libService.getProfile(libStub()._id);
      });

      test('then it should return a lib', () => {
        expect(lib.username).toEqual(libStub().username);
      });

      test('then it should return null for invalid id', async () => {
        expect(await libService.getProfile(null)).toBeNull;
      });
    });
  });

  describe('getAllAdmin', () => {
    describe('when getAllAdmin is called', () => {
      let adminList: Librarian[];

      beforeEach(async () => {
        adminList = await libService.getAllAdmin();
      });

      test('then it should return a admin list', () => {
        expect(adminList[0].username).toEqual(libStub().username);
      });
    });
  });

  describe('getAllLibrarian', () => {
    describe('when getAllLibrarian is called', () => {
      let libList: Librarian[];

      beforeEach(async () => {
        libList = await libService.getAllLibrarian();
      });

      test('then it should return a admin list', () => {
        expect(libList).toEqual([]);
      });
    });
  });

  describe('updateProfile', () => {
    describe('when updateProfile is called', () => {
      let libID: string;
      let lib: Librarian;

      beforeEach(async () => {
        const updatelibDto: UpdateLibProfileDto = {
          username: libStub().username,
          email: 'email@email',
          role: '',
          firstName: '',
          lastName: '',
          phoneNumber: '1111111111',
          isActive: '',
        };
        libID = await libService.updateProfile(updatelibDto);
        lib = await libService.findOne(libStub().username);
      });

      test('lib data should be updated', () => {
        expect(lib.email).toEqual('email@email');
        expect(lib.phoneNumber).toEqual('1111111111');
      });

      test('then it should return a lib id', () => {
        expect(libID).toEqual(libStub()._id);
      });
    });
  });

  describe('changPassword', () => {
    describe('when changePwd is called', () => {
      let libName: string;
      let lib: Librarian, updatedlib: Librarian;
      const newPass = '12345';

      beforeEach(async () => {
        const changePwdDto: ChangeLibPwdDto = {
          username: libStub().username,
          currentPassword: libStub().password,
          newPassword: newPass,
          confirmPassword: newPass,
        };

        const changePwdDto1: ChangeLibPwdDto = {
          username: libStub().username,
          currentPassword: newPass,
          newPassword: libStub().password,
          confirmPassword: libStub().password,
        };

        lib = await libService.findOne(libStub().username);
        libName = await libService.changePwd(changePwdDto);
        updatedlib = await libService.findOne(libStub().username);
        await libService.changePwd(changePwdDto1);
      });

      test('lib password should be updated', () => {
        expect(updatedlib.password).not.toEqual(lib.password);
      });

      test('then it should return lib name', () => {
        expect(libName).toEqual(libStub().username);
      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      let token: TAccessToken;

      beforeEach(async () => {
        jest
          .spyOn(libService, 'getJwtAccessToken')
          .mockImplementationOnce(() => accessTokenStub().token_info);
        jest
          .spyOn(libService, 'getCookieJwtRefreshToken')
          .mockImplementationOnce(() => {
            return [
              refreshTokenStub().refreshToken_Cookie,
              refreshTokenStub().refreshToken,
            ];
          });
        jest
          .spyOn(libService, 'setRefreshToken')
          .mockImplementationOnce(async () => Promise.resolve('OK'));
        token = await libService.login(mockRequest, 'admin');
      });

      test('then it should call getJwtAccessToken', () => {
        expect(libService.getJwtAccessToken).toHaveBeenCalledWith(
          libStub()._id,
        );
      });

      test('then it should call getCookieJwtRefreshToken', () => {
        expect(libService.getCookieJwtRefreshToken).toHaveBeenCalledWith(
          libStub()._id,
        );
      });

      test('then it should call setRefreshToken', () => {
        expect(libService.setRefreshToken).toHaveBeenCalledWith(
          refreshTokenStub().refreshToken,
          libStub()._id,
        );
      });

      test('then it should return a access token in body', () => {
        expect(token).toEqual(accessTokenStub());
      });
    });
  });

  describe('getRefreshTokenById', () => {
    describe('when getRefreshById is called', () => {
      let lib: Librarian;

      beforeEach(async () => {
        lib = await libService.getRefreshById(libStub()._id);
      });

      test('then it should return a lib', () => {
        expect(lib.username).toEqual(libStub().username);
      });

      test('then returned lib should include refresh token', async () => {
        expect(lib.currentRefreshToken).not.toBeNull;
      });
    });
  });

  describe('getJwtAccessToken', () => {
    describe('when getJwtAccessToken is called', () => {
      let token: string;
      let mockSign: jest.SpyInstance;

      beforeEach(async () => {
        mockSign = jest.spyOn(mockedJwtService, 'sign');
        token = libService.getJwtAccessToken(libStub()._id);
      });

      test('then it should call jwtService', () => {
        expect(mockSign).toHaveBeenCalled;
      });

      test('then it should return refresh token', async () => {
        expect(token).toEqual(accessTokenStub().token_info);
      });
    });
  });

  describe('setRefreshToken', () => {
    describe('when setRefreshToken is called', () => {
      let libName: string;

      beforeEach(async () => {
        libName = await libService.setRefreshToken(
          refreshTokenStub().refreshToken,
          libStub()._id,
        );
      });

      test('then it should return refresh token updated lib name', async () => {
        expect(libName).toEqual(libStub().username);
      });
    });
  });

  describe('getCookieJwtRefreshToken', () => {
    describe('when getCookieJwtRefreshToken is called', () => {
      let refreshToken: string[];
      let mockSign: jest.SpyInstance;

      beforeEach(async () => {
        mockSign = jest
          .spyOn(mockedJwtService, 'sign')
          .mockImplementationOnce(() => {
            return refreshTokenStub().refreshToken;
          });
        refreshToken = await libService.getCookieJwtRefreshToken(libStub()._id);
      });

      test('then it should call jwtService', () => {
        expect(mockSign).toHaveBeenCalled;
      });

      test('then it should return refresh token', async () => {
        expect(refreshToken).toEqual([
          refreshTokenStub().refreshToken_Cookie,
          refreshTokenStub().refreshToken,
        ]);
      });
    });
  });

  describe('refreshTokenValidate', () => {
    describe('when refreshTokenValidate is called', () => {
      let lib: Librarian;

      beforeEach(async () => {
        jest
          .spyOn(libService, 'getRefreshById')
          .mockImplementationOnce(async () => Promise.resolve(libStub()));
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(async () => Promise.resolve(true));
        lib = await libService.refreshTokenValidate(
          refreshTokenStub().refreshToken,
          libStub()._id,
        );
      });

      test('then it should call getRefreshById', async () => {
        expect(libService.getRefreshById).toHaveBeenCalledWith(libStub()._id);
      });

      test('then it should return lib object', async () => {
        expect(lib).toEqual(libStub());
      });
    });
  });

  describe('tokenRefresh', () => {
    describe('when tokenRefresh is called', () => {
      let token: TAccessToken;

      beforeEach(async () => {
        jest
          .spyOn(libService, 'getJwtAccessToken')
          .mockImplementationOnce(() => accessTokenStub().token_info);
        token = libService.tokenRefresh(mockRequest);
      });

      test('then it should call getJwtAccessToken function', () => {
        expect(libService.getJwtAccessToken).toHaveBeenCalledWith(
          libStub()._id,
        );
      });

      test('then it should return a new access token', async () => {
        expect(token).toEqual(accessTokenStub());
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let libID: string;
      let lib: Librarian;

      beforeEach(async () => {
        libID = await libService.logout(mockRequest);
        lib = await libService.getRefreshById(libStub()._id);
      });

      test('then it should remove refresh token from database', () => {
        expect(lib.currentRefreshToken).toBeNull;
      });

      test('then it should call setHeader to remove refresh token', () => {
        expect(mockRequest.res.setHeader).toHaveBeenCalled();
      });

      test('then it should return logout lib id', async () => {
        expect(libID).toEqual(libStub()._id);
      });
    });
  });

  describe('addOperationLog', () => {
    describe('when addOperationLog is called', () => {
      let optLog: OperationLog;

      beforeEach(async () => {
        const optLogDto = {
          operator: optLogStub().operator,
          time: optLogStub().time.toString(),
          operation: optLogStub().operation,
          details: optLogStub().details,
        };
        optLog = await libService.addOperationLog(optLogDto);
        if (optLog) logData._id = optLog._id;
      });

      test('then it should return new operation log object', async () => {
        expect(optLog.operator.toString()).toEqual(optLogStub().operator);
        expect(optLog.operation).toEqual(optLogStub().operation);
      });

      test('then it should return null for existing operation', async () => {
        expect(optLog).toBeNull;
      });
    });
  });

  describe('getOperationLog', () => {
    describe('when getOperationLog is called', () => {
      let optLogHistory: OperationLog[];

      beforeEach(async () => {
        optLogHistory = await libService.getOperationLog(optLogStub().operator);
      });

      test('then it should return operation log history', async () => {
        expect(optLogHistory.length).toEqual(1);
        expect(optLogHistory[0]._id).toEqual(optLogStub()._id);
      });
    });
  });

  describe('checkAdmin', () => {
    describe('when checkAdmin is called', () => {
      let result: boolean;

      beforeEach(async () => {
        result = await libService.checkAdmin(libStub()._id);
      });

      test('then it should return true for admin', async () => {
        expect(result).toEqual(true);
      });
    });
  });

  describe('deleteLib', () => {
    describe('when deleteLib is called', () => {
      let libID: string;
      let lib: Librarian;

      beforeEach(async () => {
        libID = await libService.deleteLib(libStub()._id);
        lib = await libService.getProfile(libStub()._id);
      });

      test('then it should return lib id', () => {
        expect(libID).toEqual(JSON.stringify(libStub()._id));
      });

      test('then it should delete the lib from database', () => {
        expect(lib).toBeNull;
      });
    });
  });

  afterAll(async () => {
    await closeMongodConnection();
    jest.clearAllMocks();
  });
});
