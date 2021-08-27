import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import 'dotenv/config';

import {
  BookDto,
  ReadRecordDto,
  BookCommentDto,
  CreateBookWishDto,
  UpdateWishStatusDto,
  SearchBookDto,
} from './book.dto';
import {
  Book,
  BookDocument,
  BookReadRecordDocument,
  BookComment,
  BookCommentDocument,
  BookWishList,
  BookWishDocument,
} from './book.interface';
import {
  ReaderDocument,
  ReaderReadHisDocument,
  ReaderReadHistory,
} from 'src/reader/reader.interface';

@Injectable()
export class BookService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Book') private readonly bookModel: Model<BookDocument>,
    @InjectModel('BookReadRecord')
    private readonly readRecordModel: Model<BookReadRecordDocument>,
    @InjectModel('BookComment')
    private readonly bookCommentModel: Model<BookCommentDocument>,
    @InjectModel('BookWishList')
    private readonly bookWishListModel: Model<BookWishDocument>,
    @InjectModel('Reader') private readonly readerModel: Model<ReaderDocument>,
    @InjectModel('ReaderReadHistory')
    private readonly readerReadHistoryModel: Model<ReaderReadHisDocument>,
  ) { }

  /*Fileupload function, not use anymore
  import { createWriteStream } from 'fs';
  import { join } from 'path';
  async fileUpload(file) {
    const file_url = join(
      __dirname + '../../' + 'fileUpload' + `${file[0]['originalname']}`,
    );
    const fileBuffer = file[0]['buffer'];
    const writeFile = createWriteStream(file_url);
    writeFile.write(fileBuffer);
    this.logger.info(`Start uploading ${file[0]['originalname']} into folder ${file_url}`);
  }
  */

  async register(createBookDto: BookDto): Promise<Book> {
    //First check if register book already existed in database
    const bookTitle = createBookDto.bookTitle.trim();
    if (await this.bookModel.findOne({ bookTitle: bookTitle })) {
      this.logger.warn(
        `Book ${bookTitle} already exists, please register another one`,
      );
      return null;
    }
    //If not exist, start registration
    const initialScore = createBookDto.initialScore
      ? createBookDto.initialScore
      : process.env.BOOK_SCORE_INITIAL_VALUE;
    const newBook = new this.bookModel({
      bookTitle: createBookDto.bookTitle,
      isbnCode: createBookDto.isbnCode,
      category: createBookDto.category,
      format: createBookDto.format,
      author: createBookDto.author,
      language: createBookDto.language,
      publisher: createBookDto.publisher,
      publishDate: createBookDto.publishDate == '' ? new Date(0) : new Date(createBookDto.publishDate),
      purchaseDate: createBookDto.purchaseDate == '' ? new Date(0) : new Date(createBookDto.purchaseDate),
      price: createBookDto.price == '' ? 0 : Number(createBookDto.price),
      coverPic: createBookDto.coverPic,
      bookFile: createBookDto.bookFile,
      desc: createBookDto.desc,
      keywords: createBookDto.keywords,
      creator: createBookDto.creator,
      isActive: createBookDto.isActive.toLowerCase() === 'true' ? true : false,
      createDate: new Date(),
      readTimes: 0,
      readDuration: 0,
      initialScore: Number(initialScore),
      popularScore: Number(initialScore),
    });
    try {
      const registerBook = await newBook.save();
      this.logger.info(`Success registered book ${registerBook.bookTitle}`);
      return registerBook;
    } catch (err) {
      this.logger.error(
        `Saving book ${newBook.bookTitle} failed when registering: ${err}`,
      );
      return null;
    }
  }

  async findBook(bookID: string): Promise<Book> {
    const book = await this.bookModel.findById(bookID);
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookID} in database, get book failed`,
      );
      return null;
    }
    this.logger.info(`Success get book ${book.bookTitle} from database`);
    return book;
  }

  async findAllBook(bookFormat: string): Promise<Book[]> {
    const bookList = await this.bookModel.find({ format: bookFormat });
    if (bookList) {
      this.logger.info(`Success find all ${bookFormat}`);
      return bookList;
    } else {
      this.logger.warn(`Failed to find ${bookFormat} from database`);
      return null;
    }
  }

  async findBookList(searchBookDto: SearchBookDto): Promise<Book[]> {
    //Create the seach condition object
    const conditions = {};
    const andClause = [];
    for (const item in searchBookDto) {
      switch (item) {
        case 'format':
          andClause.push({ format: searchBookDto[item] });
          break;
        case 'category':
          if (searchBookDto[item] !== '') {
            andClause.push({ category: searchBookDto[item] });
          }
          break;
        case 'bookTitle':
          if (searchBookDto[item] !== '') {
            andClause.push({
              bookTitle: { $regex: searchBookDto[item], $options: 'i' },
            });
          }
          break;
        case 'author':
          if (searchBookDto[item] !== '') {
            andClause.push({
              author: { $regex: searchBookDto[item], $options: 'i' },
            });
          }
          break;
        case 'publishYear':
          const startTime = `${searchBookDto[item]}-01-01`;
          const endTime = `${searchBookDto[item]}-12-31`;
          if (searchBookDto[item] !== '') {
            andClause.push({
              publishDate: {
                $gte: new Date(startTime),
                $lte: new Date(endTime),
              },
            });
          }
          break;
      }
    }
    if (andClause.length > 0) {
      conditions['$and'] = andClause;
    }

    //Search book in dababase based on search array
    const bookList = await this.bookModel.find(conditions).exec();

    if (bookList) {
      this.logger.info('Success get book list based on search conditions');
      return bookList;
    } else {
      this.logger.warn('Failed to find book from database');
      return null;
    }
  }

  async updateBookInfo(bookDto: BookDto) {
    const book = await this.bookModel.findOne({
      bookTitle: bookDto.bookTitle,
    });
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookDto.bookTitle} when update its info`,
      );
      return null;
    }
    const w1 = Number(process.env.SCORE_W1);
    const w2 = Number(process.env.SCORE_W2);
    for (const item in bookDto) {
      switch (item) {
        case 'bookTitle':
          break;
        case 'publishDate':
          if (bookDto[item] !== '') book[item] = new Date(bookDto[item]);
          break;
        case 'purchaseDate':
          if (bookDto[item] !== '') book[item] = new Date(bookDto[item]);
          break;
        case 'price':
          if (bookDto[item] !== '') book[item] = Number(bookDto[item]);
          break;
        case 'initialScore':
          if (bookDto[item] !== '') book[item] = Number(bookDto[item]);
          book.popularScore =
            book.initialScore + book.readTimes * w1 + book.readDuration * w2;
          break;
        case 'isActive':
          if (bookDto[item] !== '')
            book[item] = bookDto[item].toLowerCase() === 'active' ? true : false;
          break;
        default:
          if (bookDto[item] !== '') book[item] = bookDto[item];
      }
    }
    try {
      const updatedBook = await book.save();
      this.logger.info(`Success update info of book ${book._id}`);
      return updatedBook;
    } catch (err) {
      this.logger.error(
        `Failed to save update book ${book.bookTitle} info: ${err}`,
      );
      return null;
    }
  }

  async delBook(bookID: string) {
    try {
      await this.bookModel.findByIdAndDelete(bookID);
      this.logger.info(`Success delete book ${bookID}`);
      return bookID;
    } catch (err) {
      this.logger.error(`Failed to delete book ${bookID}: ${err}`);
      return null;
    }
  }

  async addReadRecord(readRecordDto: ReadRecordDto) {
    //Read predefined global parameter for book popularscore calculation from env file
    const w0 = Number(process.env.SCORE_TIME_THRESHOLD); //default is 60s
    const w1 = Number(process.env.SCORE_W1); //default is 300, like 5min read each reading time
    const w2 = Number(process.env.SCORE_W2); //default is 1
    const bookID = readRecordDto.bookID;
    const readerID = readRecordDto.readerID;
    const startTime = readRecordDto.startTime;
    const currentPage = readRecordDto.currentPage;
    const duration = readRecordDto.duration;
    //Only consider read duration longer than SCORE_TIME_THRESHOLD (default:60s) as valid reading
    if (readRecordDto.duration > w0) {
      const book = await this.bookModel.findById(bookID);
      if (!book) {
        this.logger.warn(
          `Can not find book ${bookID}, adding book read record failed`,
        );
        return null;
      }
      //First check is this read record already in database
      if (
        await this.readRecordModel.findOne({
          book: bookID,
          readerID: readerID,
          startTime: startTime,
        })
      ) {
        this.logger.warn(`Read record already exist, adding record failed`);
        return null;
      }
      //If not exist, create new read record in mongoDB BookReadRecord document
      let newRecord = new this.readRecordModel({
        book: bookID,
        readerID: readerID,
        startTime: startTime,
        duration: duration,
      });
      //Update mongoDB book document with new read record
      book.readHistory.push(newRecord._id);
      book.readTimes += 1;
      book.readDuration += duration;
      book.popularScore =
        book.initialScore + book.readTimes * w1 + book.readDuration * w2;
      try {
        newRecord = await newRecord.save();
        await book.save();
        //Create log for this activity
        this.logger.info(`Success add readRecord ${newRecord._id}`);
      } catch (err) {
        this.logger.error(
          `Saving new read record or update book database failed: ${err}`,
        );
        return null;
      }
      this.addReaderReadHistory(
        readerID,
        bookID,
        startTime,
        currentPage,
        duration,
      );
      return newRecord;
    } else {
      this.logger.warn(`Read time less than threshold, invalid read record`);
      return null;
    }
  }

  async addReaderReadHistory(
    readerID: string,
    bookID: string,
    startTime: Date,
    currentPage: number,
    duration: number,
  ): Promise<ReaderReadHistory> {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn(
        `Can not find the reader ${readerID} when update read history`,
      );
      return null;
    }
    let existInd = false;
    let record;
    const w1 = Number(process.env.SCORE_W1); //default is 300, like 5min read each reading time
    const w2 = Number(process.env.SCORE_W2); //default is 1
    //Check if book already read before, if did, update existing read record
    for (record of reader.readHistory) {
      if (record.bookID === bookID) {
        record.currentPage = currentPage;
        record.lastReadTime = startTime;
        record.readTimes += 1;
        record.readDuration += duration;
        existInd = true;
        break;
      }
    }
    if (existInd) {
      try {
        await reader.save();
        this.logger.info(
          `Success update read record of book ${bookID} for reader ${reader.username}`,
        );
        return record;
      } catch (err) {
        this.logger.error(
          `Update read history failed for reader ${reader.username}: ${err}`,
        );
        return null;
      }
    }
    //If book did not read before, create new read record
    if (!existInd) {
      const newReadRecord = new this.readerReadHistoryModel({
        bookID: bookID,
        currentPage: currentPage,
        startTime: startTime,
        lastReadTime: startTime,
        readTimes: 1,
        readDuration: duration,
      });
      reader.readHistory.push(newReadRecord);
      reader.readerProfile.readTimes += 1;
      reader.readerProfile.readDuration += duration;
      reader.readerProfile.score =
        reader.readerProfile.readTimes * w1 +
        reader.readerProfile.readDuration * w2;
      try {
        await reader.save();
        this.logger.info(
          `Success create new book ${bookID} read record for reader ${reader.username}`,
        );
        return newReadRecord;
      } catch (err) {
        this.logger.error(
          `Create new read record failed for reader ${reader.username}: ${err}`,
        );
        return null;
      }
    }
  }

  async getReadHistory(bookID: string) {
    const book = await this.bookModel
      .findById(bookID)
      .populate('readHistory')
      .exec();
    if (!book) {
      this.logger.warn(`Can not find book ${bookID}, get read history failed`);
      return null;
    }
    //create log for this activity
    this.logger.info(`Success get book ${bookID} read history`);
    return book.readHistory;
  }

  async addBookComment(bookCommentDto: BookCommentDto): Promise<BookComment> {
    const book = await this.bookModel.findById(bookCommentDto.bookID);
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookCommentDto.bookID}, adding book comment failed`,
      );
      return null;
    }
    //Create new comment in mongoDB BookComment document
    const now = new Date();
    const newComment = new this.bookCommentModel({
      book: bookCommentDto.bookID,
      readerName: bookCommentDto.readerName,
      title: bookCommentDto.title,
      comment: bookCommentDto.comment,
      createTime: now,
    });
    //Update mongoDB book document with new comment
    book.comments.push(newComment._id);
    await newComment.save();
    await book.save();
    //Create log for this activity
    this.logger.info(
      `Success add comment ${newComment._id} for book ${book._id}`,
    );
    return newComment;
  }

  async getBookComments(bookID) {
    const book = await this.bookModel
      .findById(bookID)
      .populate('comments')
      .exec();
    if (!book) {
      this.logger.warn(
        `Can not find book ${bookID}, getting book comment failed`,
      );
      return null;
    }
    //Create log for this activity
    this.logger.info(`Success get comment for book ${book._id}`);
    return book.comments;
  }

  async addBookWish(bookWishDto: CreateBookWishDto): Promise<BookWishList> {
    if (bookWishDto.bookTitle.trim() !== '') {
      //Check if this book wish already raised before
      if (
        await this.bookWishListModel.findOne({
          bookTitle: bookWishDto.bookTitle,
          language: bookWishDto.language,
        })
      ) {
        this.logger.warn(
          `The book wish ${bookWishDto.bookTitle} was already in database.`,
        );
        return null;
      }
      const newBookWish = new this.bookWishListModel({
        bookTitle: bookWishDto.bookTitle,
        readerID: bookWishDto.readerID,
        language: bookWishDto.language,
        status: 'Under Review',
      });
      await newBookWish.save();
      //Create log for this activity
      this.logger.info(`Success add book wish ${newBookWish._id}`);
      return newBookWish;
    }
  }

  async getBookWishList(): Promise<BookWishList[]> {
    const bookWishList = await this.bookWishListModel.find({
      status: { $in: ['Under Review', 'Approved'] },
    });
    //Create log for this activity
    this.logger.info(`Success get unfulfilled book wish list`);
    return bookWishList;
  }

  async getBookWish(bookWishID): Promise<BookWishList> {
    const bookWish = await this.bookWishListModel.findById(bookWishID);
    if (!bookWish) {
      this.logger.warn(
        `Can not find bookwish ${bookWishID}, getting book wish failed`,
      );
      return null;
    }
    //Create log for this activity
    this.logger.info(`Success get book wish for ${bookWish._id}`);
    return bookWish;
  }

  async updateWishStatus(updateWishStatusDto: UpdateWishStatusDto) {
    const bookWish = await this.bookWishListModel.findById(
      updateWishStatusDto.WishID,
    );
    bookWish.status = updateWishStatusDto.status;
    await bookWish.save();
    //Create log for this activity
    this.logger.info(`Success update status of book wish ${bookWish._id}`);
    return bookWish._id;
  }

  async clearReadHistory(bookID) {
    const book = await this.bookModel.findById(bookID);
    book.readHistory.splice(0, book.readHistory.length);
    book.readTimes = 0;
    book.readDuration = 0;
    book.popularScore = book.initialScore;
    await book.save();
    await this.readRecordModel.findOneAndDelete({ book: bookID });
    this.logger.info(`Success deleted the read history of book ${bookID}`);
    return book.readHistory.length;
  }
}
