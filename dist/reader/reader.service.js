"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const nest_winston_1 = require("nest-winston");
const jwt_1 = require("@nestjs/jwt");
require("dotenv/config");
let ReaderService = class ReaderService {
    constructor(logger, readerModel, readerProfileModel, readerReadHistoryModel, bookModel, jwtService) {
        this.logger = logger;
        this.readerModel = readerModel;
        this.readerProfileModel = readerProfileModel;
        this.readerReadHistoryModel = readerReadHistoryModel;
        this.bookModel = bookModel;
        this.jwtService = jwtService;
    }
    async register(registerReaderDto) {
        const username = registerReaderDto.username.trim();
        const reader = await this.readerModel.findOne({ username: username });
        if (username === '') {
            this.logger.warn(`Username or form is empty, register failed`);
            return null;
        }
        else if (reader) {
            this.logger.warn(`The reader ${username} exists, reader register failed`);
            return null;
        }
        else if (registerReaderDto.password !== registerReaderDto.confirmPassword) {
            this.logger.warn(`Passwords mismatched, register ${username} failed`);
            return null;
        }
        const hash = await bcrypt.hash(registerReaderDto.confirmPassword, 10);
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
            this.logger.info(`Success registered reader ${reader.username}`);
            return reader;
        }
        catch (err) {
            this.logger.error(`Saving new reader ${newReader.username} into database failed: ${err}`);
            return null;
        }
    }
    async getProfile(readerID) {
        const reader = await this.readerModel.findById(readerID).exec();
        if (reader) {
            this.logger.info(`Success get reader ${readerID} profile`);
            return reader;
        }
        this.logger.warn(`Reader ${readerID} does not exist, get profile failed`);
        return null;
    }
    async getAllReader() {
        const readerList = await this.readerModel
            .find({})
            .sort({ username: 1 })
            .exec();
        if (readerList) {
            return readerList;
        }
    }
    async getTopN(num) {
        const topN = await this.readerModel
            .find({ isActive: true })
            .sort({ 'readerProfile.score': -1 })
            .limit(Number(num))
            .exec();
        if (topN) {
            this.logger.info('Success get reader topN result from database');
            return topN;
        }
        else {
            this.logger.warn('Failed to get reader topN result from database');
        }
    }
    async updateProfile(updateReaderDto) {
        const reader = await this.readerModel
            .findOne({ username: updateReaderDto.username })
            .exec();
        if (!reader) {
            this.logger.warn(`Can not find reader ${updateReaderDto.username} in updateProfile module`);
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
                    }
                    else if (updateReaderDto[item] !== '') {
                        readerProfile[item] = updateReaderDto[item];
                    }
            }
        }
        try {
            const updatedReader = await reader.save();
            this.logger.info(`Success updated profile of reader ${updatedReader.username}`);
            return updatedReader._id;
        }
        catch (err) {
            this.logger.error(`Saving updated reader ${reader.username} into database failed: ${err}`);
            return null;
        }
    }
    async changePwd(changePwdDto) {
        const reader = await this.readerModel
            .findOne({ username: changePwdDto.username })
            .select('+password')
            .exec();
        if (!reader) {
            this.logger.warn(`Can not find reader ${changePwdDto.username} in change password module`);
            return null;
        }
        const match = await bcrypt.compare(changePwdDto.currentPassword, reader.password);
        if (!match) {
            this.logger.warn(`Wrong current password when changing it for reader ${reader.username}`);
            return null;
        }
        reader.password = await bcrypt.hash(changePwdDto.newPassword, 10);
        try {
            const newReader = await reader.save();
            this.logger.info(`Success changed the password for reader ${newReader.username}`);
            return JSON.stringify(newReader.username);
        }
        catch (err) {
            this.logger.error(`Saving reader ${reader.username} failed when updating password: ${err}`);
            return null;
        }
    }
    async deaReader(readerID) {
        let reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn(`Failed to get reader ${readerID} from database`);
            return null;
        }
        if (reader.isActive === false) {
            this.logger.info(`The reader ${readerID} status is already inactive`);
        }
        else {
            reader.isActive = false;
            reader = await reader.save();
            if (reader && reader.username) {
                this.logger.info(`Success deactivated reader {readerID}`);
            }
            else {
                this.logger.warn(`Failed to save reader ${readerID} during active status update`);
                return null;
            }
        }
        return reader.isActive;
    }
    async actReader(readerID) {
        let reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn(`Failed to get reader ${readerID} from database`);
            return null;
        }
        if (reader.isActive === true) {
            this.logger.info(`The reader ${readerID} status is already active`);
        }
        else {
            reader.isActive = true;
            reader = await reader.save();
            if (reader && reader.username) {
                this.logger.info(`Success activated reader {readerID}`);
            }
            else {
                this.logger.warn(`Failed to save reader ${readerID} during active status update`);
                return null;
            }
        }
        return reader.isActive;
    }
    async login(request) {
        const readerID = request.user._id;
        const accessToken = this.getJwtAccessToken(readerID);
        const refreshToken = this.getCookieJwtRefreshToken(readerID);
        await this.setRefreshToken(refreshToken[1], readerID);
        request.res.setHeader('Set-Cookie', refreshToken[0]);
        this.logger.info(`Success login for reader ${request.user.username}`);
        return {
            token_info: accessToken,
            expireIn: process.env.ACCESS_TOKEN_TIMER,
        };
    }
    async findOne(username) {
        const reader = await this.readerModel
            .findOne({ username: username })
            .select('+password')
            .exec();
        return reader;
    }
    async getRefreshById(readerID) {
        const reader = await this.readerModel
            .findById(readerID)
            .select('+currentRefreshToken')
            .exec();
        if (!reader) {
            this.logger.warn(`Could not find the reader ${readerID} when getting refresh token`);
        }
        return reader;
    }
    getJwtAccessToken(readerID) {
        const payload = { readerID };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_TIMER,
        });
        this.logger.info(`Success setup access token for reader ${readerID}`);
        return accessToken;
    }
    async setRefreshToken(refresh_token, readerID) {
        const updateReader = await this.readerModel.findById(readerID);
        if (!updateReader) {
            this.logger.warn(`Could not find the reader ${readerID} when saving refresh token`);
            return null;
        }
        const hash_token = await bcrypt.hash(refresh_token, 10);
        updateReader.currentRefreshToken = hash_token;
        try {
            const reader = await updateReader.save();
            this.logger.info(`Success save refreshtoken in database`);
            return reader.username;
        }
        catch (err) {
            this.logger.error(`Saving refresh token failed for ${readerID}: ${err}`);
            return null;
        }
    }
    getCookieJwtRefreshToken(readerID) {
        const payload = { readerID };
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: process.env.REFRESH_TOKEN_TIMER,
        });
        const maxAge = +process.env.REFRESH_TOKEN_TIMER.slice(0, -1);
        const cookieRefreshToken = `Refresh=${refreshToken}; HttpOnly; Path=/api/reader/refresh; Max-Age=${maxAge}`;
        this.logger.info(`Success setup refresh token for reader ${readerID}`);
        return [cookieRefreshToken, refreshToken];
    }
    async refreshTokenValidate(refreshToken, readerID) {
        const reader = await this.getRefreshById(readerID);
        if (!reader) {
            this.logger.warn(`Could not find the reader ${readerID} in refreshtoken validation`);
            return null;
        }
        const match = await bcrypt.compare(refreshToken, reader.currentRefreshToken);
        if (match) {
            this.logger.info(`Refresh token validation for reader ${readerID} passed`);
            return reader;
        }
        this.logger.warn(`Mismatch refresh token, validation for reader ${readerID} failed`);
        return null;
    }
    tokenRefresh(request) {
        const readerID = request.user._id;
        const accessToken = this.getJwtAccessToken(readerID);
        this.logger.info(`Success refresh  accessToken for reader ${readerID}`);
        return {
            token_info: accessToken,
            expireIn: process.env.ACCESS_TOKEN_TIMER,
        };
    }
    async logout(request) {
        const readerID = request.user._id;
        await this.readerModel.updateOne({ _id: readerID }, { currentRefreshToken: null });
        const deleteCookie = 'Refresh=; HttpOnly; path=/api; Max-Age=0';
        request.res.setHeader('Set-Cookie', deleteCookie);
        this.logger.info(`Success logout for reader ${readerID}`);
        return readerID;
    }
    async delReader(readerID) {
        const reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn(`Failed to find reader ${readerID}`);
            return null;
        }
        await this.readerProfileModel.findByIdAndDelete(reader.readerProfile._id);
        for (const item of reader.readHistory) {
            await this.readerReadHistoryModel.findByIdAndDelete(item._id);
        }
        const delReader = await this.readerModel.findByIdAndDelete(readerID);
        if (delReader) {
            this.logger.info(`Success delete reader ${readerID}`);
            return JSON.stringify(delReader._id);
        }
        else {
            this.logger.warn(`Failed to delete reader ${readerID}`);
        }
    }
    async addFavourBook(readerID, favourBookDto) {
        const reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn(`Can not find the reader ${readerID} when adding favourite book`);
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
            this.logger.info(`Successfully adding favourite book for reader ${reader.username}`);
            return reader.favouriteBook.length;
        }
        catch (err) {
            this.logger.error(`Saving favourite book failed for ${readerID}: ${err}`);
            return -1;
        }
    }
    async getFavourBookList(readerID) {
        const reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn(`Can not find the reader ${readerID} when getting favourite booklist`);
            return null;
        }
        else {
            const favorBookList = [];
            for (const item of reader.favouriteBook) {
                const book = await this.bookModel.findById(item.bookID);
                if (book)
                    favorBookList.push(book);
            }
            this.logger.info(`Success get favourite book list for reader ${readerID}`);
            return favorBookList;
        }
    }
    async delFavourBook(readerID, favourBookDto) {
        const reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn(`Can not find the reader ${readerID} when deleting favourite book`);
            return -1;
        }
        for (const record of reader.favouriteBook) {
            if (record.bookID == favourBookDto.bookID) {
                const index = reader.favouriteBook.indexOf(record);
                reader.favouriteBook.splice(index, 1);
                await reader.save();
                this.logger.info(`Success delete favourbook ${favourBookDto.bookID} for reader ${reader.username}`);
                return index;
            }
        }
        this.logger.warn(`The book ${favourBookDto.bookID} is not in the favourite list`);
        return -1;
    }
    async getReadBooks(readerID) {
        const reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn('Can not find the reader when get reader read history');
            return null;
        }
        else {
            const readBookList = [];
            for (const item of reader.readHistory) {
                const book = await this.bookModel.findById(item.bookID);
                if (book)
                    readBookList.push(book);
            }
            this.logger.info(`Success get read booklist for reader ${reader.username}`);
            return readBookList;
        }
    }
    async getReadHistory(readerID) {
        const reader = await this.readerModel.findById(readerID);
        if (!reader) {
            this.logger.warn('Can not find the reader when get reader read history');
            return null;
        }
        this.logger.info(`Success get reader ${readerID} read history`);
        return reader.readHistory;
    }
    async delReadHistory(readerID) {
        const reader = await this.readerModel.findById(readerID);
        reader.readHistory.splice(0, reader.readHistory.length);
        reader.save();
        return reader._id;
    }
};
ReaderService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, mongoose_2.InjectModel('Reader')),
    __param(2, mongoose_2.InjectModel('ReaderProfile')),
    __param(3, mongoose_2.InjectModel('ReaderReadHistory')),
    __param(4, mongoose_2.InjectModel('Book')),
    __metadata("design:paramtypes", [Object, mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService])
], ReaderService);
exports.ReaderService = ReaderService;
//# sourceMappingURL=reader.service.js.map