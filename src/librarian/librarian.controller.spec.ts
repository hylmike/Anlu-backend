import { Test, TestingModule } from '@nestjs/testing';
import { LibrarianController } from './librarian.controller';
import { LibrarianService } from './librarian.service';
import { TAccessToken } from './test/test.interface';
import {
  RegisterLibDto,
  UpdateLibProfileDto,
  ChangeLibPwdDto,
  OperationLogDto,
} from './lib.dto';
import { libStub, accessTokenStub, optLogStub } from './test/stubs/lib.stub';
import { Librarian, OperationLog } from './librarian.interface';
import { mockRequest } from './__mocks__/mock.service';

jest.mock('./librarian.service');

describe('libController', () => {
  let libController: LibrarianController;
  let libService: LibrarianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [LibrarianController],
      providers: [LibrarianService],
    }).compile();

    libController = module.get<LibrarianController>(LibrarianController);
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
        lib = await libController.register(regLibDto);
      });

      test('then it should call libService', () => {
        expect(libService.register).toHaveBeenCalledWith(regLibDto);
      });

      test('then it should return registered lib object', () => {
        expect(lib).toEqual(libStub());
      });
    });
  });

  describe('getProfile', () => {
    describe('when getProfile is called', () => {
      let lib: Librarian;

      beforeEach(async () => {
        lib = await libController.getProfile(libStub()._id);
      });

      test('then it should call libService', () => {
        expect(libService.getProfile).toHaveBeenCalledWith(libStub()._id);
      });

      test('then it should return a lib object', () => {
        expect(lib).toEqual(libStub());
      });
    });
  });

  describe('updatelibProfile', () => {
    describe('when updatelibProfile is called', () => {
      let libID: string;
      let updateLibDto: UpdateLibProfileDto;

      beforeEach(async () => {
        updateLibDto = {
          username: libStub().username,
          email: libStub().email,
          role: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          isActive: '',
        };
        libID = await libController.updateProfile(updateLibDto);
      });

      test('then it should call libService', () => {
        expect(libService.updateProfile).toHaveBeenCalledWith(updateLibDto);
      });

      test('then it should return updated lib id', () => {
        expect(libID).toEqual(libStub()._id);
      });
    });
  });

  describe('changePassword', () => {
    describe('when changePwd is called', () => {
      let libName: string;
      let changePwdDto: ChangeLibPwdDto;

      beforeEach(async () => {
        changePwdDto = {
          username: libStub().username,
          currentPassword: libStub().password,
          newPassword: 'asdfgh54321',
          confirmPassword: 'asdfgh54321',
        };
        libName = await libController.changePwd(changePwdDto);
      });

      test('then it should call libService', () => {
        expect(libService.changePwd).toHaveBeenCalledWith(changePwdDto);
      });

      test("then it should return chenged lib's username", () => {
        expect(libName).toEqual(libStub().username);
      });
    });
  });

  describe('adminlogin', () => {
    describe('when login is called', () => {
      let accessToken: TAccessToken;

      beforeEach(async () => {
        accessToken = await libController.adminLogin(mockRequest);
      });

      test('then it should call libService', () => {
        expect(libService.login).toHaveBeenCalledWith(mockRequest, 'admin');
      });

      test('then it should return a access token', () => {
        expect(accessToken).toEqual(accessTokenStub());
      });
    });
  });

  describe('liblogin', () => {
    describe('when login is called', () => {
      let accessToken: TAccessToken;

      beforeEach(async () => {
        accessToken = await libController.libLogin(mockRequest);
      });

      test('then it should call libService', () => {
        expect(libService.login).toHaveBeenCalledWith(mockRequest, 'librarian');
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
        accessToken = await libController.refreshToken(mockRequest);
      });

      test('then it should call libService', () => {
        expect(libService.tokenRefresh).toHaveBeenCalledWith(mockRequest);
      });

      test('then it should return a new access token', () => {
        expect(accessToken).toEqual(accessTokenStub());
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let libID: string;

      beforeEach(async () => {
        libID = await libController.logout(mockRequest);
      });

      test('then it should call libService', () => {
        expect(libService.logout).toHaveBeenCalledWith(mockRequest);
      });

      test('then it should return logout lib id', () => {
        expect(libID).toEqual(libStub()._id);
      });
    });
  });

  describe('addOptionLog', () => {
    describe('when addOptLog is called', () => {
      let optLog: OperationLog;
      let optLogDto: OperationLogDto;

      beforeEach(async () => {
        optLogDto = {
          operator: optLogStub().operator,
          time: optLogStub().time.toString(),
          operation: optLogStub().operation,
          details: optLogStub().details,
        };
        optLog = await libController.addOptLog(optLogDto);
      });

      test('then it should call libService', () => {
        expect(libService.addOperationLog).toHaveBeenCalledWith(optLogDto);
      });

      test('then it should return logout lib id', () => {
        expect(optLog).toEqual(optLogStub());
      });
    });
  });

  describe('getOptionLog', () => {
    describe('when getOptLog is called', () => {
      let optLog: OperationLog[];

      beforeEach(async () => {
        optLog = await libController.getOptLog(libStub()._id);
      });

      test('then it should call libService', () => {
        expect(libService.getOperationLog).toHaveBeenCalledWith(libStub()._id);
      });

      test('then it should return operation log of lib', () => {
        expect(optLog).toEqual([optLogStub()]);
      });
    });
  });

  describe('checkAdmin', () => {
    describe('when checkAdmin is called', () => {
      let result: boolean;

      beforeEach(async () => {
        result = await libController.checkAdmin(libStub()._id);
      });

      test('then it should call libService', () => {
        expect(libService.checkAdmin).toHaveBeenCalledWith(libStub()._id);
      });

      test('then it should return boolean value', () => {
        expect(result).toEqual(true);
      });
    });
  });
});
