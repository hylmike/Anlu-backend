"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileToBuffer = void 0;
const fs_1 = require("fs");
const fileToBuffer = (fileName) => {
    const readStream = fs_1.createReadStream(fileName);
    const chunks = [];
    return new Promise((resolve, reject) => {
        readStream.on('error', (err) => {
            console.log(`File could be read: ${err}`);
            reject(err);
        });
        readStream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        readStream.on('close', () => {
            resolve(Buffer.concat(chunks));
        });
    });
};
exports.fileToBuffer = fileToBuffer;
//# sourceMappingURL=mockFile.js.map