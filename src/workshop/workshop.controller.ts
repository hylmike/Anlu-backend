import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
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

@Controller('api/workshop')
export class WorkshopController {
  constructor(
    private readonly workshopService: WorkshopService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = `${file['path']}`;
    this.logger.info(
      `Start uploading ${file['filename']} into folder ${file['path']}`,
    );
    return { fileUrl: fileUrl };
  }

  @Post('/register')
  register(@Body() regWorkshopDto: RegisterWorkshopDto) {
    return this.workshopService.register(regWorkshopDto);
  }

  @Get('/profile/:id')
  getWorkshop(@Param('id') workshopID: string) {
    return this.workshopService.getWorkshop(workshopID);
  }

  @Get('/getall')
  getAllWorkshop() {
    return this.workshopService.getAllWorkshop();
  }

  @Patch('/update/:id')
  updateWorkshop(
    @Param('id') workshopID: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopService.updateWorkshop(workshopID, updateWorkshopDto);
  }

  @Get('/getsub/:id')
  getSub(@Param('id') readerID: string) {
    return this.workshopService.getSub(readerID);
  }

  @Get('/getsublist/:id')
  getSubList(@Param('id') workshopID: string) {
    return this.workshopService.getSubList(workshopID);
  }

  @Post('/subscribe')
  subWorkshop(@Body() subWorkshopDto: SubWorkshopDto) {
    return this.workshopService.subWorkshop(subWorkshopDto);
  }

  @Patch('/unsubscribe/:id')
  unsubWorkshop(
    @Param('id') workshopID: string,
    @Body() unsubWsDto: UnsubWorkshopDto,
  ) {
    return this.workshopService.unsubWorkshop(workshopID, unsubWsDto);
  }

}
