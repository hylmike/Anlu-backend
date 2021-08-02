import { Test, TestingModule } from '@nestjs/testing';
import { Body, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as mongoose from 'mongoose';

import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import {
  Reader,
  ReaderProfile,
  ReaderReadHistory,
} from '../src/reader/reader.interface';
import { readerData, readerStub } from '../src/reader/test/stubs/reader.stub';
import {
  ChangeReaderPwdDto,
  RegisterReaderDto,
  UpdateReaderDto,
} from 'src/reader/reader.dto';

describe('ReaderController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: mongoose.Connection;
  let httpServer: any;
  let registerReaderDto: RegisterReaderDto;
  let readerObject: any;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
    registerReaderDto = {
      username: readerStub().username,
      password: readerStub().password,
      confirmPassword: readerStub().password,
      email: readerStub().email,
      firstName: readerStub().readerProfile.firstName,
      lastName: readerStub().readerProfile.lastName,
      gender: readerStub().readerProfile.gender,
      birthday: readerStub().readerProfile.birthday.toString(),
      phoneNumber: readerStub().readerProfile.phoneNumber,
      homeAddress: readerStub().readerProfile.address.homeAddress,
      province: readerStub().readerProfile.address.province,
      postcode: readerStub().readerProfile.address.postcode,
      securityQuestion: readerStub().readerProfile.securityQuestion,
      securityAnswer: readerStub().readerProfile.securityAnswer,
    };
    readerObject = {
      username: readerStub().username,
      email: readerStub().email,
      isActive: readerStub().isActive,
      favouriteBook: [],
      readerProfile: {
        firstName: readerStub().readerProfile.firstName,
        lastName: readerStub().readerProfile.lastName,
        gender: readerStub().readerProfile.gender,
        phoneNumber: readerStub().readerProfile.phoneNumber,
        address: {
          homeAddress: readerStub().readerProfile.address.homeAddress,
          province: readerStub().readerProfile.address.province,
          postcode: readerStub().readerProfile.address.postcode,
        },
        readTimes: 0,
        readDuration: 0,
        score: 0,
        securityQuestion: readerStub().readerProfile.securityQuestion,
        securityAnswer: readerStub().readerProfile.securityAnswer,
      },
      readHistory: [],
    };
    await dbConnection.collection('readers').deleteMany({});
  });

  describe('/api/reader/register', () => {
    let response: any;

    beforeEach(async () => {
      response = await request(httpServer)
        .post('/api/reader/register')
        .send(registerReaderDto);
    });

    it('it should return new reader object for success registration', async () => {
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(readerObject);
      readerData._id = response.body._id;
    });

    it('it should return null for registering existing reader', async () => {
      expect(response.status).toBe(201);
      expect(response.body).toBeNull;
    });
  });

  describe('/api/reader/:id', () => {
    let response: any;

    it('it should return an reader object', async () => {
      response = await request(httpServer).get(
        `/api/reader/${readerStub()._id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(readerObject);
    });

    it('it should return null for non-existing id', async () => {
      response = await request(httpServer).get(
        `/api/reader/111111111111111111111111`,
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeNull;
    });
  });

  describe('/api/reader/update', () => {
    let response: any;
    const newEmail = 'email@email';
    const newAddress = 'homeAddress';

    beforeEach(async () => {
      const updateReaderDto: UpdateReaderDto = {
        username: readerStub().username,
        email: newEmail,
        firstName: '',
        lastName: '',
        gender: '',
        birthday: '',
        phoneNumber: '',
        homeAddress: newAddress,
        province: '',
        postcode: '',
        securityQuestion: '',
        securityAnswer: '',
      };
      response = await request(httpServer)
        .patch('/api/reader/update')
        .send(updateReaderDto);
    });

    it('it should return an reader id', async () => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual(readerStub()._id);
    });

    it('it should update properties based on inputs', async () => {
      const reader: Reader = await dbConnection
        .collection('readers')
        .findOne({ username: readerStub().username });
      expect(reader.email).toEqual(newEmail);
      expect(reader.readerProfile.address.homeAddress).toEqual(newAddress);
    });
  });

  describe('/api/reader/changepwd', () => {
    let response: any;
    const newPass = 'newpassword';

    it('it should change the password', async () => {
      const changePwdDto1: ChangeReaderPwdDto = {
        username: readerStub().username,
        currentPassword: readerStub().password,
        newPassword: newPass,
        confirmPassword: newPass,
      };
      response = await request(httpServer)
        .patch('/api/reader/changepwd')
        .send(changePwdDto1);
      const reader = await dbConnection
        .collection('readers')
        .findOne({ username: readerStub().username });
      expect(response.status).toBe(200);
      expect(reader.password).not.toEqual(readerStub().password);
    });

    it('it should return username of changed password', async () => {
      const changePwdDto2: ChangeReaderPwdDto = {
        username: readerStub().username,
        currentPassword: newPass,
        newPassword: readerStub().password,
        confirmPassword: readerStub().password,
      };
      response = await request(httpServer)
        .patch('/api/reader/changepwd')
        .send(changePwdDto2);
      expect(response.status).toBe(200);
      console.log(response.body);
      expect(response.body).toEqual(readerStub().username);
    });
  });

  afterAll(async () => {
    await dbConnection.collection('readers').deleteMany({});
    await app.close();
  });
});
