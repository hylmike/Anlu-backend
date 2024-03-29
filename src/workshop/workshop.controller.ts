import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { FileInterceptor } from '@nestjs/platform-express';
import { Logger } from 'winston';

import { WorkshopService } from './workshop.service';
import {
  RegisterWorkshopDto,
  SubWorkshopDto,
  UpdateWorkshopDto,
  UnsubWorkshopDto,
} from './workshop.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/workshop')
export class WorkshopController {
  constructor(
    private readonly workshopService: WorkshopService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `${file['path']}`;
    this.logger.info(
      `Start uploading ${file['filename']} into folder ${file['path']}`,
    );
    return { fileUrl: fileUrl };
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Post('/register')
  register(@Body() regWorkshopDto: RegisterWorkshopDto) {
    return this.workshopService.register(regWorkshopDto);
  }

  @Get('/profile/:id')
  getWorkshop(@Param('id') workshopID: string) {
    return this.workshopService.getWorkshop(workshopID);
  }

  @Get('/get/:num')
  getWsList(@Param('num') num: number) {
    return this.workshopService.getWsList(num);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Patch('/update/:id')
  updateWorkshop(
    @Param('id') workshopID: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopService.updateWorkshop(workshopID, updateWorkshopDto);
  }

  @UseGuards(AuthGuard('lib-jwt'))
  @Delete('/del/:id')
  delWorkshop(@Param('id') workshopID: string) {
    return this.workshopService.delWorkshop(workshopID);
  }

  @Get('/getsub/:id')
  getSub(@Param('id') readerID: string) {
    return this.workshopService.getSub(readerID);
  }

  @Get('/getsublist/:id')
  getSubList(@Param('id') workshopID: string) {
    return this.workshopService.getSubList(workshopID);
  }

  @Get('/getsubname/:id')
  getSubName(@Param('id') subID: string) {
    return this.workshopService.getSubName(subID);
  }

  @UseGuards(AuthGuard('reader-jwt'))
  @Post('/subscribe')
  subWorkshop(@Body() subWorkshopDto: SubWorkshopDto) {
    return this.workshopService.subWorkshop(subWorkshopDto);
  }

  @UseGuards(AuthGuard('reader-jwt'))
  @Patch('/unsubscribe/:id')
  unsubWorkshop(
    @Param('id') workshopID: string,
    @Body() unsubWsDto: UnsubWorkshopDto,
  ) {
    return this.workshopService.unsubWorkshop(workshopID, unsubWsDto);
  }
}
