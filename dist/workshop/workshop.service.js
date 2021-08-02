"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const nest_winston_1 = require("nest-winston");
let WorkshopService = class WorkshopService {
    constructor(logger, workshopModel, subModel) {
        this.logger = logger;
        this.workshopModel = workshopModel;
        this.subModel = subModel;
    }
    async register(regWorkshopDto) {
        let workshop = await this.workshopModel.findOne({
            topic: regWorkshopDto.topic,
        });
        if (workshop) {
            this.logger.warn(`Duplicated workshop with topic ${regWorkshopDto.topic}, register failed`);
            return null;
        }
        const now = new Date();
        workshop = new this.workshopModel({
            topic: regWorkshopDto.topic,
            place: regWorkshopDto.place,
            organizer: regWorkshopDto.organizer,
            startTime: new Date(regWorkshopDto.startTime),
            duration: regWorkshopDto.duration,
            flyerContent: regWorkshopDto.flyerContent,
            creator: regWorkshopDto.creator,
            createTime: now,
            remark: regWorkshopDto.remark,
        });
        try {
            const newWorkshop = await workshop.save();
            this.logger.info(`Success create workshop ${newWorkshop.topic}`);
            return newWorkshop;
        }
        catch (err) {
            this.logger.error(`Saving new workshop ${workshop.topic} into database failed: ${err}`);
            return null;
        }
    }
    async getWorkshop(workshopID) {
        const workshop = await this.workshopModel.findById(workshopID);
        if (!workshop) {
            this.logger.warn(`Workshop ${workshopID} does not exist, get workshop failed`);
            return null;
        }
        this.logger.info(`Success get workshop ${workshop.topic}`);
        return workshop;
    }
    async updateWorkshop(workshopID, updateWorkshopDto) {
        const workshop = await this.workshopModel.findById(workshopID);
        if (!workshop) {
            this.logger.warn(`Workshop ${workshopID} does not exist, update workshop failed`);
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
            this.logger.info(`Success update workshop ${workshop.topic}`);
            return workshop;
        }
        catch (err) {
            this.logger.error(`Saving updated workshop ${workshop.topic} into database failed: ${err}`);
            return null;
        }
    }
    async subWorkshop(subWorkshopDto) {
        let sub = await this.subModel.findOne({
            workshop: subWorkshopDto.workshop,
            firstName: subWorkshopDto.firstName,
            lastName: subWorkshopDto.lastName,
            age: subWorkshopDto.age,
        });
        if (sub) {
            this.logger.warn(`${subWorkshopDto.firstName} already subscribed for ${subWorkshopDto.workshop}`);
            return null;
        }
        const now = new Date();
        sub = new this.subModel({
            workshop: subWorkshopDto.workshop,
            firstName: subWorkshopDto.firstName,
            lastName: subWorkshopDto.lastName,
            age: subWorkshopDto.age,
            neighborhood: subWorkshopDto.neighborhood,
            SubscribeTime: now,
        });
        const workshop = await this.workshopModel.findById(subWorkshopDto.workshop);
        workshop.subscriber.push(sub._id);
        try {
            const newSub = await sub.save();
            await workshop.save();
            this.logger.info(`Success create subscriber ${newSub._id} for workshop ${workshop._id}`);
            return newSub;
        }
        catch (err) {
            this.logger.error(`Saving subscriber ${sub._id} or update workshop ${workshop._id} failed: ${err}`);
            return null;
        }
    }
    async unsubWorkshop(workshopID, unsubDto) {
        const workshop = await this.workshopModel.findById(workshopID);
        const delSub = await this.subModel.findByIdAndDelete(unsubDto.subID);
        if (!workshop || !delSub) {
            this.logger.warn(`Workshop or subscriber does not exist, unsubscribe failed`);
            return null;
        }
        for (const sub of workshop.subscriber) {
            if (sub === unsubDto.subID) {
                const index = workshop.subscriber.indexOf(sub);
                workshop.subscriber.splice(index, 1);
                break;
            }
        }
        try {
            await workshop.save();
            this.logger.info(`Success unsubscribe ${delSub.firstName} from workshop ${workshop.topic}`);
            return delSub._id;
        }
        catch (err) {
            this.logger.error(`Update workshop ${workshop._id} failed: ${err}`);
            return null;
        }
    }
    async getSub(subID) {
        return this.subModel.findById(subID);
    }
    async getSubList(workshopID) {
        const workshop = await this.workshopModel
            .findById(workshopID)
            .populate('subscriber')
            .exec();
        if (!workshop) {
            this.logger.warn(`Workshop ${workshopID} does not exist, get subscriber list failed`);
            return null;
        }
        this.logger.info(`Success get subscriber list of workshop ${workshop.topic}`);
        return workshop.subscriber;
    }
};
WorkshopService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __param(1, mongoose_2.InjectModel('Workshop')),
    __param(2, mongoose_2.InjectModel('Subscriber')),
    __metadata("design:paramtypes", [Object, mongoose_1.Model,
        mongoose_1.Model])
], WorkshopService);
exports.WorkshopService = WorkshopService;
//# sourceMappingURL=workshop.service.js.map