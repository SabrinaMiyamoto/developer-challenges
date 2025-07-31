import { PartialType } from '@nestjs/mapped-types'; 
import { BaseSensorDto } from './base-sensor-dto';


export class UpdateSensorDto extends PartialType(BaseSensorDto){}