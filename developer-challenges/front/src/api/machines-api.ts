import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Machine, NewMachine, IMonitoringPoint } from '@/types/machine';
import { MachineType } from '@/types/machine';
import { ISensor, SensorModel } from '@/types/sensor';
import { v4 as uuidv4 } from 'uuid';

// 1. Mocks de Sensores
const mockSensorHFPlus: ISensor = {
  id: uuidv4(),
  model: SensorModel.HF_PLUS,
  imageUrl: '/assets/sensors/hfplus.png'
};
const mockSensorTcAg: ISensor = {
  id: uuidv4(),
  model: SensorModel.TC_AG,
  imageUrl: '/assets/sensors/tcag.png'
};
const mockSensorTcAs: ISensor = {
  id: uuidv4(),
  model: SensorModel.TC_AS,
  imageUrl: '/assets/sensors/tcas.png'
};

// 2. Dados Iniciais Normalizados
let machines: Machine[] = [
  { id: '1', name: 'Máquina Principal A', type: MachineType.PUMP },
  { id: '2', name: 'Máquina de Ventilação B', type: MachineType.FAN },
  { id: '3', name: 'Máquina de Fluido C', type: MachineType.PUMP },
  { id: '4', name: 'Máquina de Processamento D', type: MachineType.FAN },
  { id: '5', name: 'Máquina Sem Sensor E', type: MachineType.FAN },
];

let monitoringPointsData: IMonitoringPoint[] = [
  {
    id: uuidv4(),
    name: 'Ponto Primário A',
    machineId: '1',
    machineName: 'Máquina Principal A',
    machineType: MachineType.PUMP,
    sensor: { ...mockSensorHFPlus },
    createdAt: new Date('2023-01-15T10:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-06-01T08:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto Secundário A',
    machineId: '1',
    machineName: 'Máquina Principal A',
    machineType: MachineType.PUMP,
    sensor: { ...mockSensorHFPlus },
    createdAt: new Date('2023-02-20T11:30:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-05-15T09:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto Extra A',
    machineId: '1',
    machineName: 'Máquina Principal A',
    machineType: MachineType.PUMP,
    sensor: { ...mockSensorHFPlus },
    createdAt: new Date('2023-03-01T14:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-07-10T10:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Entrada B',
    machineId: '2',
    machineName: 'Máquina de Ventilação B',
    machineType: MachineType.FAN,
    sensor: { ...mockSensorTcAg },
    createdAt: new Date('2023-04-05T09:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-06-20T11:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Saída B',
    machineId: '2',
    machineName: 'Máquina de Ventilação B',
    machineType: MachineType.FAN,
    sensor: { ...mockSensorTcAs },
    createdAt: new Date('2023-05-10T16:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-07-01T13:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto Crítico C',
    machineId: '3',
    machineName: 'Máquina de Fluido C',
    machineType: MachineType.PUMP,
    sensor: { ...mockSensorHFPlus },
    createdAt: new Date('2023-06-01T10:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-05-25T08:30:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto Auxiliar C',
    machineId: '3',
    machineName: 'Máquina de Fluido C',
    machineType: MachineType.PUMP,
    sensor: { ...mockSensorHFPlus },
    createdAt: new Date('2023-07-07T12:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-06-10T09:30:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto 1 D',
    machineId: '4',
    machineName: 'Máquina de Processamento D',
    machineType: MachineType.FAN,
    sensor: { ...mockSensorTcAg },
    createdAt: new Date('2023-08-11T14:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-07-05T10:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto 2 D',
    machineId: '4',
    machineName: 'Máquina de Processamento D',
    machineType: MachineType.FAN,
    sensor: { ...mockSensorTcAs },
    createdAt: new Date('2023-09-19T08:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-06-28T14:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto 3 D',
    machineId: '4',
    machineName: 'Máquina de Processamento D',
    machineType: MachineType.FAN,
    sensor: { ...mockSensorTcAg },
    createdAt: new Date('2023-10-25T11:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-07-20T09:00:00Z').toISOString()
  },
  {
    id: uuidv4(),
    name: 'Ponto Único E',
    machineId: '5',
    machineName: 'Máquina Sem Sensor E',
    machineType: MachineType.FAN,
    sensor: { ...mockSensorHFPlus },
    createdAt: new Date('2024-01-01T08:00:00Z').toISOString(),
    lastMaintenanceDate: new Date('2024-03-01T10:00:00Z').toISOString()
  },
];


export const machinesApi = createApi({
  reducerPath: 'machinesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Machine', 'MonitoringPoint'],
  endpoints: (builder) => ({
    getMachines: builder.query<Machine[], void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: machines };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Machine' as const, id })),
              { type: 'Machine' as const, id: 'LIST' },
            ]
          : [{ type: 'Machine' as const, id: 'LIST' }],
    }),

    createMachine: builder.mutation<Machine, NewMachine>({
      queryFn: async (newMachine) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const id = uuidv4();
        const machine = { ...newMachine, id };
        machines = [...machines, machine];
        return { data: machine };
      },
      invalidatesTags: [{ type: 'Machine', id: 'LIST' }],
    }),
    

    updateMachine: builder.mutation<Machine, Partial<Machine> & Pick<Machine, 'id'>>({
      queryFn: async ({ id, ...patch }) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = machines.findIndex((m) => m.id === id);
        if (index === -1) {
          return { error: { status: 404, data: 'Not found' } };
        }
        const updatedMachine = { ...machines[index], ...patch };
        machines = machines.map((m) => (m.id === id ? updatedMachine : m));
        return { data: updatedMachine };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Machine', id }, { type: 'Machine', id: 'LIST' }],
    }),

    deleteMachine: builder.mutation<void, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const initialLength = machines.length;

        machines = machines.filter((m) => m.id !== id);
        monitoringPointsData = monitoringPointsData.filter(mp => mp.machineId !== id);

        if (machines.length === initialLength) {
          return { error: { status: 404, data: 'Not found' } };
        }
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [{ type: 'Machine', id }, { type: 'Machine', id: 'LIST' }, { type: 'MonitoringPoint', id: 'LIST' }],
    }),

    // --- ENDPOINTS PARA PONTOS DE MONITORAMENTO ---

    createMonitoringPoint: builder.mutation<
      IMonitoringPoint,
      { machineId: string; name: string; sensorModel: SensorModel; lastMaintenanceDate: string }
    >({
      queryFn: async ({ machineId, name, sensorModel, lastMaintenanceDate }) => {
        return new Promise((resolve) => { 
          setTimeout(() => {
            const machine = machines.find((m) => m.id === machineId);
            if (!machine) {
              return resolve({ error: { status: 404, data: 'Máquina não encontrada.' } });
            }

            if (
              machine.type === MachineType.PUMP &&
              (sensorModel === SensorModel.TC_AG || sensorModel === SensorModel.TC_AS)
            ) {
              return resolve({ error: { status: 400, data: 'Sensores TcAg e TcAs não podem ser configurados para máquinas do tipo Bomba.' } });
            }

            let associatedSensor: ISensor;
            switch (sensorModel) {
              case SensorModel.TC_AG: { associatedSensor = { ...mockSensorTcAg, id: uuidv4() }; break; }
              case SensorModel.TC_AS: { associatedSensor = { ...mockSensorTcAs, id: uuidv4() }; break; }
              case SensorModel.HF_PLUS: { associatedSensor = { ...mockSensorHFPlus, id: uuidv4() }; break; }
              default: {
                  return resolve({ error: { status: 400, data: 'Modelo de sensor inválido.' } });
              }
            }

            const newMonitoringPoint: IMonitoringPoint = {
              id: uuidv4(),
              name,
              machineId,
              machineName: machine.name,
              machineType: machine.type,
              sensor: associatedSensor,
              createdAt: new Date().toISOString(),
              lastMaintenanceDate: lastMaintenanceDate,
            };

            monitoringPointsData.push(newMonitoringPoint);
            // Retornar sucesso no formato esperado pelo RTK Query
            resolve({ data: newMonitoringPoint });
          }, 500);
        });
      },
      invalidatesTags: ['MonitoringPoint', { type: 'MonitoringPoint', id: 'LIST' }],
    }),

    updateMonitoringPoint: builder.mutation<
      IMonitoringPoint,
      Partial<IMonitoringPoint> & Pick<IMonitoringPoint, 'id'>
    >({
      queryFn: async (updatedPoint) => {
        return new Promise((resolve) => { // Removido 'reject' aqui
          setTimeout(() => {
            const index = monitoringPointsData.findIndex((mp) => mp.id === updatedPoint.id);
            if (index === -1) {
              return resolve({ error: { status: 404, data: 'Ponto de monitoramento não encontrado.' } });
            }

            const currentPoint = monitoringPointsData[index];

            const machineIdToValidate = updatedPoint.machineId || currentPoint.machineId;
            const machine = machines.find((m) => m.id === machineIdToValidate);
            if (!machine) {
              return resolve({ error: { status: 404, data: 'Máquina associada não encontrada.' } });
            }

            const sensorModelToValidate = updatedPoint.sensor?.model || currentPoint.sensor.model;

            if (
              machine.type === MachineType.PUMP &&
              (sensorModelToValidate === SensorModel.TC_AG || sensorModelToValidate === SensorModel.TC_AS)
            ) {
              return resolve({ error: { status: 400, data: `Não é possível associar sensor '${sensorModelToValidate}' a máquinas do tipo 'Pump'.` } });
            }

            let updatedSensor: ISensor = currentPoint.sensor;
            if (updatedPoint.sensor?.model && updatedPoint.sensor.model !== currentPoint.sensor.model) {
                switch (updatedPoint.sensor.model) {
                    case SensorModel.TC_AG: { updatedSensor = { ...mockSensorTcAg, id: uuidv4() }; break; }
                    case SensorModel.TC_AS: { updatedSensor = { ...mockSensorTcAs, id: uuidv4() }; break; }
                    case SensorModel.HF_PLUS: { updatedSensor = { ...mockSensorHFPlus, id: uuidv4() }; break; }
                    default: {
                        return resolve({ error: { status: 400, data: 'Modelo de sensor inválido para atualização.' } });
                    }
                }
            } else if (updatedPoint.sensor) {
                updatedSensor = { ...currentPoint.sensor, ...updatedPoint.sensor };
            }

            const finalUpdatedPoint: IMonitoringPoint = {
              ...currentPoint,
              ...updatedPoint,
              machineId: machine.id,
              machineName: machine.name,
              machineType: machine.type,
              sensor: updatedSensor,
              createdAt: currentPoint.createdAt,
            };

            monitoringPointsData[index] = finalUpdatedPoint;
            resolve({ data: finalUpdatedPoint });
          }, 500);
        });
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'MonitoringPoint', id }, { type: 'MonitoringPoint', id: 'LIST' }],
    }),

    deleteMonitoringPoint: builder.mutation<void, string>({
        queryFn: async (id) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const initialLength = monitoringPointsData.length;
            monitoringPointsData = monitoringPointsData.filter(mp => mp.id !== id);

            if (monitoringPointsData.length === initialLength) {
                return { error: { status: 404, data: 'Ponto de monitoramento não encontrado.' } };
            }
            return { data: undefined };
        },
        invalidatesTags: (result, error, id) => [{ type: 'MonitoringPoint', id }, { type: 'MonitoringPoint', id: 'LIST' }],
    }),

    getMonitoringPoints: builder.query<
      { data: IMonitoringPoint[]; total: number },
      { page?: number; pageSize?: number; sortBy?: keyof IMonitoringPoint | 'sensorModel'; sortDirection?: 'asc' | 'desc'; searchTerm?: string }
    >({
      queryFn: async ({ page = 0, pageSize = 5, sortBy = 'name', sortDirection = 'asc', searchTerm }) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        let filteredPoints = [...monitoringPointsData];

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
            let valA: string | Date | undefined; // Tipagem mais específica para valores de comparação
            let valB: string | Date | undefined; // Tipagem mais específica para valores de comparação

            switch (sortBy) {
              case 'name':
              case 'machineName':
              case 'machineType':
              case 'createdAt':
              case 'lastMaintenanceDate': {
                valA = a[sortBy];
                valB = b[sortBy];
                break;
              }
              case 'sensorModel': { 
                valA = a.sensor.model;
                valB = b.sensor.model;
                break;
              }
              default: {
                const key = sortBy as keyof IMonitoringPoint;
                valA = typeof a[key] === 'string' ? a[key] as string : undefined;
                valB = typeof b[key] === 'string' ? b[key] as string : undefined;
                break;
              }
            }

            let comparisonResult: number;
            if (sortBy === 'createdAt' || sortBy === 'lastMaintenanceDate') {
                const dateA = valA ? new Date(valA as string) : new Date(0); // 
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

        return { data: { data: paginatedPoints, total } };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'MonitoringPoint' as const, id })),
              { type: 'MonitoringPoint' as const, id: 'LIST' },
            ]
          : [{ type: 'MonitoringPoint' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMachinesQuery,
  useCreateMachineMutation,
  useUpdateMachineMutation,
  useDeleteMachineMutation,
  useCreateMonitoringPointMutation,
  useUpdateMonitoringPointMutation,
  useDeleteMonitoringPointMutation,
  useGetMonitoringPointsQuery,
} = machinesApi;