import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine, MachineType } from './entities/machine.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MachinesService {

  private machines: Machine[] = [
    { id: uuidv4(), name: 'Bomba Principal A', type: MachineType.PUMP },
    { id: uuidv4(), name: 'Exaustor do Setor C', type: MachineType.FAN },
    { id: uuidv4(), name: 'Bomba Auxiliar B', type: MachineType.PUMP },
    { id: uuidv4(), name: 'Ventilador de Refrigeração', type: MachineType.FAN },
  ];

  create(createMachineDto: CreateMachineDto): Machine {
    const newMachine: Machine = {
      id: uuidv4(), 
      ...createMachineDto,
    };
    this.machines.push(newMachine);
    return newMachine;
  }


  findAll(
    page: number = 0,
    pageSize: number = 5,
    sortBy: keyof Machine = 'name', 
    sortDirection: 'asc' | 'desc' = 'asc',
    searchTerm?: string
  ): { data: Machine[]; total: number } {
    let filteredMachines = [...this.machines];

   
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredMachines = filteredMachines.filter(machine =>
        machine.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        machine.type.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }


    const sortedMachines = [...filteredMachines];
    if (sortBy) {
      sortedMachines.sort((a, b) => {
        const valA = String(a[sortBy] || '').toLowerCase();
        const valB = String(b[sortBy] || '').toLowerCase();
        const comparisonResult = valA.localeCompare(valB);
        return sortDirection === 'asc' ? comparisonResult : -comparisonResult;
      });
    }


    const total = sortedMachines.length;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedMachines = sortedMachines.slice(startIndex, endIndex);

    return { data: paginatedMachines, total };
  }

  findOne(id: string): Machine | undefined {
    const machine = this.machines.find((m) => m.id === id);
    if (!machine) {
      throw new NotFoundException(`Máquina com ID "${id}" não encontrada.`);
    }
    return machine;
  }

  update(id: string, updateMachineDto: UpdateMachineDto): Machine {
    const existingMachineIndex = this.machines.findIndex((m) => m.id === id);

    if (existingMachineIndex === -1) {
      throw new NotFoundException(`Máquina com ID "${id}" não encontrada.`);
    }

    const updatedMachine: Machine = {
      ...this.machines[existingMachineIndex],
      ...updateMachineDto,
    };

    this.machines[existingMachineIndex] = updatedMachine;
    return updatedMachine;
  }

  remove(id: string): void {
    const initialLength = this.machines.length;
    this.machines = this.machines.filter((m) => m.id !== id);
    if (this.machines.length === initialLength) {
      throw new NotFoundException(`Máquina com ID "${id}" não encontrada.`);
    }
  }
}