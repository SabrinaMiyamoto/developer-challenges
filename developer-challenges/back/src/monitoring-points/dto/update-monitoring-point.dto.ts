import { PartialType } from '@nestjs/mapped-types';
import { CreateMonitoringPointDto } from './create-monitoring-point.dto';
import { IsOptional, IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class UpdateMonitoringPointDto extends PartialType(CreateMonitoringPointDto) {
  @IsOptional()
  @IsString({ message: 'A data da última manutenção deve ser uma string.' })
  @IsNotEmpty({ message: 'A data da última manutenção não pode ser vazia.' })
  @IsISO8601({}, { message: 'A data da última manutenção deve estar no formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).' })
  lastMaintenanceDate?: string;
}