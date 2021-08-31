import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import {
  Workshop,
  Subscriber,
  WorkshopDocument,
  SubscriberDocument,
} from './workshop.interface';
import {
  RegisterWorkshopDto,
  SubWorkshopDto,
  UnsubWorkshopDto,
  UpdateWorkshopDto,
} from './workshop.dto';
import { ReaderDocument } from '../reader/reader.interface';

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Workshop') private workshopModel: Model<WorkshopDocument>,
    @InjectModel('Subscriber') private subModel: Model<SubscriberDocument>,
    @InjectModel('Reader') private readerModel: Model<ReaderDocument>,
  ) { }

  async register(regWorkshopDto: RegisterWorkshopDto): Promise<Workshop> {
    let workshop = await this.workshopModel.findOne({
      topic: regWorkshopDto.topic,
    });
    if (workshop) {
      this.logger.warn(
        `Duplicated workshop with topic ${regWorkshopDto.topic}, register failed`,
      );
      return null;
    }
    const now = new Date();
    workshop = new this.workshopModel({
      topic: regWorkshopDto.topic,
      place: regWorkshopDto.place,
      organizer: regWorkshopDto.organizer,
      startTime: new Date(regWorkshopDto.startTime),
      duration: regWorkshopDto.duration == '' ? 0 : Number(regWorkshopDto.duration),
      poster: regWorkshopDto.poster,
      creator: regWorkshopDto.creator,
      createTime: now,
      remark: regWorkshopDto.remark,
    });
    try {
      const newWorkshop = await workshop.save();
      //Create log for this actitity
      this.logger.info(`Success create workshop ${newWorkshop.topic}`);
      return newWorkshop;
    } catch (err) {
      this.logger.error(
        `Saving new workshop ${workshop.topic} into database failed: ${err}`,
      );
      return null;
    }
  }

  async getWorkshop(workshopID): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(workshopID);
    if (!workshop) {
      this.logger.warn(
        `Workshop ${workshopID} does not exist, get workshop failed`,
      );
      return null;
    }
    //Create log for this actitity
    this.logger.info(`Success get workshop ${workshop.topic}`);
    return workshop;
  }

  async getAllWorkshop(): Promise<Workshop[]> {
    const allWorkshop = await this.workshopModel.find({});
    if (allWorkshop) {
      this.logger.info('Success get all workshop');
      return allWorkshop;
    }
    this.logger.warn('Failed to get all workshop');
    return null;
  }

  async updateWorkshop(
    workshopID: string,
    updateWorkshopDto: UpdateWorkshopDto,
  ): Promise<Workshop> {
    const workshop = await this.workshopModel.findById(workshopID);
    if (!workshop) {
      this.logger.warn(
        `Workshop ${workshopID} does not exist, update workshop failed`,
      );
      return null;
    }
    for (const item in updateWorkshopDto) {
      switch (item) {
        case 'startTime':
          if (updateWorkshopDto[item] !== '')
            workshop[item] = new Date(updateWorkshopDto[item]);
          break;
        case 'duration':
          if (updateWorkshopDto[item] !== '')
            workshop[item] = Number(updateWorkshopDto[item]);
          break;
        default:
          if (updateWorkshopDto[item] !== '')
            workshop[item] = updateWorkshopDto[item];
      }
    }
    try {
      await workshop.save();
      //create log for this activity
      this.logger.info(`Success update workshop ${workshop.topic}`);
      return workshop;
    } catch (err) {
      this.logger.error(
        `Saving updated workshop ${workshop.topic} into database failed: ${err}`,
      );
      return null;
    }
  }

  async delWorkshop(workshopID) {
    const workshop = await this.workshopModel.findByIdAndDelete(workshopID);
    if (workshop) {
      this.logger.info(`Success delete workshop ${workshopID}`);
      return JSON.stringify(workshop._id);
    } else {
      this.logger.warn(`Failed to find and delete workshop ${workshopID}`);
      return null;
    }
  }

  async subWorkshop(subWorkshopDto: SubWorkshopDto): Promise<Subscriber> {
    let sub = await this.subModel.findOne({
      workshop: subWorkshopDto.workshop,
      readerID: subWorkshopDto.readerID,
    });
    if (sub) {
      this.logger.warn(
        `${subWorkshopDto.readerID} already subscribed for ${subWorkshopDto.workshop}`,
      );
      return null;
    }
    //Save new subscribe info into database and update workshop document
    const now = new Date();
    sub = new this.subModel({
      workshop: subWorkshopDto.workshop,
      readerID: subWorkshopDto.readerID,
      SubscribeTime: now,
    });
    const workshop = await this.workshopModel.findById(subWorkshopDto.workshop);
    workshop.subscriber.push(sub._id);
    try {
      const newSub = await sub.save();
      await workshop.save();
      //create the log for this activity
      this.logger.info(
        `Success create subscriber ${newSub._id} for workshop ${workshop._id}`,
      );
      return newSub;
    } catch (err) {
      this.logger.error(
        `Saving subscriber ${sub._id} or update workshop ${workshop._id} failed: ${err}`,
      );
      return null;
    }
  }

  async unsubWorkshop(workshopID: string, unsubDto: UnsubWorkshopDto) {
    const workshop = await this.workshopModel.findById(workshopID);
    //delete subscriber from subscriber document and workshop subscribe array
    const delSub = await this.subModel.findByIdAndDelete(unsubDto.subID);
    if (!workshop || !delSub) {
      this.logger.warn(
        `Workshop or subscriber does not exist, unsubscribe failed`,
      );
      return null;
    }
    for (const sub of workshop.subscriber) {
      if (sub.toString() === unsubDto.subID) {
        const index = workshop.subscriber.indexOf(sub);
        workshop.subscriber.splice(index, 1);
        break;
      }
    }
    try {
      await workshop.save();
      //create the log for this activity
      this.logger.info(
        `Success unsubscribe ${delSub.readerID} from workshop ${workshop.topic}`,
      );
      return delSub._id;
    } catch (err) {
      this.logger.error(`Update workshop ${workshop._id} failed: ${err}`);
      return null;
    }
  }

  async getSub(readerID): Promise<Subscriber> {
    const sub = await this.subModel.findOne({ readerID: readerID });
    if (sub) {
      this.logger.info(`Success get subscriber from readerID ${readerID}`);
      return sub;
    }
    this.logger.warn(`Failed to get subscriber from readerID ${readerID}`);
    return null;
  }

  async getSubName(subID) {
    const sub = await this.subModel.findById(subID);
    let readerName = '';
    if (sub) {
      const reader = await this.readerModel.findById(sub.readerID);
      if (reader) readerName = reader.username;
    } else {
      this.logger.warn(`Failed to get reader username from subscriber ${subID}`);
      return null;
    }
    this.logger.info(`Success get reader username from subscriber ${subID}`);
    return JSON.stringify(readerName);
  }

  async getSubList(workshopID) {
    const workshop = await this.workshopModel
      .findById(workshopID)
      .populate('subscriber')
      .exec();
    //Check if workshop ID is correct, if not return null
    if (!workshop) {
      this.logger.warn(
        `Workshop ${workshopID} does not exist, get subscriber list failed`,
      );
      return null;
    }
    //create the log for this activity
    this.logger.info(
      `Success get subscriber list of workshop ${workshop.topic}`,
    );
    return workshop.subscriber;
  }
}
