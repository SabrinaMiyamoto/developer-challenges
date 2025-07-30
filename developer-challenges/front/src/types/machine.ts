import { ISensor } from './sensor';
//usei o enum pq fica melhor para poder 
export enum MachineType {
  PUMP = 'Pump',
  FAN = 'Fan'
}
export interface IMonitoringPoint {
  id: string;
  machineId: string;
  name: string,
  machineName: string;
  machineType: MachineType;
  sensor: ISensor;
  createdAt: string;
  lastMaintenanceDate: string;
}

export interface Machine {
  id: string;
  name: string; 
  type: MachineType;
}

//para não ter que chamar uma função
export interface NewMachine extends Omit<Machine, 'id'> {}


export interface GetMonitoringPointsResponse {
  data: IMonitoringPoint[];
  total: number;
  page: number; 
  pageSize: number; 
}
export type SortableField = 'name' | 'machineName' | 'machineType' | 'sensorModel' | 'createdAt' | 'lastMaintenanceDate';
export type SortDirection = 'asc' | 'desc';