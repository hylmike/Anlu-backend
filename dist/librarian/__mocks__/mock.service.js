"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRequest = exports.mockedJwtService = void 0;
const lib_stub_1 = require("../test/stubs/lib.stub");
exports.mockedJwtService = {
    sign: jest.fn().mockImplementation(() => {
        return lib_stub_1.accessTokenStub().token_info;
    }),
};
exports.mockRequest = {
    user: lib_stub_1.libStub(),
    res: { setHeader: jest.fn() },
};
//# sourceMappingURL=mock.service.js.map