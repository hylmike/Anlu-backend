import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ReaderService } from './reader.service';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';

import {
  ChangeReaderPwdDto,
  FavourBookDto,
  RegisterReaderDto,
  UpdateReaderDto,
} from './reader.dto';
import {
  accessTokenStub,
  readerData,
  readerStub,
  refreshTokenStub,
} from './test/stubs/reader.stub';
import { mockedJwtService, mockRequest } from './__mocks__/mock.service';
import { logger } from '../../test/util/winston';
import {
  mongooseTestModule,
  closeMongodConnection,
} from '../schemas/test/mongo.test.module';
import {
  ReaderSchema,
  ReaderProfileSchema,
  ReaderReadHistorySchema,
} from '../schemas/reader.schema';
import { Reader, ReaderReadHistory } from './reader.interface';
import { TAccessToken } from './test/stubs/test.interface';
import { Book } from '../book/book.interface';
import {
  BookCommentSchema,
  BookReadRecordSchema,
  BookSchema,
  BookWishListSchema,
} from '../schemas/book.schema';
import { bookData, bookStub } from '../book/test/stubs/book.stub';
import { BookDto } from '../book/book.dto';
import { BookService } from '../book/book.service';

jest.mock('winston');

describe('ReaderService', () => {
  let readerService: ReaderService;
  let bookService: BookService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Reader', schema: ReaderSchema },
          { name: 'ReaderProfile', schema: ReaderProfileSchema },
          { name: 'ReaderReadHistory', schema: ReaderReadHistorySchema },
          { name: 'Book', schema: BookSchema },
          { name: 'BookReadRecord', schema: BookReadRecordSchema },
          { name: 'BookComment', schema: BookCommentSchema },
          { name: 'BookWishList', schema: BookWishListSchema },
        ]),
      ],
      providers: [
        ReaderService,
        BookService,
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

    readerService = module.get<ReaderService>(ReaderService);
    bookService = module.get<BookService>(BookService);
    jest.clearAllMocks();

    //Add book database for later test requirements
    const bookRegisterDto: BookDto = {
      bookTitle: bookStub().bookTitle,
      isbnCode: bookStub().isbnCode,
      category: bookStub().category,
      format: bookStub().format,
      author: bookStub().author,
      language: bookStub().language,
      publisher: bookStub().publisher,
      publishDate: bookStub().purchaseDate.toString(),
      purchaseDate: bookStub().purchaseDate.toString(),
      coverPic: bookStub().coverPic,
      bookFile: bookStub().bookFile,
      price: bookStub().price.toString(),
      desc: bookStub().desc,
      keywords: bookStub().keywords,
      initialScore: bookStub().initialScore.toString(),
      creator: bookStub().creator,
      isActive: 'true',
    };
    const book = await bookService.register(bookRegisterDto);
    bookData._id = book._id;
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
        reader = await readerService.register(regReaderDto);
      });

      test('then it should return a new reader object', async () => {
        expect(reader.registerDate).not.toEqual(readerStub().registerDate);
        expect(reader.username).toEqual(readerStub().username);
        expect(reader.readerProfile.securityAnswer).toEqual(
          readerStub().readerProfile.securityAnswer,
        );
      });

      test('then it should return null for username conflict', async () => {
        expect(reader).toBeNull;
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let reader: Reader;

      beforeEach(async () => {
        reader = await readerService.findOne(readerStub().username);
        readerData._id = reader._id;
      });

      test('then it should return a reader', () => {
        expect(reader.email).toEqual(readerStub().email);
        expect(reader.readerProfile.securityAnswer).toEqual(
          readerStub().readerProfile.securityAnswer,
        );
      });

      test('then return reader should includ password field', async () => {
        expect(reader.password).not.toBeNull;
      });
    });
  });

  describe('getProfile', () => {
    describe('when getProfile is called', () => {
      let reader: Reader;

      beforeEach(async () => {
        reader = await readerService.getProfile(readerStub()._id);
      });

      test('then it should return a reader', () => {
        expect(reader.email).toEqual(readerStub().email);
        expect(reader.readerProfile.securityAnswer).toEqual(
          readerStub().readerProfile.securityAnswer,
        );
      });

      test('then it should return null for invalid id', async () => {
        expect(await readerService.getProfile(null)).toBeNull;
      });
    });
  });

  describe('updateProfile', () => {
    describe('when updateProfile is called', () => {
      let readerID: string;
      let reader: Reader;

      beforeEach(async () => {
        const updateReaderDto: UpdateReaderDto = {
          username: readerStub().username,
          email: 'email@email',
          firstName: '',
          lastName: '',
          gender: '',
          birthday: '',
          phoneNumber: '',
          homeAddress: 'homeAddress',
          province: '',
          postcode: '',
          securityQuestion: '',
          securityAnswer: '',
        };
        readerID = await readerService.updateProfile(updateReaderDto);
        reader = await readerService.findOne(readerStub().username);
      });

      test('reader data should be updated', () => {
        expect(reader.email).toEqual('email@email');
        expect(reader.readerProfile.address.homeAddress).toEqual('homeAddress');
      });

      test('then it should return a reader id', () => {
        expect(readerID).toEqual(readerStub()._id);
      });
    });
  });

  describe('changPassword', () => {
    describe('when changePwd is called', () => {
      let readerName: string;
      let reader: Reader, updatedReader: Reader;
      const newPass = '12345';

      beforeEach(async () => {
        const changePwdDto: ChangeReaderPwdDto = {
          username: readerStub().username,
          currentPassword: readerStub().password,
          newPassword: newPass,
          confirmPassword: newPass,
        };

        const changePwdDto1: ChangeReaderPwdDto = {
          username: readerStub().username,
          currentPassword: newPass,
          newPassword: readerStub().password,
          confirmPassword: readerStub().password,
        };

        reader = await readerService.findOne(readerStub().username);
        readerName = await readerService.changePwd(changePwdDto);
        updatedReader = await readerService.findOne(readerStub().username);
        await readerService.changePwd(changePwdDto1);
      });

      test('reader password should be updated', () => {
        expect(updatedReader.password).not.toEqual(reader.password);
      });

      test('then it should return reader name', () => {
        expect(readerName).toEqual(JSON.stringify(readerStub().username));
      });
    });
  });

  describe('login', () => {
    describe('when login is called', () => {
      let token: TAccessToken;

      beforeEach(async () => {
        jest
          .spyOn(readerService, 'getJwtAccessToken')
          .mockImplementationOnce(() => accessTokenStub().token_info);
        jest
          .spyOn(readerService, 'getCookieJwtRefreshToken')
          .mockImplementationOnce(() => {
            return [
              refreshTokenStub().refreshToken_Cookie,
              refreshTokenStub().refreshToken,
            ];
          });
        jest
          .spyOn(readerService, 'setRefreshToken')
          .mockImplementationOnce(async () => Promise.resolve('OK'));
        token = await readerService.login(mockRequest);
      });

      test('then it should call getJwtAccessToken', () => {
        expect(readerService.getJwtAccessToken).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should call getCookieJwtRefreshToken', () => {
        expect(readerService.getCookieJwtRefreshToken).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should call setRefreshToken', () => {
        expect(readerService.setRefreshToken).toHaveBeenCalledWith(
          refreshTokenStub().refreshToken,
          readerStub()._id,
        );
      });

      test('then it should return a access token in body', () => {
        expect(token).toEqual(accessTokenStub());
      });
    });
  });

  describe('getRefreshTokenById', () => {
    describe('when getRefreshById is called', () => {
      let reader: Reader;

      beforeEach(async () => {
        reader = await readerService.getRefreshById(readerStub()._id);
      });

      test('then it should return a reader', () => {
        expect(reader.username).toEqual(readerStub().username);
      });

      test('then returned reader should include refresh token', async () => {
        expect(reader.currentRefreshToken).not.toBeNull;
      });
    });
  });

  describe('getJwtAccessToken', () => {
    describe('when getJwtAccessToken is called', () => {
      let token: string;
      let mockSign: jest.SpyInstance;

      beforeEach(async () => {
        mockSign = jest.spyOn(mockedJwtService, 'sign');
        token = await readerService.getJwtAccessToken(readerStub()._id);
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
      let readerName: string;

      beforeEach(async () => {
        readerName = await readerService.setRefreshToken(
          refreshTokenStub().refreshToken,
          readerStub()._id,
        );
      });

      test('then it should return refresh token updated reader name', async () => {
        expect(readerName).toEqual(readerStub().username);
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
        refreshToken = await readerService.getCookieJwtRefreshToken(
          readerStub()._id,
        );
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
      let reader: Reader;

      beforeEach(async () => {
        jest
          .spyOn(readerService, 'getRefreshById')
          .mockImplementationOnce(async () => Promise.resolve(readerStub()));
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(async () => Promise.resolve(true));
        reader = await readerService.refreshTokenValidate(
          refreshTokenStub().refreshToken,
          readerStub()._id,
        );
      });

      test('then it should call getRefreshById', async () => {
        expect(readerService.getRefreshById).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should return reader object', async () => {
        expect(reader).toEqual(readerStub());
      });
    });
  });

  describe('tokenRefresh', () => {
    describe('when tokenRefresh is called', () => {
      let token: TAccessToken;

      beforeEach(async () => {
        jest
          .spyOn(readerService, 'getJwtAccessToken')
          .mockImplementationOnce(() => accessTokenStub().token_info);
        token = readerService.tokenRefresh(mockRequest);
      });

      test('then it should call getJwtAccessToken function', () => {
        expect(readerService.getJwtAccessToken).toHaveBeenCalledWith(
          readerStub()._id,
        );
      });

      test('then it should return a new access token', async () => {
        expect(token).toEqual(accessTokenStub());
      });
    });
  });

  describe('logout', () => {
    describe('when logout is called', () => {
      let readerID: string;
      let reader: Reader;

      beforeEach(async () => {
        readerID = await readerService.logout(mockRequest);
        reader = await readerService.getRefreshById(readerStub()._id);
      });

      test('then it should remove refresh token from database', () => {
        expect(reader.currentRefreshToken).toBeNull;
      });

      test('then it should call setHeader to remove refresh token', () => {
        expect(mockRequest.res.setHeader).toHaveBeenCalled();
      });

      test('then it should return logout reader id', async () => {
        expect(readerID).toEqual(readerStub()._id);
      });
    });
  });

  describe('addFavourBook', () => {
    describe('when addFavourBook is called', () => {
      let length: number;
      let favourBookDto: FavourBookDto;

      beforeEach(async () => {
        favourBookDto = {
          bookID: bookStub()._id,
        };
        length = await readerService.addFavourBook(
          readerStub()._id,
          favourBookDto,
        );
      });

      test('then it should return new length of favourbook list', async () => {
        expect(length).toEqual(1);
      });

      test('then it should return 0 for adding existing favourbook', async () => {
        expect(length).toEqual(0);
      });
    });
  });

  describe('getFavourBookList', () => {
    describe('when getFavourBookList is called', () => {
      let favourBookList: Book[];

      beforeEach(async () => {
        favourBookList = await readerService.getFavourBookList(
          readerStub()._id,
        );
      });

      test('then it should return favourbook list', async () => {
        expect(favourBookList[0]._id).toEqual(bookStub()._id);
      });
    });
  });

  describe('delFavourBook', () => {
    describe('when delFavourBook is called', () => {
      let index: number;

      beforeEach(async () => {
        const favourBookDto = {
          bookID: bookStub()._id,
        };
        index = await readerService.delFavourBook(
          readerStub()._id,
          favourBookDto,
        );
      });

      test('then it should return index of favourbook', async () => {
        expect(index).toEqual(0);
      });

      test('then it should return -1 for nonExist favourbook', async () => {
        expect(index).toEqual(-1);
      });
    });
  });

  describe('getReaderReadHistory', () => {
    describe('when getReaderReadHistory is called', () => {
      let readHistory: ReaderReadHistory[];

      beforeEach(async () => {
        readHistory = await readerService.getReadHistory(readerStub()._id);
      });

      test('then it should return readHistory', async () => {
        expect(readHistory.length).toEqual(0);
      });
    });
  });

  afterAll(async () => {
    await closeMongodConnection();
    jest.clearAllMocks();
  });
});
