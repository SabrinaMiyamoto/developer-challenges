import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';
import { MonitoringPoint } from './entities/monitoring-point.entity';
import { MachineType } from '../machines/entities/machine.entity'; 
import { MachinesService } from '../machines/machines.service';
import { v4 as uuidv4 } from 'uuid';
import { Sensor, SensorModel } from '../sensors/entities/sensor.entity';

@Injectable()
export class MonitoringPointsService {
  private monitoringPoints: MonitoringPoint[] = [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      name: 'Ponto de Vibração Principal',
      machineId: '1', 
      machineName: 'Bomba Principal A',
      machineType: MachineType.PUMP,
      sensor: {
        id: 'fedcba98-7654-3210-fedc-ba9876543210',
        model: SensorModel.HF_PLUS, 
        imageUrl: '/assets/sensors/hfplus.png',
      },
      createdAt: '2024-01-01T10:00:00Z',
      lastMaintenanceDate: '2024-06-01T14:30:00Z',
    },
    {
      id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
      name: 'Ponto de Fluxo do Exaustor',
      machineId: '2',
      machineName: 'Exaustor do Setor C',
      machineType: MachineType.FAN,
      sensor: {
        id: 'abcdef01-2345-6789-abcd-ef0123456789',
        model: SensorModel.TC_AG,
        imageUrl: '/assets/sensors/tcag.png',
      },
      createdAt: '2023-11-15T08:00:00Z',
      lastMaintenanceDate: '2024-05-20T10:00:00Z',
    },
  ];

  constructor(
    private readonly machinesService: MachinesService,
  ) {}

  create(createMonitoringPointDto: CreateMonitoringPointDto): MonitoringPoint {
    const { machineId, name, lastMaintenanceDate, sensor } = createMonitoringPointDto;

    const machine = this.machinesService.findOne(machineId);
    if (!machine) {
      throw new NotFoundException(`Máquina com ID "${machineId}" não encontrada.`);
    }


    if (
      machine.type === MachineType.PUMP &&
      (sensor.model === SensorModel.TC_AG || sensor.model === SensorModel.TC_AS)
    ) {
      throw new BadRequestException(
        `Não é permitido associar sensores do tipo "${sensor.model}" a máquinas do tipo "${machine.type}".`
      );
    }

    const newSensor: Sensor = {
      id: uuidv4(),
      model: sensor.model,
      imageUrl: sensor.imageUrl,
    };

    const newMonitoringPoint: MonitoringPoint = {
      id: uuidv4(),
      name,
      machineId,
      machineName: machine.name,
      machineType: machine.type,
      sensor: newSensor,
      createdAt: new Date().toISOString(),
      lastMaintenanceDate,
    };

    this.monitoringPoints.push(newMonitoringPoint);
    return newMonitoringPoint;
  }

  findAll(
    page: number = 0,
    pageSize: number = 5,
    sortBy: keyof MonitoringPoint | 'sensorModel' = 'name',
    sortDirection: 'asc' | 'desc' = 'asc',
    searchTerm?: string
  ): { data: MonitoringPoint[]; total: number } {
    let filteredPoints = [...this.monitoringPoints];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredPoints = filteredPoints.filter(point =>
        point.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        point.machineName.toLowerCase().includes(lowerCaseSearchTerm) ||
        point.machineType.toLowerCase().includes(lowerCaseSearchTerm) ||
        point.sensor.model.toLowerCase().includes(lowerCaseSearchTerm) ||
        point.createdAt.toLowerCase().includes(lowerCaseSearchTerm) ||
        point.lastMaintenanceDate.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    const sortedPoints = [...filteredPoints];
    if (sortBy) {
      sortedPoints.sort((a, b) => {
        let valA: string | Date | undefined;
        let valB: string | Date | undefined;

        if (sortBy === 'sensorModel') {
          valA = a.sensor.model;
          valB = b.sensor.model;
        } else {
          valA = a[sortBy as keyof MonitoringPoint] as string;
          valB = b[sortBy as keyof MonitoringPoint] as string;
        }

        let comparisonResult: number;
        if (sortBy === 'createdAt' || sortBy === 'lastMaintenanceDate') {
          const dateA = valA ? new Date(valA as string) : new Date(0);
          const dateB = valB ? new Date(valB as string) : new Date(0);
          comparisonResult = dateA.getTime() - dateB.getTime();
        } else {
          const strValA = String(valA || '').toLowerCase();
          const strValB = String(valB || '').toLowerCase();
          comparisonResult = strValA.localeCompare(strValB);
        }
        return sortDirection === 'asc' ? comparisonResult : -comparisonResult;
      });
    }

    const total = sortedPoints.length;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPoints = sortedPoints.slice(startIndex, endIndex);

    return { data: paginatedPoints, total };
  }

  findOne(id: string): MonitoringPoint | undefined {
    const point = this.monitoringPoints.find((mp) => mp.id === id);
    if (!point) {
      throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado.`);
    }
    return point;
  }

  update(id: string, updateMonitoringPointDto: UpdateMonitoringPointDto): MonitoringPoint {
    const existingMonitoringPointIndex = this.monitoringPoints.findIndex((mp) => mp.id === id);

    if (existingMonitoringPointIndex === -1) {
      throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado.`);
    }

    const existingMonitoringPoint = this.monitoringPoints[existingMonitoringPointIndex];

    const machineIdToUse = updateMonitoringPointDto.machineId || existingMonitoringPoint.machineId;
    const machine = this.machinesService.findOne(machineIdToUse);
    if (!machine) {
      throw new NotFoundException(`Máquina com ID "${machineIdToUse}" não encontrada.`);
    }

    const sensorModelToValidate = updateMonitoringPointDto.sensor?.model || existingMonitoringPoint.sensor.model;

    if (
      machine.type === MachineType.PUMP &&
      (sensorModelToValidate === SensorModel.TC_AG || sensorModelToValidate === SensorModel.TC_AS)
    ) {
      throw new BadRequestException(
        `Não é permitido associar sensores do tipo "${sensorModelToValidate}" a máquinas do tipo "${machine.type}".`
      );
    }

    let updatedSensor: Sensor = { ...existingMonitoringPoint.sensor };

    if (updateMonitoringPointDto.sensor) {
      if (updateMonitoringPointDto.sensor.model && updateMonitoringPointDto.sensor.model !== existingMonitoringPoint.sensor.model) {
          updatedSensor = {
              id: uuidv4(),
              model: updateMonitoringPointDto.sensor.model,
              imageUrl: updateMonitoringPointDto.sensor.imageUrl || existingMonitoringPoint.sensor.imageUrl
          };
      } else {
          updatedSensor = {
              ...updatedSensor,
              ...updateMonitoringPointDto.sensor
          };
      }
    }

    const updatedMonitoringPoint: MonitoringPoint = {
      ...existingMonitoringPoint,
      ...updateMonitoringPointDto,
      machineId: machine.id,
      machineName: machine.name,
      machineType: machine.type,
      sensor: updatedSensor,
    };

    this.monitoringPoints[existingMonitoringPointIndex] = updatedMonitoringPoint;
    return updatedMonitoringPoint;
  }

  remove(id: string): void {
    const initialLength = this.monitoringPoints.length;
    this.monitoringPoints = this.monitoringPoints.filter((mp) => mp.id !== id);
    if (this.monitoringPoints.length === initialLength) {
      throw new NotFoundException(`Ponto de monitoramento com ID "${id}" não encontrado.`);
    }
  }
}