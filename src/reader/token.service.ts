import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ReaderDocument, TokenDocument } from './reader.interface';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ResetPwdDto } from './reader.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private readonly tokenModel: Model<TokenDocument>,
    @InjectModel('Reader') private readonly readerModel: Model<ReaderDocument>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async createToken(email: string) {
    const token = crypto.randomBytes(16).toString('hex');
    const hash = await bcrypt.hash(token, 10);
    const reader = await this.readerModel.findOne({ email });
    let tokenDoc = await this.tokenModel.findOne({
      readerName: reader.username,
    });
    if (tokenDoc) {
      tokenDoc.token = hash;
      tokenDoc.createTime = new Date();
    } else {
      tokenDoc = new this.tokenModel({
        readerName: reader.username,
        email: email,
        token: hash,
        createTime: new Date(),
      });
    }
    try {
      tokenDoc = await tokenDoc.save();
      this.logger.info(
        `Success create password reset token for reader ${tokenDoc.readerName}`,
      );
      return { readerName: tokenDoc.readerName, token: token };
    } catch (err) {
      this.logger.error(`Failed to save reset token into database: ${err}`);
      return null;
    }
  }

  async verifyToken(readerName, tokenInfo) {
    const tokenDoc = await this.tokenModel.findOne({ readerName });
    if (!tokenDoc) {
      this.logger.warn(`Can't find token for reader ${readerName}`);
      return false;
    }
    const result = await bcrypt.compare(tokenInfo, tokenDoc.token);
    const now = new Date();
    const period = (now.getTime() - tokenDoc.createTime.getTime()) / 1000;
    if (result) {
      if (period <= Number(process.env.RESET_TOKEN_VALID_TIME)) {
        return true;
      } else {
        this.delToken(readerName);
        return false;
      }
    } else {
      return false;
    }
  }

  async delToken(readerName: string) {
    const tokenDoc = await this.tokenModel.findOneAndDelete({ readerName });
    return tokenDoc.readerName;
  }

  async resetPwd(resetDto: ResetPwdDto) {
    const verResult = this.verifyToken(resetDto.username, resetDto.token);
    if (!verResult) {
      this.logger.warn(`Wrong password reset token or token expired`);
      return null;
    }
    const reader = await this.readerModel.findOne({
      username: resetDto.username,
    });
    const hash = await bcrypt.hash(resetDto.newPassword, 10);
    reader.password = hash;
    try {
      await reader.save();
      this.logger.info(`Success reset password for reader ${reader.username}`);
      this.delToken(reader.username);
      return JSON.stringify(reader.username);
    } catch (err) {
      this.logger.error(`Failed to save reader during password reset: ${err}`);
    }
  }

  async verifyEmail(email: string) {
    const reader = await this.readerModel.findOne({ email });
    if (reader && reader.username) {
      this.logger.info(`Success validate email for uesr ${reader.username}`);
      return JSON.stringify(reader.username);
    } else {
      this.logger.warn(`Email validation failed for ${email}`);
      return null;
    }
  }
}
