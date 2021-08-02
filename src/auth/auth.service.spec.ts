import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { AuthService } from './auth.service';
import { logger } from '../../test/util/winston';
import { ReaderService } from '../reader/reader.service';
import { LibrarianService } from '../librarian/librarian.service';
import { Reader } from '../reader/reader.interface';
import { readerStub } from '../reader/test/stubs/reader.stub';
import { Promise } from 'mongoose';
import { libStub } from '../librarian/test/stubs/lib.stub';
import { Librarian } from '../librarian/librarian.interface';
import { mockLibrarianService, mockReaderService } from './test/mock.service';

jest.mock('winston');
//jest.mock('../reader/reader.service');
//jest.mock('../librarian/librarian.service');

describe('AuthService', () => {
  let authService: AuthService;
  let readerService: ReaderService;
  let libService: LibrarianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: ReaderService,
          useValue: mockReaderService,
        },
        {
          provide: LibrarianService,
          useValue: mockLibrarianService,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    readerService = module.get<ReaderService>(ReaderService);
    libService = module.get<LibrarianService>(LibrarianService);
    jest.clearAllMocks();
  });

  describe('validateReader', () => {
    describe('if validateReader is called', () => {
      let reader: Reader;

      beforeEach(async () => {
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(true));
        reader = await authService.validateReader(
          readerStub().username,
          readerStub().password,
        );
      });

      test('it should call readerService', async () => {
        expect(readerService.findOne).toHaveBeenCalledWith(
          readerStub().username,
        );
      });

      test('it should return reader object if validation passed', async () => {
        expect(reader._id).toEqual(readerStub()._id);
      });
    });
  });

  describe('validateLibrarian', () => {
    describe('if validateLibrarian is called', () => {
      let lib: Librarian;

      beforeEach(async () => {
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementationOnce(() => Promise.resolve(true));
        lib = await authService.validateLibrarian(
          libStub().username,
          libStub().password,
        );
      });

      test('it should call librarianService', async () => {
        expect(libService.findOne).toHaveBeenCalledWith(libStub().username);
      });

      test('it should return lib object if validation passed', async () => {
        expect(lib._id).toEqual(libStub()._id);
      });
    });
  });
});
