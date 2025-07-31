import { MachineType } from "src/machines/entities/machine.entity";
import { Sensor } from "src/sensors/entities/sensor.entity";

export interface MonitoringPoint {
  id: string;
  machineId: string;
  name: string;
  machineName: string;
  machineType: MachineType;
  sensor: Sensor;
  createdAt: string;
  lastMaintenanceDate: string;
}