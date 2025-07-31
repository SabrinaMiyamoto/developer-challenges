import { IsEnum, IsString, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';
import { SensorModel } from '../entities/sensor.entity'; 

export class BaseSensorDto {

  @IsEnum(SensorModel, { message: 'O modelo do sensor é inválido.' })
  @IsNotEmpty({ message: 'O modelo do sensor não pode ser vazio.' })
  model: SensorModel;

  @IsOptional()
  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  @IsUrl({}, { message: 'A URL da imagem deve ser uma URL válida.' })
  imageUrl?: string;

  constructor(partial?: Partial<BaseSensorDto>) {
    Object.assign(this, partial);
    console.log('--- Debug BaseSensorDto ---');
    console.log('Valor recebido para model:', this.model);
    console.log('Tipo do valor recebido para model:', typeof this.model);
    console.log('Valores permitidos (Enum SensorModel):', Object.values(SensorModel));
    console.log('--- Fim Debug BaseSensorDto ---');
  }
}