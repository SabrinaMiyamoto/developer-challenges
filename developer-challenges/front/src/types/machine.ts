import { ISensor } from './sensor';
//usei o enum pq fica melhor para poder 
export enum MachineType {
  PUMP = 'Pump',
  FAN = 'Fan'
}
export interface IMonitoringPoint {
  id: string;
  machineId: string;
  name: string;
  sensor: ISensor | null;
}

export interface Machine {
  id: string;
  name: string; 
  type: MachineType;
  monitoringPoints: IMonitoringPoint[];
}
export interface NewMachine {
  name: string;
  type: MachineType;
}
