import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Machine, MachineDocument } from './schema/machine.schemas';
import { MachineType } from './entities/machine.entity';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<MachineDocument>,
  ) {}

  async create(createMachineDto: CreateMachineDto): Promise<Machine> {
    const existingMachine = await this.machineModel.findOne({
      name: createMachineDto.name,
      type: createMachineDto.type,
    }).exec();

    if (existingMachine) {
      throw new ConflictException('Já existe uma máquina com este nome e tipo.');
    }

    const createdMachine = new this.machineModel(createMachineDto);
    return createdMachine.save();
  }

  async findAll(
    page: number = 0,
    pageSize: number = 5,
    sortBy: keyof Machine = 'name',
    sortDirection: 'asc' | 'desc' = 'asc',
    searchTerm?: string
  ): Promise<{ data: Machine[]; total: number }> {
    let query: any = {};

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [
        { name: { $regex: regex } },
        { type: { $regex: regex } },
      ];
    }

    const total = await this.machineModel.countDocuments(query).exec();

    const sortOptions: { [key: string]: 'asc' | 'desc' | 1 | -1 } = {};
    if (sortBy) {
      sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;
    }

    const paginatedMachines = await this.machineModel
      .find(query)
      .sort(sortOptions)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();

    return { data: paginatedMachines, total };
  }

  async findOne(id: string): Promise<Machine> {
    const machine = await this.machineModel.findById(id).exec();
    if (!machine) {
      throw new NotFoundException('Máquina com ID "' + id + '" não encontrada.');
    }
    return machine;
  }

  async update(id: string, updateMachineDto: UpdateMachineDto): Promise<Machine> {
    const updatedMachine = await this.machineModel.findByIdAndUpdate(id, updateMachineDto, { new: true }).exec();
    if (!updatedMachine) {
      throw new NotFoundException('Máquina com ID "' + id + '" não encontrada para atualização.');
    }
    return updatedMachine;
  }

  async remove(id: string): Promise<any> {
    const result = await this.machineModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Máquina com ID "' + id + '" não encontrada para exclusão.');
    }
    return { message: 'Máquina deletada com sucesso.', id: id };
  }
}