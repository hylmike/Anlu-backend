import { libStub } from '../../librarian/test/stubs/lib.stub';
import { readerStub } from '../../reader/test/stubs/reader.stub';

export const mockReaderService = {
  findOne: jest.fn().mockResolvedValue(readerStub()),
};

export const mockLibrarianService = {
  findOne: jest.fn().mockResolvedValue(libStub()),
};
