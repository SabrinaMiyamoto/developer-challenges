import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SensorModel } from '../../sensors/entities/sensor.entity';


@Schema()
export class Sensor {


  @Prop({ required: true, enum: SensorModel })
  model: SensorModel;

  @Prop({ required: false})
  lastMaintenanceDate?: Date;
  
  @Prop({ required: false })
  imageUrl?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);


export type MonitoringPointDocument = MonitoringPoint & Document;

@Schema({ timestamps: true })
export class MonitoringPoint {
  @Prop({ required: true, unique: true })
  name: string;


  @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
  machine: Types.ObjectId;


  @Prop({ type: [SensorSchema], required: true })
  sensor: Sensor;
}

export const MonitoringPointSchema = SchemaFactory.createForClass(MonitoringPoint);


MonitoringPointSchema.index({ machine: 1 });