import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

import {
  mongooseTestModule,
  closeMongodConnection,
} from '../schemas/test/mongo.test.module';
import {
  BookCommentSchema,
  BookReadRecordSchema,
  BookSchema,
  BookWishListSchema,
} from '../schemas/book.schema';
import {
  ReaderProfileSchema,
  ReaderReadHistorySchema,
  ReaderSchema,
} from '../schemas/reader.schema';
import { logger } from '../../test/util/winston';
import {
  Book,
  BookComment,
  BookDocument,
  BookReadRecord,
  BookWishList,
} from './book.interface';
import {
  bookComment,
  bookCommentStub,
  bookData,
  bookReadRecord,
  bookStub,
  bookWishData,
  bookWishStub,
  readerHisData,
  readerReadHistoryStub,
  readRecordStub,
} from './test/stubs/book.stub';
import {
  BookCommentDto,
  BookDto,
  CreateBookWishDto,
  ReadRecordDto,
  SearchBookDto,
  UpdateWishStatusDto,
} from './book.dto';
import { readerData, readerStub } from '../reader/test/stubs/reader.stub';
import { ReaderService } from '../reader/reader.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../reader/__mocks__/mock.service';
import { Reader } from 'src/reader/reader.interface';
import { Model } from 'mongoose';

jest.mock('winston');

describe('BookService', () => {
  let bookService: BookService;
  let readerService: ReaderService;
  let bookModel: Model<BookDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        mongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Book', schema: BookSchema },
          { name: 'BookReadRecord', schema: BookReadRecordSchema },
          { name: 'BookComment', schema: BookCommentSchema },
          { name: 'BookWishList', schema: BookWishListSchema },
          { name: 'Reader', schema: ReaderSchema },
          { name: 'ReaderProfile', schema: ReaderProfileSchema },
          { name: 'ReaderReadHistory', schema: ReaderReadHistorySchema },
        ]),
      ],
      providers: [
        BookService,
        ReaderService,
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

    bookService = module.get<BookService>(BookService);
    readerService = module.get<ReaderService>(ReaderService);
    //Create bookModel for in-memory Book database
    bookModel = module.get<Model<BookDocument>>('BookModel');
    jest.clearAllMocks();

    //create an reader in database for later book read rcord testing
    const regReaderDto = {
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
    const reader = await readerService.register(regReaderDto);
    //Update readerStub id to latest reader id in database
    readerData._id = reader._id;
    bookReadRecord.readerID = reader._id;
  });

  describe('register', () => {
    describe('when register is called', () => {
      let book: Book;

      beforeEach(async () => {
        const bookRegisterDto: BookDto = {
          bookTitle: bookStub().bookTitle,
          isbnCode: bookStub().isbnCode,
          category: bookStub().category,
          format: bookStub().format,
          author: bookStub().author,
          language: bookStub().language,
          publisher: bookStub().publisher,
          publishDate: bookStub().publishDate.toString(),
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
        book = await bookService.register(bookRegisterDto);
      });

      test('it should return new book objet', async () => {
        //update book id of bookStub/readRecordStub/bookCommentStub
        bookData._id = book._id;
        bookReadRecord.book = book._id;
        bookComment.book = book._id;
        readerHisData.bookID = book._id;
        //Check if return value is new book object
        expect(book.bookTitle).toEqual(bookStub().bookTitle);
        expect(book.popularScore).toEqual(bookStub().initialScore);
        expect(book.createDate).not.toEqual(bookStub().createDate);
      });

      test('it should return null for registering existing book', async () => {
        expect(book).toBeNull;
      });
    });
  });

  describe('findBook', () => {
    describe('when findBook is called', () => {
      let book: Book;

      test('it should return a book objet for valid book id', async () => {
        book = await bookService.findBook(bookStub()._id);
        expect(book.bookTitle).toEqual(bookStub().bookTitle);
      });

      test('it should return null for invalid book id', async () => {
        book = await bookService.findBook(null);
        expect(book).toBeNull;
      });
    });
  });

  describe('findAllBook', () => {
    describe('when findAllBook is called', () => {
      let bookList: Book[];

      test('it should return a book list with active books', async () => {
        bookList = await bookService.findAllBook(bookStub().format);
        expect(bookList.length).toEqual(1);
        const book = await bookModel.findById(bookStub()._id);
        book.isActive = false;
        await book.save();
        bookList = await bookService.findAllBook(bookStub().format);
        expect(bookList.length).toEqual(0);
        book.isActive = true;
        await book.save();
      });
    });
  });

  describe('findBookList', () => {
    describe('when findBookList is called', () => {
      let bookList: Book[];
      let searchDto: SearchBookDto;

      beforeEach(async () => {
        searchDto = {
          format: bookStub().format,
          category: bookStub().category,
          bookTitle: bookStub().bookTitle,
          author: bookStub().author,
          publishYear: bookStub().publishDate.getFullYear().toString(),
        };
      });

      test('it should return a book list with search conditions', async () => {
        const book = await bookModel.findById(bookStub()._id);
        bookList = await bookService.findBookList(searchDto);
        expect(bookList.length).toEqual(1);
        book.isActive = false;
        await book.save();
        bookList = await bookService.findBookList(searchDto);
        expect(bookList.length).toEqual(0);
        book.isActive = true;
        await book.save();
      });
    });
  });

  describe('searchBook', () => {
    describe('when searchBook is called', () => {
      let bookList: Book[];

      test('it should return a book list containing search value', async () => {
        bookList = await bookService.searchBook(bookStub().bookTitle);
        const book = await bookModel.findById(bookStub()._id);
        expect(bookList.length).toEqual(1);
        book.isActive = false;
        await book.save();
        bookList = await bookService.searchBook(bookStub().bookTitle);
        expect(bookList.length).toEqual(0);
        book.isActive = true;
        await book.save();
      });
    });
  });

  describe('findHotBooks', () => {
    describe('when findHotBooks is called', () => {
      let bookList: Book[];

      test('it should return a book list with highest score', async () => {
        bookList = await bookService.findHotBooks(5);
        const book = await bookModel.findById(bookStub()._id);
        expect(bookList.length).toEqual(1);
        book.isActive = false;
        await book.save();
        bookList = await bookService.findHotBooks(5);
        expect(bookList.length).toEqual(0);
        book.isActive = true;
        await book.save();
      });
    });
  });

  describe('sumInventory', () => {
    describe('when sumInventory is called', () => {
      interface BookSum {
        category: string;
        count: number;
      }

      let result: BookSum[];

      beforeEach(async () => {
        result = await bookService.sumInventory();
      });

      test('it should return a book list with highest score', async () => {
        expect(result).toEqual([
          { category: 'Romance', count: 0 },
          { category: 'Politics', count: 0 },
          { category: 'Press', count: 0 },
          { category: 'Essay', count: 0 },
          { category: 'Information Technology', count: 1 },
          { category: 'Comic', count: 0 },
          { category: 'History', count: 0 },
          { category: 'Geography', count: 0 },
          { category: 'Dissertation', count: 0 },
          { category: 'Art', count: 0 },
          { category: 'Sport', count: 0 },
        ]);
      });
    });
  });

  describe('updateBookInfo', () => {
    describe('when updateBookInfo is called', () => {
      let book: Book;
      const w1 = Number(process.env.SCORE_W1);
      const w2 = Number(process.env.SCORE_W2);
      const newAuthor = 'Johnson';
      const newInitialScore = '500';
      const newPrice = '10';

      beforeEach(async () => {
        const updateBookDto: BookDto = {
          bookTitle: bookStub().bookTitle,
          isbnCode: bookStub().isbnCode,
          category: bookStub().category,
          format: bookStub().format,
          author: newAuthor,
          language: bookStub().language,
          publisher: bookStub().publisher,
          publishDate: bookStub().publishDate.toString(),
          purchaseDate: bookStub().purchaseDate.toString(),
          coverPic: '',
          bookFile: '',
          price: newPrice,
          desc: bookStub().desc,
          keywords: bookStub().keywords,
          initialScore: newInitialScore,
          creator: bookStub().creator,
          isActive: 'active',
        };
        book = await bookService.updateBookInfo(updateBookDto);
      });

      test('it should return update book objet based on inputs', async () => {
        expect(book.bookTitle).toEqual(bookStub().bookTitle);
        expect(book.author).toEqual(newAuthor);
        expect(book.price).toEqual(Number(newPrice));
        const newPopularScore =
          Number(newInitialScore) +
          book.readTimes * w1 +
          book.readDuration * w2;
        expect(book.popularScore).toEqual(newPopularScore);
      });
    });
  });

  describe('addReadRecord', () => {
    describe('when addReadRecord is called', () => {
      let readRecord: BookReadRecord;
      let book: Book;
      let readRecordDto: ReadRecordDto;
      const currentPage = 100;

      beforeEach(async () => {
        readRecordDto = {
          bookID: readRecordStub().book,
          readerID: readRecordStub().readerID,
          startTime: readRecordStub().startTime,
          currentPage: currentPage,
          duration: readRecordStub().duration,
        };
        readRecord = await bookService.addReadRecord(readRecordDto);
        book = await bookService.findBook(bookStub()._id);
      });

      test('it should return new read record object and update book related information', async () => {
        expect(readRecord.book).toEqual(readRecordStub().book);
        expect(readRecord.startTime).toEqual(readRecordStub().startTime);
        expect(book.readTimes).toEqual(1);
        expect(book.readDuration).toEqual(readRecordStub().duration);
      });

      test('it should return null for exist read record', async () => {
        expect(readRecord).toBeNull;
      });
    });
  });

  describe('getReadHistory', () => {
    describe('when getReadHistory is called', () => {
      let bookReadHistory: [BookReadRecord];
      let reader: Reader;

      beforeEach(async () => {
        bookReadHistory = await bookService.getReadHistory(bookStub()._id);
        reader = await readerService.findOne(readerStub().username);
      });

      test('it should return read history of the book', async () => {
        expect(bookReadHistory[0].book).toEqual(readRecordStub().book);
        expect(bookReadHistory[0].startTime).toEqual(readRecordStub().startTime);
      });

      test('addReadRecord should also update reader read history', async () => {
        expect(reader.readHistory.length).toEqual(1);
        expect(reader.readHistory[0].currentPage).toEqual(
          readerReadHistoryStub()[0].currentPage,
        );
        expect(reader.readerProfile.readTimes).toEqual(1);
        expect(reader.readerProfile.readDuration).toEqual(readRecordStub().duration);
      });
    });
  });

  describe('addBookComment', () => {
    describe('when addBookComment is called', () => {
      let bookComment: BookComment;

      beforeEach(async () => {
        const bookCommentDto: BookCommentDto = {
          bookID: bookCommentStub().book,
          readerName: bookCommentStub().readerName,
          title: bookCommentStub().title,
          comment: bookCommentStub().comment,
        };
        bookComment = await bookService.addBookComment(bookCommentDto);
      });

      test('it should return new book comment object', async () => {
        expect(bookComment.title).toEqual(bookCommentStub().title);
        expect(bookComment.comment).toEqual(bookCommentStub().comment);
        expect(bookComment.createTime).not.toEqual(bookCommentStub().createTime);
      });
    });
  });

  describe('getBookComments', () => {
    describe('when getBookComments is called', () => {
      let bookComment: BookComment[];

      beforeEach(async () => {
        bookComment = await bookService.getBookComments(bookStub()._id);
      });

      test('it should return book comment list', async () => {
        expect(bookComment[0].title).toEqual(bookCommentStub().title);
        expect(bookComment[0].comment).toEqual(bookCommentStub().comment);
      });

      test('it should return null for invalid book id', async () => {
        expect(await bookService.getBookComments(null)).toBeNull;
      });
    });
  });

  describe('addBookWish', () => {
    describe('when addBookWish is called', () => {
      let bookWish: BookWishList;

      beforeEach(async () => {
        const bookWishDto: CreateBookWishDto = {
          bookTitle: bookWishStub().bookTitle,
          readerID: bookWishStub().readerID,
          language: bookWishStub().language,
        };
        bookWish = await bookService.addBookWish(bookWishDto);
      });

      test('it should return new book wish object', async () => {
        bookWishData._id = bookWish._id;
        expect(bookWish.bookTitle).toEqual(bookWishStub().bookTitle);
        expect(bookWish.readerID).toEqual(bookWishStub().readerID);
      });

      test('it should return null for existing wish', async () => {
        expect(bookWish).toBeNull;
      });
    });
  });

  describe('getBookWish', () => {
    describe('when getBookWish is called', () => {
      let bookWish: BookWishList;

      beforeEach(async () => {
        bookWish = await bookService.getBookWish(bookWishStub()._id);
      });

      test('it should return book wish object', async () => {
        expect(bookWish.bookTitle).toEqual(bookWishStub().bookTitle);
        expect(bookWish.language).toEqual(bookWishStub().language);
      });

      test('it should return null for invalid book id', async () => {
        expect(await bookService.getBookWish(null)).toBeNull;
      });
    });
  });

  describe('updateWishStatus', () => {
    describe('when updateWishStatus is called', () => {
      let wishID: string;
      let bookWish: BookWishList;

      beforeEach(async () => {
        const wishStatusDto: UpdateWishStatusDto = {
          WishID: bookWishStub()._id,
          status: 'Fulfilled',
        };
        wishID = await bookService.updateWishStatus(wishStatusDto);
        bookWish = await bookService.getBookWish(wishID);
      });

      test('it should update status and return updated wish id', async () => {
        expect(bookWish.status).toEqual('Fulfilled');
        expect(wishID).toEqual(bookWishStub()._id);
      });
    });
  });

  describe('getBookWishList', () => {
    describe('when getBookWishList is called', () => {
      let wishList: BookWishList[];

      beforeEach(async () => {
        const bookWishDto: CreateBookWishDto = {
          bookTitle: 'New Book',
          readerID: bookWishStub().readerID,
          language: bookWishStub().language,
        };
        await bookService.addBookWish(bookWishDto);
        wishList = await bookService.getBookWishList();
      });

      test('it should only return non-fulfilled book wish', async () => {
        expect(wishList.length).toEqual(1);
        expect(wishList[0].bookTitle).toEqual('New Book');
      });
    });
  });

  describe('delBook', () => {
    describe('when delBook is called', () => {
      let bookID: string;

      beforeEach(async () => {
        bookID = await bookService.delBook(bookStub()._id);
      });

      test('it should return deleted book id', async () => {
        expect(bookID).toEqual(JSON.stringify(bookStub()._id));
      });

      test('it should return null for non-existing book', async () => {
        expect(bookID).toBeNull;
      });
    });
  });

  afterAll(async () => {
    await closeMongodConnection();
    jest.clearAllMocks();
  });
});
