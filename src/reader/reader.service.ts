import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import {
  Reader,
  ReaderDocument,
  ReaderProDocument,
  ReaderReadHistory,
  ReaderReadHisDocument,
} from './reader.interface';
import {
  ChangeReaderPwdDto,
  RegisterReaderDto,
  UpdateReaderDto,
  FavourBookDto,
} from './reader.dto';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';

@Injectable()
export class ReaderService {

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Reader') private readonly readerModel: Model<ReaderDocument>,
    @InjectModel('ReaderProfile')
    private readonly readerProfileModel: Model<ReaderProDocument>,
    @InjectModel('ReaderReadHistory')
    private readonly readerReadHistoryModel: Model<ReaderReadHisDocument>,
    private readonly jwtService: JwtService,
  ) { }

  //Register new reader into database
  async register(registerReaderDto: RegisterReaderDto) {
    const username = registerReaderDto.username.trim();
    const reader = await this.readerModel.findOne({ username: username });
    if (username === '') {
      this.logger.warn(`Username or form is empty, register failed`);
      return null;
    } else if (reader) {
      this.logger.warn(`The reader ${username} exists, reader register failed`);
      return null;
      //throw new ConflictException(`The username already exists`);
    } else if (
      registerReaderDto.password !== registerReaderDto.confirmPassword
    ) {
      this.logger.warn(`Passwords mismatched, register ${username} failed`);
      return null;
    }
    //encrypt password before saving into database
    const hash = await bcrypt.hash(registerReaderDto.confirmPassword, 10);
    //Create new reader & reader profile document and save into database
    const newReaderProfile = new this.readerProfileModel({
      gender: registerReaderDto.gender,
      firstName: registerReaderDto.firstName,
      lastName: registerReaderDto.lastName,
      birthday: new Date(registerReaderDto.birthday),
      phoneNumber: registerReaderDto.phoneNumber,
      address: {
        homeAddress: registerReaderDto.homeAddress,
        province: registerReaderDto.province,
        postcode: registerReaderDto.postcode,
      },
      securityQuestion: registerReaderDto.securityQuestion,
      securityAnswer: registerReaderDto.securityAnswer,
      readTimes: 0,
      readDuration: 0,
      score: 0,
    });
    const newReader = new this.readerModel({
      username: registerReaderDto.username,
      password: hash,
      email: registerReaderDto.email,
      registerDate: new Date(),
      readerProfile: newReaderProfile,
    });
    try {
      const reader = await newReader.save();
      //create log for this activity
      this.logger.info(`Success registered reader ${reader.username}`);
      return reader;
    } catch (err) {
      this.logger.error(
        `Saving new reader ${newReader.username} into database failed: ${err}`,
      );
      return null;
    }
  }

  //Get reader profile based on id from database
  async getProfile(readerID): Promise<Reader | undefined> {
    const reader = await this.readerModel.findById(readerID).exec();
    if (reader) {
      //create log for this activity
      this.logger.info(`Success get reader ${readerID} profile`);
      return reader;
    }
    this.logger.warn(`Reader ${readerID} does not exist, get profile failed`);
    return null;
  }

  //Update reader profile based on inputs and save into database
  async updateProfile(updateReaderDto: UpdateReaderDto) {
    const reader = await this.readerModel
      .findOne({ username: updateReaderDto.username })
      .exec();
    if (!reader) {
      this.logger.warn(
        `Can not find reader ${updateReaderDto.username} in updateProfile module`,
      );
      return null;
    }
    const readerProfile = reader.readerProfile;
    const address = ['homeAddress', 'province', 'postcode'];
    for (const item in updateReaderDto) {
      switch (item) {
        case 'username':
          break;
        case 'email':
          if (updateReaderDto[item] !== '') {
            reader.email = updateReaderDto.email;
          }
          break;
        case 'birthday':
          if (updateReaderDto[item] !== '') {
            readerProfile.birthday = new Date(updateReaderDto[item]);
          }
          break;
        default:
          if (address.includes(item) && updateReaderDto[item] !== '') {
            readerProfile.address[item] = updateReaderDto[item];
          } else if (updateReaderDto[item] !== '') {
            readerProfile[item] = updateReaderDto[item];
          }
      }
    }
    try {
      const updatedReader = await reader.save();
      //create log for this activity
      this.logger.info(
        `Success updated profile of reader ${updatedReader.username}`,
      );
      return updatedReader._id;
    } catch (err) {
      this.logger.error(
        `Saving updated reader ${reader.username} into database failed: ${err}`,
      );
      return null;
    }
  }

  //Change password of reader account
  async changePwd(changeReaderPwdDto: ChangeReaderPwdDto) {
    console.log(changeReaderPwdDto);
    const reader = await this.readerModel
      .findOne({ username: changeReaderPwdDto.username })
      .select('+password')
      .exec();
    if (!reader) {
      this.logger.warn(
        `Can not find reader ${changeReaderPwdDto.username} in change password module`,
      );
      return null;
    }
    const match = await bcrypt.compare(
      changeReaderPwdDto.currentPassword,
      reader.password,
    );
    if (!match) {
      this.logger.warn(
        `Wrong current password when changing it for reader ${reader.username}`,
      );
      return null;
    }
    //Encrypt new password and save it into database
    reader.password = await bcrypt.hash(changeReaderPwdDto.newPassword, 10);
    try {
      const newReader = await reader.save();
      this.logger.info(
        `Success changed the password for reader ${newReader.username}`,
      );
      return JSON.stringify(newReader.username);
    } catch (err) {
      this.logger.error(
        `Saving reader ${reader.username} failed when updating password: ${err}`,
      );
      return null;
    }
  }

  //Reader sign in account and get tokens, return accessToken in body and refreshToken in header RequestWithReader
  async login(request) {
    const readerID = request.user._id;
    const accessToken = this.getJwtAccessToken(readerID);
    const refreshToken = this.getCookieJwtRefreshToken(readerID);
    await this.setRefreshToken(refreshToken[1], readerID);
    request.res.setHeader('Set-Cookie', refreshToken[0]);
    //create the log for success activity
    this.logger.info(`Success login for reader ${request.user.username}`);
    return {
      token_info: accessToken,
      expireIn: process.env.ACCESS_TOKEN_TIMER,
    };
  }

  //Get reader account info by user name, also can check if new username is duplicate with existing one
  async findOne(username: string): Promise<Reader | undefined> {
    const reader = await this.readerModel
      .findOne({ username: username })
      .select('+password')
      .exec();
    return reader;
  }

  async getRefreshById(readerID: string): Promise<Reader | undefined> {
    const reader = await this.readerModel
      .findById(readerID)
      .select('+currentRefreshToken')
      .exec();
    if (!reader) {
      this.logger.warn(
        `Could not find the reader ${readerID} when getting refresh token`,
      );
    }
    return reader;
  }

  getJwtAccessToken(readerID: string) {
    const payload = { readerID };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_TIMER,
    });
    //create log for this activity
    this.logger.info(`Success setup access token for reader ${readerID}`);
    return accessToken;
  }

  async setRefreshToken(refresh_token: string, readerID: string) {
    const updateReader = await this.readerModel.findById(readerID);
    if (!updateReader) {
      this.logger.warn(
        `Could not find the reader ${readerID} when saving refresh token`,
      );
      return null;
    }
    const hash_token = await bcrypt.hash(refresh_token, 10);
    updateReader.currentRefreshToken = hash_token;
    try {
      const reader = await updateReader.save();
      this.logger.info(`Success save refreshtoken in database`);
      return reader.username;
    } catch (err) {
      this.logger.error(`Saving refresh token failed for ${readerID}: ${err}`);
      return null;
    }
  }

  public getCookieJwtRefreshToken(readerID: string) {
    const payload = { readerID };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_TIMER,
    });
    const maxAge = +process.env.REFRESH_TOKEN_TIMER.slice(0, -1);
    const cookieRefreshToken = `Refresh=${refreshToken}; HttpOnly; Path=/api; Max-Age=${maxAge}`;
    //create log for this activity
    this.logger.info(`Success setup refresh token for reader ${readerID}`);
    return [cookieRefreshToken, refreshToken];
  }

  async refreshTokenValidate(
    refreshToken: string,
    readerID: string,
  ): Promise<Reader | undefined> {
    const reader = await this.getRefreshById(readerID);
    if (!reader) {
      this.logger.warn(
        `Could not find the reader ${readerID} in refreshtoken validation`,
      );
      return null;
    }
    const match = await bcrypt.compare(
      refreshToken,
      reader.currentRefreshToken,
    );
    if (match) {
      //Create log of this activity
      this.logger.info(
        `Refresh token validation for reader ${readerID} passed`,
      );
      return reader;
    }
    this.logger.warn(
      `Mismatch refresh token, validation for reader ${readerID} failed`,
    );
    return null;
  }

  tokenRefresh(request) {
    const readerID = request.user._id;
    const accessToken = this.getJwtAccessToken(readerID);
    //create log for this activity
    this.logger.info(`Success refresh  accessToken for reader ${readerID}`);
    return {
      token_info: accessToken,
      expireIn: process.env.ACCESS_TOKEN_TIMER,
    };
  }

  async logout(request) {
    const readerID = request.user._id;
    await this.readerModel.updateOne(
      { _id: readerID },
      { currentRefreshToken: null },
    );
    const deleteCookie = 'Refresh=; HttpOnly; path=/api; Max-Age=0';
    request.res.setHeader('Set-Cookie', deleteCookie);
    //create log for this activity
    this.logger.info(`Success logout for reader ${readerID}`);
    return readerID;
  }

  async addFavourBook(readerID: string, favourBookDto: FavourBookDto) {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn(
        `Can not find the reader ${readerID} when adding favourite book`,
      );
      return -1;
    }
    const favouriteBookList = reader.favouriteBook.map((item) => item.bookID);
    if (favouriteBookList.includes(favourBookDto.bookID)) {
      this.logger.warn('The book is already in the favourite list');
      return 0;
    }
    const now = new Date();
    reader.favouriteBook.push({
      bookID: favourBookDto.bookID,
      createDate: now,
    });
    try {
      await reader.save();
      this.logger.info(
        `Successfully adding favourite book for reader ${reader.username}`,
      );
      return reader.favouriteBook.length;
    } catch (err) {
      this.logger.error(`Saving favourite book failed for ${readerID}: ${err}`);
      return -1;
    }
  }

  async getFavourBookList(readerID: string) {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn(
        `Can not find the reader ${readerID} when getting favourite booklist`,
      );
      return null;
    }
    //Create log for this activity
    this.logger.info(`Success get favourite book list for reader ${readerID}`);
    return reader.favouriteBook;
  }

  async delFavourBook(readerID: string, favourBookDto: FavourBookDto) {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn(
        `Can not find the reader ${readerID} when deleting favourite book`,
      );
      return -1;
    }
    for (const record of reader.favouriteBook) {
      if (record.bookID === favourBookDto.bookID) {
        const index = reader.favouriteBook.indexOf(record);
        reader.favouriteBook.splice(index, 1);
        await reader.save();
        //Create log for this activity
        this.logger.info(
          `Success delete favourbook ${favourBookDto.bookID} for reader ${reader.username}`,
        );
        return index;
      }
    }
    this.logger.warn(
      `The book ${favourBookDto.bookID} is not in the favourite list`,
    );
    return -1;
  }

  async getReaderReadHistory(readerID): Promise<ReaderReadHistory[]> {
    const reader = await this.readerModel.findById(readerID);
    if (!reader) {
      this.logger.warn('Can not find the reader when get reader read history');
      return null;
    }
    this.logger.info(`Success get read record for reader ${reader.username}`);
    return reader.readHistory;
  }

  async delReadHistory(readerID) {
    const reader = await this.readerModel.findById(readerID);
    reader.readHistory.splice(0, reader.readHistory.length);
    reader.save();
    return reader._id;
  }
}
