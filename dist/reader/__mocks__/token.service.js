"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockTokenService = void 0;
const token_stub_1 = require("../test/stubs/token.stub");
exports.MockTokenService = jest.fn().mockReturnValue({
    createToken: jest.fn().mockResolvedValue(token_stub_1.tokenStub()),
    verifyToken: jest.fn().mockResolvedValue(true),
    delToken: jest.fn().mockResolvedValue(token_stub_1.tokenStub().readerName),
    resetPwd: jest.fn().mockResolvedValue(token_stub_1.tokenStub().readerName),
    verifyEmail: jest.fn().mockResolvedValue(token_stub_1.tokenStub().readerName),
});
//# sourceMappingURL=token.service.js.map