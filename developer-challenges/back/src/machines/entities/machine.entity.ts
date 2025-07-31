export enum MachineType {
  PUMP = 'pump',
  FAN = 'fan',
}

export interface Machine {
  id: string;
  name: string;
  type: MachineType;
}