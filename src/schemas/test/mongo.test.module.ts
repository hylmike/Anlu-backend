import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

let mongod: MongoMemoryServer;

export const mongooseTestModule = () =>
  MongooseModule.forRootAsync({
    useFactory: async (options: MongooseModuleOptions = {}) => {
      mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeMongodConnection = async () => {
  if (mongod) {
    //await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};
