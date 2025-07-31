import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, MinLength, IsEmail } from 'class-validator';


export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  email?: string; 

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password?: string; 

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string; 
}