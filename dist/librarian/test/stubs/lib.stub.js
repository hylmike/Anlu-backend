"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optLogStub = exports.logData = exports.refreshTokenStub = exports.accessTokenStub = exports.libStub = exports.libData = void 0;
require("dotenv/config");
exports.libData = {
    _id: '60e914e8b5dafaf6baa0d8b7',
    username: 'michael',
    password: 'leahcim54321',
    email: 'michael@yahoo.com',
    role: 'Admin',
    firstName: 'Michael',
    lastName: 'Wilson',
    phoneNumber: '4161111111',
    registerDate: new Date('2021-07-10T03:32:56.943Z'),
    currentRefreshToken: '$2b$10$OrMTVL8RH7H6AbeGv1DZHuNsyNcMLJ1EZ9DifP5zV4tCoHEgHpmY6',
    isActive: true,
};
const libStub = () => {
    return exports.libData;
};
exports.libStub = libStub;
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
exports.logData = {
    _id: '60x7x748b5dafaf6baa0dccc',
    operator: '60e914e8b5dafaf6baa0d8b7',
    time: new Date('2021-07-12T03:32:56.943Z'),
    operation: 'register new book',
    details: 'register new book - this is my story',
};
const optLogStub = () => {
    return exports.logData;
};
exports.optLogStub = optLogStub;
//# sourceMappingURL=lib.stub.js.map