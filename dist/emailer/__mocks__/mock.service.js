"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockMailService = void 0;
exports.MockMailService = {
    sendMail: jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
            const message = 'Success';
            process.nextTick(() => {
                message ? resolve(message) : reject({ error: 'Error' });
            });
        });
    }),
};
//# sourceMappingURL=mock.service.js.map