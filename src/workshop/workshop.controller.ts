import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { WorkshopService } from './workshop.service';
import {
  RegisterWorkshopDto,
  SubWorkshopDto,
  UpdateWorkshopDto,
  UnsubWorkshopDto,
} from './workshop.dto';

@Controller('api/workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) { }

  //@UseGuards(AuthGuard('lib-jwt'))
  @Post('/register')
  register(@Body() regWorkshopDto: RegisterWorkshopDto) {
    return this.workshopService.register(regWorkshopDto);
  }

  //@UseGuards(AuthGuard('lib-jwt'))
  @Get('/:id')
  getWorkshop(@Param('id') workshopID: string) {
    return this.workshopService.getWorkshop(workshopID);
  }

  //@UseGuards(AuthGuard('lib-jwt'))
  @Patch('/:id/update')
  updateWorkshop(
    @Param('id') workshopID: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopService.updateWorkshop(workshopID, updateWorkshopDto);
  }

  //@UseGuards(AuthGuard('lib-jwt'))
  @Get('/:id/getsublist')
  getSubList(@Param('id') workshopID: string) {
    return this.workshopService.getSubList(workshopID);
  }

  //@UseGuards(AuthGuard('reader-jwt'))
  @Post('/subscribe')
  subWorkshop(@Body() subWorkshopDto: SubWorkshopDto) {
    return this.workshopService.subWorkshop(subWorkshopDto);
  }

  //@UseGuards(AuthGuard('reader-jwt'))
  @Patch('/:id/unsubscribe')
  unsubWorkshop(
    @Param('id') workshopID: string,
    @Body() unsubWsDto: UnsubWorkshopDto,
  ) {
    return this.workshopService.unsubWorkshop(workshopID, unsubWsDto);
  }

}
