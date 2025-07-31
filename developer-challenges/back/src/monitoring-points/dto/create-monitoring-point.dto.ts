import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsEnum,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { SensorModel } from '../../sensors/entities/sensor.entity'; 
import { BaseSensorDto } from '../../sensors/dto/base-sensor-dto';


// Ele herda as validações e campos do BaseSensorDto
export class CreateSensorEmbeddedDto extends BaseSensorDto {}

export class CreateMonitoringPointDto {
  @IsUUID('4', { message: 'O ID da máquina deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID da máquina não pode ser vazio.' })
  machineId: string;

  @IsString({ message: 'O nome do ponto de monitoramento deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do ponto de monitoramento não pode ser vazio.' })
  name: string;

  @IsString({ message: 'A data da última manutenção deve ser uma string.' })
  @IsNotEmpty({ message: 'A data da última manutenção não pode ser vazia.' })
  lastMaintenanceDate: string;

  // O sensor é OBRIGATÓRIO na criação de um MonitoringPoint
  @ValidateNested()
  @Type(() => CreateSensorEmbeddedDto)
  sensor: CreateSensorEmbeddedDto;
}