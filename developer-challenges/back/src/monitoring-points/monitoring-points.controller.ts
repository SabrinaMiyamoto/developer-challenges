import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { MonitoringPointsService } from './monitoring-points.service';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('monitoring-points')
@UseGuards(JwtAuthGuard) 
export class MonitoringPointsController {
  constructor(private readonly monitoringPointsService: MonitoringPointsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMonitoringPointDto: CreateMonitoringPointDto) {
    return this.monitoringPointsService.create(createMonitoringPointDto);
  }

  @Get()
  findAll() {
    return this.monitoringPointsService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id: string) {
    return this.monitoringPointsService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitoringPointDto: UpdateMonitoringPointDto) {
    return this.monitoringPointsService.update(id, updateMonitoringPointDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.monitoringPointsService.remove(id);
  }
}