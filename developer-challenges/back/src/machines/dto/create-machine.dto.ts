import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { MachineType } from '../entities/machine.entity';

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MachineType, { message: 'Tipo de máquina inválido. Deve ser "pump" ou "fan".' })
  @IsNotEmpty()
  type: MachineType;
}