import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Readable } from 'stream';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { logger } from '../../test/util/winston';
import { fileToBuffer } from './__mocks__/mockFile';
import { Book, BookComment, BookReadRecord, BookWish } from './book.interface';
import {
  bookCommentStub,
  bookStub,
  bookWishStub,
  readRecordStub,
} from './test/stubs/book.stub';
import {
  BookCommentDto,
  BookDto,
  CreateBookWishDto,
  GetWishListDto,
  ReadRecordDto,
  SearchBookDto,
  UpdateWishStatusDto,
} from './book.dto';

jest.mock('./book.service');

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    bookController = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
    jest.clearAllMocks();
  });

  describe('fileUpload', () => {
    describe('when fileUpload is called', () => {
      let returnValue: { fileUrl: string };
      let uploadFile: Express.Multer.File;

      beforeEach(async () => {
        const fileBuffer = (await fileToBuffer(
          __dirname + '/test/sample.png',
        )) as Buffer;
        const myStreamBuffer = Readable.from(fileBuffer);
        uploadFile = {
          buffer: fileBuffer,
          fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
          originalname: 'original-filename',
          encoding: '7bit',
          mimetype: 'file-mimetyp',
          destination: '/fileUpload',
          filename: 'file-name',
          path: 'file-path',
          size: 1800000,
          stream: myStreamBuffer,
        };
        returnValue = await bookController.fileUpload(uploadFile);
      });

      test('then it should return uploaded file url', async () => {
        expect(returnValue.fileUrl).toEqual(uploadFile.path);
      });
    });
  });

  describe('registerBook', () => {
    describe('when registerBook is called', () => {
      let book: Book;
      let createBookDto: BookDto;

      beforeEach(async () => {
        createBookDto = {
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
        book = await bookController.registerBook(createBookDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.register).toHaveBeenCalledWith(createBookDto);
      });

      test('then it should return a new book object', async () => {
        expect(book).toEqual(bookStub());
      });
    });
  });

  describe('findBook', () => {
    describe('when findBook is called', () => {
      let book: Book;

      beforeEach(async () => {
        book = await bookController.findBook(bookStub()._id);
      });

      test('then is should call bookService', async () => {
        expect(bookService.findBook).toHaveBeenCalledWith(bookStub()._id);
      });

      test('then it should return a book object', async () => {
        expect(book).toEqual(bookStub());
      });
    });
  });

  describe('findAllBook', () => {
    describe('when findAllBook is called', () => {
      let bookList: Book[];

      beforeEach(async () => {
        bookList = await bookController.findAllBook('ebook');
      });

      test('then is should call bookService', async () => {
        expect(bookService.findAllBook).toHaveBeenCalledWith('ebook');
      });

      test('then it should return a book list', async () => {
        expect(bookList).toEqual([bookStub()]);
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
          publishYear: '2019',
        };
        bookList = await bookController.findBookList(searchDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.findBookList).toHaveBeenCalledWith(searchDto);
      });

      test('then it should return a book list', async () => {
        expect(bookList).toEqual([bookStub()]);
      });
    });
  });

  describe('findHotBooks', () => {
    describe('when findHotBooks is called', () => {
      let bookList: Book[];

      beforeEach(async () => {
        bookList = await bookController.findHotBooks(6);
      });

      test('then is should call bookService', async () => {
        expect(bookService.findHotBooks).toHaveBeenCalledWith(6);
      });

      test('then it should return a book list', async () => {
        expect(bookList).toEqual([bookStub()]);
      });
    });
  });

  describe('sumInventory', () => {
    describe('when sumInventory is called', () => {
      let result;

      beforeEach(async () => {
        result = await bookController.sumInventory();
      });

      test('then is should call bookService', async () => {
        expect(bookService.sumInventory).toHaveBeenCalled;
      });

      test('then it should return a book summary list', async () => {
        expect(result).toEqual([{ category: 'Romance', count: 5 }]);
      });
    });
  });

  describe('delBook', () => {
    describe('when delBook is called', () => {
      let bookID: string;

      beforeEach(async () => {
        bookID = await bookController.delBook(bookStub()._id);
      });

      test('then is should call bookService', async () => {
        expect(bookService.delBook).toHaveBeenCalledWith(bookStub()._id);
      });

      test('then it should return deleted book id', async () => {
        expect(bookID).toEqual(bookStub()._id);
      });
    });
  });

  describe('updateBookInfo', () => {
    describe('when updateBookInfo is called', () => {
      let book: Book;
      let bookInfo: BookDto;

      beforeEach(async () => {
        bookInfo = {
          bookTitle: bookStub().bookTitle,
          isbnCode: '',
          category: bookStub().category,
          format: '',
          author: '',
          language: '',
          publisher: bookStub().publisher,
          publishDate: '',
          purchaseDate: '',
          coverPic: '',
          bookFile: '',
          price: '',
          desc: '',
          keywords: bookStub().keywords,
          initialScore: '',
          creator: '',
          isActive: '',
        };
        book = await bookController.updateBookInfo(bookInfo);
      });

      test('then is should call bookService', async () => {
        expect(bookService.updateBookInfo).toHaveBeenCalledWith(bookInfo);
      });

      test('then it should return upadted book', async () => {
        expect(book).toEqual(bookStub());
      });
    });
  });

  describe('addReadRecord', () => {
    describe('when addReadRecord is called', () => {
      let readRecord: BookReadRecord;
      let readRecordDto: ReadRecordDto;

      beforeEach(async () => {
        readRecordDto = {
          bookID: readRecordStub().book,
          readerID: readRecordStub().readerID,
          startTime: readRecordStub().startTime,
          currentPage: 100,
          duration: readRecordStub().duration,
        };
        readRecord = await bookController.addReadRecord(readRecordDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.addReadRecord).toHaveBeenCalledWith(readRecordDto);
      });

      test('then it should return a new readRecord object', async () => {
        expect(readRecord).toEqual(readRecordStub());
      });
    });
  });

  describe('getReadHistory', () => {
    describe('when getReadHistory is called', () => {
      let readHistory: BookReadRecord[];

      beforeEach(async () => {
        readHistory = await bookController.getReadHistory(bookStub()._id);
      });

      test('then is should call bookService', async () => {
        expect(bookService.getReadHistory).toHaveBeenCalledWith(bookStub()._id);
      });

      test('then it should return a read history array', async () => {
        expect(readHistory).toEqual([readRecordStub()]);
      });
    });
  });

  describe('addComment', () => {
    describe('when addComment is called', () => {
      let bookComment: BookComment;
      let bookCommentDto: BookCommentDto;

      beforeEach(async () => {
        bookCommentDto = {
          bookID: bookCommentStub().book,
          readerName: bookCommentStub().readerName,
          title: bookCommentStub().title,
          comment: bookCommentStub().comment,
        };
        bookComment = await bookController.addComment(bookCommentDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.addBookComment).toHaveBeenCalledWith(bookCommentDto);
      });

      test('then it should return a new bookComment object', async () => {
        expect(bookComment).toEqual(bookCommentStub());
      });
    });
  });

  describe('getComments', () => {
    describe('when getComments is called', () => {
      let bookComment: BookComment[];

      beforeEach(async () => {
        bookComment = await bookController.getComments(bookStub()._id);
      });

      test('then is should call bookService', async () => {
        expect(bookService.getBookComments).toHaveBeenCalledWith(
          bookStub()._id,
        );
      });

      test('then it should return a bookComment object', async () => {
        expect(bookComment).toEqual([bookCommentStub()]);
      });
    });
  });

  describe('addBookWish', () => {
    describe('when addBookWish is called', () => {
      let bookWish: BookWish;
      let creatWishDto: CreateBookWishDto;

      beforeEach(async () => {
        creatWishDto = {
          bookTitle: bookWishStub().bookTitle,
          creator: bookWishStub().creator,
          format: bookWishStub().format,
          language: bookWishStub().language,
        };
        bookWish = await bookController.addBookWish(creatWishDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.addBookWish).toHaveBeenCalledWith(creatWishDto);
      });

      test('then it should return a new bookWish object', async () => {
        expect(bookWish).toEqual(bookWishStub());
      });
    });
  });

  describe('getBookWish', () => {
    describe('when getBookWish is called', () => {
      let bookWish: BookWish;

      beforeEach(async () => {
        bookWish = await bookController.getBookWish(bookWishStub()._id);
      });

      test('then is should call bookService', async () => {
        expect(bookService.getBookWish).toHaveBeenCalled();
      });

      test('then it should return book Wish object', async () => {
        expect(bookWish).toEqual(bookWishStub());
      });
    });
  });

  describe('getBookWishList', () => {
    describe('when getBookWishList is called', () => {
      let bookWishList: BookWish[];
      const getWishListDto: GetWishListDto = {
        readerName: bookWishStub().creator,
        format: bookWishStub().format,
      };

      beforeEach(async () => {
        bookWishList = await bookController.getWishList(getWishListDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.getWishList).toHaveBeenCalled();
      });

      test('then it should return unfulfilled book Wish list', async () => {
        expect(bookWishList).toEqual([bookWishStub()]);
      });
    });
  });

  describe('updateWishStatush', () => {
    describe('when updateWishStatus is called', () => {
      let wishID: string;
      let updateWishDto: UpdateWishStatusDto;

      beforeEach(async () => {
        updateWishDto = {
          wishID: bookWishStub()._id,
          status: bookWishStub().status,
        };
        wishID = await bookController.updateWishStatus(updateWishDto);
      });

      test('then is should call bookService', async () => {
        expect(bookService.updateWishStatus).toHaveBeenCalledWith(
          updateWishDto,
        );
      });

      test('then it should return updated bookWish id', async () => {
        expect(wishID).toEqual(bookWishStub()._id);
      });
    });
  });
});
