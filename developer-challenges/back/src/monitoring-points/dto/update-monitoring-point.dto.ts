import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoringPointDto } from './create-monitoring-point.dto';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsUrl,
  ValidateNested,
  IsUUID 
} from 'class-validator';
import { Type } from 'class-transformer';
import { SensorModel } from '../../sensors/entities/sensor.entity';
import { BaseSensorDto } from '../../sensors/dto/base-sensor-dto';

// DTO para atualização do sensor EMBUTIDO

export class UpdateSensorEmbeddedDto extends PartialType(BaseSensorDto) {}

// DTO para atualização do Ponto de Monitoramento

export class UpdateMonitoringPointDto {
  @IsOptional()
  @IsUUID('4', { message: 'O ID da máquina deve ser um UUID válido.' })
  machineId?: string;

  @IsOptional()
  @IsString({ message: 'O nome do ponto de monitoramento deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'A data da última manutenção deve ser uma string.' })
  lastMaintenanceDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSensorEmbeddedDto)
  sensor?: UpdateSensorEmbeddedDto;
}