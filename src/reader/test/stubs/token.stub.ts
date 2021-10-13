import { Token } from '../../../reader/reader.interface';

//token: 145287706c2754d49b1093f2082d472d
const tokenData: Token = {
  _id: '6165883ae348be277a3f1183',
  readerName: 'michael',
  email: 'michael@yahoo.com',
  token: '$2b$10$.OjCQDd5NgS1TgRm2zJ5Rue.V5.hhJ/wUP1trwEzvf0m7MOPJ2KkS',
  createTime: new Date('2021-09-12'),
};

export const tokenData1 = {
  readerName: 'michael',
  token: '145287706c2754d49b1093f2082d472d',
};

export const tokenStub = () => {
  return tokenData1;
};

export const tokenDataStub = () => {
  return tokenData;
};
