export const MockMailService = {
  sendMail: jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      const message = 'Success';
      process.nextTick(() => {
        message ? resolve(message) : reject({ error: 'Error' });
      });
    });
  }),
};
