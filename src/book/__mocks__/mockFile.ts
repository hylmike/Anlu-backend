import { createReadStream } from 'fs';

export const fileToBuffer = (fileName) => {
  const readStream = createReadStream(fileName);
  const chunks = [];
  return new Promise((resolve, reject) => {
    //Handle any error while file reading
    readStream.on('error', (err) => {
      console.log(`File could be read: ${err}`);
      reject(err);
    });

    //listen and record data
    readStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    //After reading file complete
    readStream.on('close', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};
