import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity'
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {

  private users: User[] = [];


  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = this.users.find(u => u.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser: User = {
      id: uuidv4(),
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };
    this.users.push(newUser);
    

    const { password, ...result } = newUser;
    return result; 
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> { 
    return this.users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> { 
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    const { password, ...result } = user;
    return result;
  }
}