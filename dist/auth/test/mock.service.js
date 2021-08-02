"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockLibrarianService = exports.mockReaderService = void 0;
const lib_stub_1 = require("../../librarian/test/stubs/lib.stub");
const reader_stub_1 = require("../../reader/test/stubs/reader.stub");
exports.mockReaderService = {
    findOne: jest.fn().mockResolvedValue(reader_stub_1.readerStub()),
};
exports.mockLibrarianService = {
    findOne: jest.fn().mockResolvedValue(lib_stub_1.libStub()),
};
//# sourceMappingURL=mock.service.js.map