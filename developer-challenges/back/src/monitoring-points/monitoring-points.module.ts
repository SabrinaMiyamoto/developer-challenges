import { Module } from '@nestjs/common';
import { MonitoringPointsService } from './monitoring-points.service';
import { MonitoringPointsController } from './monitoring-points.controller';
import { MachinesModule } from '../machines/machines.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringPointSchema, MonitoringPoint } from './schemas/monitoring-points.schema';
import { MachineSchema, Machine } from 'src/machines/schema/machine.schemas';

@Module({
  imports: [MachinesModule,
    MongooseModule.forFeature([
      { name: MonitoringPoint.name, schema: MonitoringPointSchema},
      { name: Machine.name, schema: MachineSchema}
    ])
  ], 
  controllers: [MonitoringPointsController],
  providers: [MonitoringPointsService],
  exports: [MonitoringPointsService]
})
export class MonitoringPointsModule {}