"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTokenService = exports.mockRequest = exports.mockedJwtService = void 0;
const reader_stub_1 = require("../test/stubs/reader.stub");
const token_stub_1 = require("../test/stubs/token.stub");
exports.mockedJwtService = {
    sign: jest.fn().mockImplementation(() => {
        return reader_stub_1.accessTokenStub().token_info;
    }),
};
exports.mockRequest = {
    user: reader_stub_1.readerStub(),
    res: { setHeader: jest.fn() },
};
exports.MockTokenService = {
    resetPwd: jest.fn().mockImplementation(() => {
        return token_stub_1.tokenStub().readerName;
    }),
    verifyEmail: jest.fn().mockImplementation(() => {
        return token_stub_1.tokenStub().readerName;
    }),
};
//# sourceMappingURL=mock.service.js.map