"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenStub = exports.accessTokenStub = exports.readerStub = exports.readerData = void 0;
require("dotenv/config");
const readerProData = {
    _id: '60e914e8b5dafaf6b7b0d8b6',
    firstName: 'Michael',
    lastName: 'Wilson',
    gender: 'male',
    birthday: new Date('2000-07-10T03:32:56.943Z'),
    phoneNumber: '4161111111',
    address: {
        homeAddress: '1 Ave, Markam',
        province: 'ON',
        postcode: 'L6C 0K0',
    },
    readTimes: 0,
    readDuration: 0,
    score: 0,
    securityQuestion: '12345',
    securityAnswer: '12345',
};
const readerHisData = {
    _id: '60e9c285b318a3061ff6b29c',
    bookID: '60e90c226c00f7f43273e3ce',
    currentPage: 20,
    startTime: new Date('2021-07-10T15:53:41.584Z'),
    lastReadTime: new Date('2021-07-10T15:53:41.584Z'),
    readTimes: 1,
    readDuration: 600,
};
exports.readerData = {
    _id: '60e914e8b5dafaf6b7b0d8b7',
    username: 'michael',
    password: 'leahcim54321',
    email: 'michael@yahoo.com',
    isActive: true,
    registerDate: new Date('2021-07-10T03:32:56.943Z'),
    currentRefreshToken: '$2b$10$OrMTVL8RH7H6AbeGv1DZHuNsyNcMLJ1EZ9DifP5zV4tCoHEgHpmY6',
    favouriteBook: [
        {
            bookID: '60e914e5yhgjfaf6b7b0d8b7',
            createDate: new Date('2021-07-10T03:32:56.943Z'),
        },
    ],
    readerProfile: readerProData,
    readHistory: [readerHisData],
};
const readerStub = () => {
    return exports.readerData;
};
exports.readerStub = readerStub;
const accessTokenStub = () => {
    return {
        token_info: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWFkZXJJRCI6IjYwZTkxNGU4YjVkYWZhZjZiN2IwZDhiNyIsImlhdCI6MTYyNjI3MzQyOSwiZXhwIjoxNjI2Mjc0MzI5fQ.2guk9EedI86_--Q0N6ixZCJayipV1rk7etceA6InyA8',
        expireIn: process.env.ACCESS_TOKEN_TIMER,
    };
};
exports.accessTokenStub = accessTokenStub;
const refreshTokenStub = () => {
    return {
        refreshToken_Cookie: 'Refresh=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWFkZXJJRCI6IjYwZTkxNGU4YjVkYWZhZjZiN2IwZDhiNyIsImlhdCI6MTYyNjI3MzQyOSwiZXhwIjoxNjI2ODc4MjI5fQ.w8sRYk3f_j89T7pvwA2puAlGax2QJgtudGoEYnzA__Y; HttpOnly; Path=/api; Max-Age=604800',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWFkZXJJRCI6IjYwZTkxNGU4YjVkYWZhZjZiN2IwZDhiNyIsImlhdCI6MTYyNjI3MzQyOSwiZXhwIjoxNjI2ODc4MjI5fQ.w8sRYk3f_j89T7pvwA2puAlGax2QJgtudGoEYnzA__Y',
    };
};
exports.refreshTokenStub = refreshTokenStub;
//# sourceMappingURL=reader.stub.js.map