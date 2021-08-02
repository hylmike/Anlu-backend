"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMongodConnection = exports.mongooseTestModule = void 0;
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose = require("mongoose");
const mongoose_1 = require("@nestjs/mongoose");
let mongod;
const mongooseTestModule = () => mongoose_1.MongooseModule.forRootAsync({
    useFactory: async (options = {}) => {
        mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongod.getUri();
        return Object.assign({ uri: mongoUri }, options);
    },
});
exports.mongooseTestModule = mongooseTestModule;
const closeMongodConnection = async () => {
    if (mongod) {
        await mongoose.connection.close();
        await mongod.stop();
    }
};
exports.closeMongodConnection = closeMongodConnection;
//# sourceMappingURL=mongo.test.module.js.map