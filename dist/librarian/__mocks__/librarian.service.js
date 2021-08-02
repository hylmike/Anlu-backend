"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrarianService = void 0;
const lib_stub_1 = require("../test/stubs/lib.stub");
exports.LibrarianService = jest.fn().mockReturnValue({
    register: jest.fn().mockResolvedValue(lib_stub_1.libStub()),
    getProfile: jest.fn().mockResolvedValue(lib_stub_1.libStub()),
    updateProfile: jest.fn().mockResolvedValue(lib_stub_1.libStub()._id),
    changePwd: jest.fn().mockResolvedValue(lib_stub_1.libStub().username),
    login: jest.fn().mockResolvedValue(lib_stub_1.accessTokenStub()),
    tokenRefresh: jest.fn().mockReturnValue(lib_stub_1.accessTokenStub()),
    logout: jest.fn().mockResolvedValue(lib_stub_1.libStub()._id),
    addOperationLog: jest.fn().mockResolvedValue(lib_stub_1.optLogStub()),
    getOperationLog: jest.fn().mockResolvedValue([lib_stub_1.optLogStub()]),
    checkAdmin: jest.fn().mockResolvedValue(true),
});
//# sourceMappingURL=librarian.service.js.map