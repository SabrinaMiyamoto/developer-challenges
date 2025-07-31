import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { MonitoringPoint, MonitoringPointDocument, Sensor } from'./schemas/monitoring-points.schema';

import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';

import { Machine, MachineDocument } from '../machines/schema/machine.schemas';
import { MachineType } from '../machines/entities/machine.entity';
import { SensorModel } from '../sensors/entities/sensor.entity';


@Injectable()
export class MonitoringPointsService {
  constructor(
    @InjectModel(MonitoringPoint.name) private monitoringPointModel: Model<MonitoringPointDocument>,
    @InjectModel(Machine.name) private machineModel: Model<MachineDocument>,
  ) {}

  private async validateSensorMachineCompatibility(
    machineId: string,
    sensor: Sensor,
  ): Promise<void> {
    const machine: MachineDocument | null = await this.machineModel.findById(machineId).exec();
    if (!machine) {
      throw new NotFoundException(`Máquina com ID "${machineId}" não encontrada para validação.`);
    }

    if (machine.type === MachineType.PUMP) {
      if (sensor.model === SensorModel.TC_AG || sensor.model === SensorModel.TC_AS) {
        throw new BadRequestException(
          `Não é permitido associar sensores do tipo "${sensor.model}" a máquinas do tipo "${machine.type}".`,
        );
      }
    }
  }

  async create(createMonitoringPointDto: CreateMonitoringPointDto): Promise<MonitoringPoint> {
    const { name, machineName, sensor, lastMaintenanceDate } = createMonitoringPointDto;

    const machine: MachineDocument | null = await this.machineModel.findOne({ name: machineName }).exec();
    if (!machine) {
      throw new NotFoundException(`Máquina com nome "${machineName}" não encontrada.`);
    }

    await this.validateSensorMachineCompatibility((machine._id as ObjectId).toString(), sensor);

    const existingPoint = await this.monitoringPointModel.findOne({ name }).exec();
    if (existingPoint) {
      throw new BadRequestException('Já existe um ponto de monitoramento com este nome.');
    }

    const createdPoint = new this.monitoringPointModel({
      name,
      machine: machine._id,
      sensor,
      lastMaintenanceDate,
    });

    return createdPoint.save();
  }

  async findAll(
    page: number = 0,
    pageSize: number = 5,
    sortBy: keyof MonitoringPoint | 'machine.name' | 'machine.type' | 'sensor.model' = 'name',
    sortDirection: 'asc' | 'desc' = 'asc',
    searchTerm?: string,
  ): Promise<{ data: MonitoringPoint[]; total: number }> {
    let query: any = {};

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [
        { name: { $regex: regex } },
        { 'sensor.model': { $regex: regex } },
      ];
    }

    const total = await this.monitoringPointModel.countDocuments(query).exec();

    const sortOptions: { [key: string]: 'asc' | 'desc' | 1 | -1 } = {};
    if (sortBy) {
      if (sortBy === 'sensor.model') {
        sortOptions['sensor.model'] = sortDirection === 'asc' ? 1 : -1;
      } else if (sortBy === 'machine.name') {
        sortOptions['machine.name'] = sortDirection === 'asc' ? 1 : -1;
      } else if (sortBy === 'machine.type') {
        sortOptions['machine.type'] = sortDirection === 'asc' ? 1 : -1;
      } else {
        sortOptions[sortBy as string] = sortDirection === 'asc' ? 1 : -1;
      }
    }

    const paginatedPoints = await this.monitoringPointModel
      .find(query)
      .populate('machine')
      .sort(sortOptions)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();

    return { data: paginatedPoints, total };
  }

  async findOne(id: string): Promise<MonitoringPoint> {
    const point = await this.monitoringPointModel.findById(id).populate('machine').exec();
    if (!point) {
      throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado.`);
    }
    return point;
  }

  async update(id: string, updateMonitoringPointDto: UpdateMonitoringPointDto): Promise<MonitoringPoint> {
    const { machineName, sensor } = updateMonitoringPointDto;
    let machineIdToValidate: string | undefined;
    let sensorToValidate: Sensor | undefined;

    if (machineName || sensor) {
      const existingPoint = await this.monitoringPointModel.findById(id).exec();
      if (!existingPoint) {
        throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado para validação.`);
      }

      if (machineName) {
        const machine: MachineDocument | null = await this.machineModel.findOne({ name: machineName }).exec();
        if (!machine) {
          throw new NotFoundException(`Máquina com nome "${machineName}" não encontrada para atualização.`);
        }
        machineIdToValidate = (existingPoint.machine as any)._id.toString();
      } else {
        if (existingPoint.machine && typeof existingPoint.machine === 'object' && '_id' in existingPoint.machine) {
          machineIdToValidate = (existingPoint.machine as any)._id.toString();
        } else {
          throw new BadRequestException('Não foi possível determinar o ID da máquina existente.');
        }
      }

      sensorToValidate = sensor || (existingPoint as any).sensor;

      if (machineIdToValidate && sensorToValidate) {
        await this.validateSensorMachineCompatibility(machineIdToValidate, sensorToValidate);
      }
    }

    const updateData: any = { ...updateMonitoringPointDto };
    if (machineName && machineIdToValidate) {
      updateData.machine = machineIdToValidate;
      delete updateData.machineName;
    }

    const updatedPoint = await this.monitoringPointModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedPoint) {
      throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado para atualização.`);
    }
    return updatedPoint.populate('machine');
  }

  async remove(id: string): Promise<any> {
    const result = await this.monitoringPointModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado para exclusão.`);
    }
    return { message: 'Ponto de monitoramento deletado com sucesso.', id: id };
  }
}
