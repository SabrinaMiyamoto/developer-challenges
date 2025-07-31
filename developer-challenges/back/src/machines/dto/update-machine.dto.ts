import { PartialType } from '@nestjs/mapped-types';
import { CreateMachineDto } from './create-machine.dto';

// PartialType torna todas as propriedades de CreateMachineDto opcionais
export class UpdateMachineDto extends PartialType(CreateMachineDto) {}