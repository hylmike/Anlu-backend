export const logger = {
  format: {
    printf: jest.fn(),
    timestamp: jest.fn(),
    simple: jest.fn(),
    colorize: jest.fn(),
    combine: jest.fn(),
    ms: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  add: jest.fn(),
  createLogger: jest.fn().mockImplementation(function (creationOpts) {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  }),
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn((data) => console.log(data)),
};
