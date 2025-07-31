import { Module } from '@nestjs/common';
import { MonitoringPointsService } from './monitoring-points.service';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MachinesModule } from '../machines/machines.module'; 

@Module({
  imports: [MachinesModule], 
  controllers: [MonitoringPointsController],
  providers: [MonitoringPointsService],
  exports: [MonitoringPointsService]
})
export class MonitoringPointsModule {}