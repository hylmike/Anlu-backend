import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import {
  Librarian,
  LibDocument,
  OperationLog,
  OptLogDocument,
} from './librarian.interface';
import {
  RegisterLibDto,
  UpdateLibProfileDto,
  ChangeLibPwdDto,
  OperationLogDto,
} from './lib.dto';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';

@Injectable()
export class LibrarianService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Librarian') private libModel: Model<LibDocument>,
    @InjectModel('OperationLog') private optLogModel: Model<OptLogDocument>,
    private readonly jwtService: JwtService,
  ) { }

  //Register new librarian/admin into database
  async register(registerLibDto: RegisterLibDto) {
    const username = registerLibDto.username.trim();
    const role =
      registerLibDto.role.toLowerCase() === 'admin' ? 'admin' : 'librarian';
    if (username === '') {
      this.logger.warn('Username or form is empty, register failed');
      return null;
    } else if (await this.findOne(username)) {
      this.logger.warn(
        `The username ${username} exists, ${role} register failed`,
      );
      return null;
    } else if (registerLibDto.password !== registerLibDto.confirmPassword) {
      this.logger.warn(
        `Passwords mismatched, register ${role} ${username} failed`,
      );
      return null;
    }
    //encrypt password before saving into database
    const hash = await bcrypt.hash(registerLibDto.confirmPassword, 10);
    const newLib = new this.libModel({
      username: registerLibDto.username,
      password: hash,
      email: registerLibDto.email,
      role: registerLibDto.role,
      firstName: registerLibDto.firstName,
      lastName: registerLibDto.lastName,
      phoneNumber: registerLibDto.phoneNumber,
      registerDate: new Date(),
    });
    try {
      const lib = await newLib.save();
      //create the log for this activity
      this.logger.info(`Success register ${lib.role} ${lib.username}`);
      return lib;
    } catch (err) {
      this.logger.error(
        `Saving new ${role} ${newLib.username} into database failed: ${err}`,
      );
      return null;
    }
  }

  //Get librarian/admin profile from database
  async getProfile(libID): Promise<Librarian | undefined> {
    const lib = await this.libModel.findById(libID);
    if (!lib) {
      this.logger.warn(`Librarian ${libID} does not exist, get profile failed`);
      return null;
    }
    //create log for this activity
    this.logger.info(`Success get ${lib.role} ${lib.username} profile`);
    return lib;
  }

  //Update librarian/admin profile based on inputs and save into database
  async updateProfile(updateLibDto: UpdateLibProfileDto) {
    const lib = await this.libModel.findOne({
      username: updateLibDto.username,
    });
    if (!lib) {
      this.logger.warn(
        `Can not find the librarian ${updateLibDto.username} in updateProfile module`,
      );
      return null;
    }
    for (const item in updateLibDto) {
      if (item !== 'username' && updateLibDto[item] !== '') {
        if (item === 'isActive') {
          lib[item] = updateLibDto[item].toLowerCase() === 'true' ? true : false;
        } else {
          lib[item] = updateLibDto[item];
        }
      }
    }
    try {
      const updatedLib = await lib.save();
      //Create log for this activity
      this.logger.info(
        `Successful update profile of ${lib.role} ${lib.username}`,
      );
      return updatedLib._id;
    } catch (err) {
      this.logger.error(
        `Saving updated ${lib.role} ${lib.username} into database failed: ${err}`,
      );
      return null;
    }
  }

  //Change password of reader account
  async changePwd(changeLibPwdDto: ChangeLibPwdDto) {
    const lib = await this.libModel
      .findOne({ username: changeLibPwdDto.username })
      .select('+password')
      .exec();
    if (!lib) {
      this.logger.warn(
        `Can not find librarian ${changeLibPwdDto.username} in change password module`,
      );
      return null;
    }
    const match = await bcrypt.compare(
      changeLibPwdDto.currentPassword,
      lib.password,
    );
    if (!match) {
      this.logger.warn(
        `Wrong current password when changing it for ${lib.role} ${lib.username}`,
      );
      return null;
    }
    //Encrypt new password and save it into database
    lib.password = await bcrypt.hash(changeLibPwdDto.newPassword, 10);
    try {
      const newLib = await lib.save();
      //Create log for this activity
      this.logger.info(
        `Success changed the password for ${newLib.role} ${newLib.username}`,
      );
      return newLib.username;
    } catch (err) {
      this.logger.error(
        `Saving ${lib.role} ${lib.username} failed when updating password: ${err}`,
      );
      return null;
    }
  }

  //Librarian/Admin sign in account and get tokens, return accessToken in body and refreshToken in header
  async login(request, requiredRole: string) {
    const libID = request.user._id;
    const role = request.user.role;
    if (role.toLowerCase() !== requiredRole) {
      this.logger.warn(`User does not have ${requiredRole} role, login failed`);
      return null;
    }
    const accessToken = this.getJwtAccessToken(libID);
    const refreshToken = this.getCookieJwtRefreshToken(libID);
    await this.setRefreshToken(refreshToken[1], libID);
    request.res.setHeader('Set-Cookie', refreshToken[0]);
    //Create log for this activity
    this.logger.info(`Success login for ${role} ${request.user.username}.`);
    return {
      token_info: accessToken,
      expireIn: process.env.ACCESS_TOKEN_TIMER,
      role: role,
    };
  }

  //Get reader account info by user name, also can check if new username is duplicate with existing one
  async findOne(username: string): Promise<Librarian | undefined> {
    const lib = await this.libModel
      .findOne({ username: username })
      .select('+password')
      .exec();
    return lib;
  }

  async getRefreshById(libID: string): Promise<Librarian | undefined> {
    const lib = await this.libModel
      .findById(libID)
      .select('+currentRefreshToken')
      .exec();
    if (!lib) {
      this.logger.warn(
        `Could not find the librarian ${libID} when getting refresh token`,
      );
    }
    return lib;
  }

  getJwtAccessToken(libID: string) {
    const payload = { libID };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_TIMER,
    });
    //Create log for this activity
    this.logger.info(`Success setup access token for librarian ${libID}`);
    return accessToken;
  }

  async setRefreshToken(refresh_token: string, libID: string) {
    const updateLib = await this.libModel.findById(libID);
    if (!updateLib) {
      this.logger.warn(
        `Could not find the librarian ${libID} when saving refresh token`,
      );
      return null;
    }
    const hash_token = await bcrypt.hash(refresh_token, 10);
    updateLib.currentRefreshToken = hash_token;
    try {
      const lib = await updateLib.save();
      //Create log for this activity
      this.logger.info(`Success save refreshtoken in database`);
      return lib.username;
    } catch (err) {
      this.logger.error(
        `Saving refresh token failed for ${updateLib.role} ${libID}: ${err}`,
      );
      return null;
    }
  }

  public getCookieJwtRefreshToken(libID: string) {
    const payload = { libID };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_TIMER,
    });
    const maxAge = +process.env.REFRESH_TOKEN_TIMER.slice(0, -1);
    const cookieRefreshToken = `Refresh=${refreshToken}; HttpOnly; Path=/api; Max-Age=${maxAge}`;
    //Create log for this activity
    this.logger.info(`Success setup refresh token for ${libID}.`);
    return [cookieRefreshToken, refreshToken];
  }

  async refreshTokenValidate(refreshToken: string, libID: string) {
    const lib = await this.getRefreshById(libID);
    if (!lib) {
      console.log(
        `Can not find librarian with ${libID} in refreshtoken validation`,
      );
      return null;
    }
    const match = await bcrypt.compare(refreshToken, lib.currentRefreshToken);
    if (match) {
      //Create log of this activity
      this.logger.info(
        `Refresh token validation for ${lib.role} ${lib.username}passeded`,
      );
      return lib;
    }
    this.logger.warn(
      `Mismatch refresh token, validation for ${lib.role} ${lib.username} failed`,
    );
    return null;
  }

  tokenRefresh(request) {
    const libID = request.user._id;
    const role = request.user.role;
    const accessToken = this.getJwtAccessToken(libID);
    //create log for this activity
    this.logger.info(`Success refresh  accessToken for ${role} ${libID}`);
    return {
      token_info: accessToken,
      expireIn: process.env.ACCESS_TOKEN_TIMER,
      role: role,
    };
  }

  async logout(request) {
    const libID = request.user._id;
    const role = request.user.role;
    await this.libModel.updateOne(
      { _id: libID },
      { currentRefreshToken: null },
    );
    const deleteCookie = 'Refresh=; HttpOnly; path=/api; Max-Age=0';
    request.res.setHeader('Set-Cookie', deleteCookie);
    //create log for this activity
    this.logger.info(`Success logout for ${role} ${libID}`);
    return libID;
  }

  async addOperationLog(optLogDto: OperationLogDto) {
    if (optLogDto.operation.trim() === '') {
      //Create log if empty operation content
      this.logger.warn(
        `No operation content, did not create any oepration log`,
      );
      return null;
    } else if (
      await this.optLogModel.findOne({
        time: new Date(optLogDto.time),
        operation: optLogDto.operation,
      })
    ) {
      this.logger.warn(`Log already exists, did not create anything`);
      return null;
    }
    let newOptLog = new this.optLogModel({
      operator: optLogDto.operator,
      time: new Date(optLogDto.time),
      operation: optLogDto.operation,
      details: optLogDto.details,
    });
    try {
      newOptLog = await newOptLog.save();
      //Create log for this success activity
      this.logger.info(`Success add operation log ${newOptLog._id}`);
      return newOptLog;
    } catch (err) {
      this.logger.error(`Saving operation log failed: ${err}`);
      return null;
    }
  }

  async getOperationLog(libID: string): Promise<OperationLog[] | undefined> {
    const optLog = await this.optLogModel.find({ operator: libID }).exec();
    //Create log for this success activity
    this.logger.info(`Success get operation log for ${libID}`);
    return optLog;
  }

  async checkAdmin(libID): Promise<boolean> {
    const lib = await this.libModel.findById(libID);
    if (lib && lib.role.toLowerCase() == 'admin') {
      this.logger.info(`ChecnAdmin success`);
      return true;
    } else if (!lib) {
      this.logger.warn(`Can't find ${libID} in database, checnAdmin failed`);
      return null;
    }
    this.logger.info(`ChecnAdmin success`);
    return false;
  }
}
