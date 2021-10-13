"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailerService = void 0;
const token_stub_1 = require("../../reader/test/stubs/token.stub");
exports.EmailerService = jest.fn().mockReturnValue({
    sendResetEmail: jest.fn().mockReturnValue(token_stub_1.tokenStub().token),
});
//# sourceMappingURL=emailer.service.js.map