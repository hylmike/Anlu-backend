"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRequest = exports.mockedJwtService = void 0;
const reader_stub_1 = require("../test/stubs/reader.stub");
exports.mockedJwtService = {
    sign: jest.fn().mockImplementation(() => {
        return reader_stub_1.accessTokenStub().token_info;
    }),
};
exports.mockRequest = {
    user: reader_stub_1.readerStub(),
    res: { setHeader: jest.fn() },
};
//# sourceMappingURL=mock.service.js.map