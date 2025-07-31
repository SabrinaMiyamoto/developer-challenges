import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema'


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = await this.userModel.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
    });

    const { password, ...result } = createdUser.toObject();
    return result;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? user.toObject() as User : undefined;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => {
      const { password, ...result } = user.toObject();
      return result;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    const { password, ...result } = user.toObject();
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const userToUpdate = await this.userModel.findById(id).exec();
    if (!userToUpdate) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }

    if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
      const existingUserWithNewEmail = await this.userModel.findOne({ email: updateUserDto.email }).exec();
      
      if (existingUserWithNewEmail && existingUserWithNewEmail._id instanceof Types.ObjectId && existingUserWithNewEmail._id.toString() !== id) {
        throw new ConflictException('E-mail já está sendo usado por outro usuário.');
      }
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado para atualização.`);
    }

    const { password, ...result } = updatedUser.toObject();
    return result;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado para exclusão.`);
    }
    return { message: `Usuário com ID "${id}" excluído com sucesso.` };
  }
}