import {
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSensorDto } from 'src/sensors/dto/create-sensor-dto';

export class CreateMonitoringPointDto {
  @IsString()
  @IsNotEmpty()
  machineName: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsISO8601()
  lastMaintenanceDate?: string;

  @ValidateNested()
  @Type(() => CreateSensorDto)
  sensor: CreateSensorDto;
}
