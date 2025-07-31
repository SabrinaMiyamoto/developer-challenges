import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MachineType } from '../entities/machine.entity';

export type MachineDocument = Machine & Document;

@Schema({ timestamps: true })
export class Machine {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: MachineType })
  type: MachineType;

}

export const MachineSchema = SchemaFactory.createForClass(Machine);

MachineSchema.index({ name: 1, type: 1 }, { unique: true }); 