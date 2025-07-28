import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Machine, NewMachine, IMonitoringPoint } from '@/types/machine';
import { MachineType } from '@/types/machine';
import { ISensor, SensorModel } from '@/types/sensor';

// Mocks de Sensores - APENAS OS ESPECIFICADOS NO REQUISITO
const mockSensorHFPlus: ISensor = {
  id: 's-hfplus-003',
  model: SensorModel.HF_PLUS,
  imageUrl: '/assets/assets-desafio-01/sensor-hf.png'
};
const mockSensorTcAg: ISensor = {
  id: 's-tcag-001',
  model: SensorModel.TC_AG,
  imageUrl: '/assets/assets-desafio-01/sensor-tca.png' 
};
const mockSensorTcAs: ISensor = {
  id: 's-tcas-002',
  model: SensorModel.TC_AS,
  imageUrl: '/assets/assets-desafio-01/sensor-tca.png'
};


// Dados iniciais das máquinas, COM PONTOS DE MONITORAMENTO
// respeitando a regra de negócio (Pump não pode ter TcAg/TcAs)
let machines: Machine[] = [
  {
    id: '1',
    name: 'Máquina Principal A',
    type: MachineType.PUMP,
    monitoringPoints: [
      { id: 'mp-1-1', machineId: '1', name: 'Ponto Primário A', sensor: mockSensorHFPlus }, 
      { id: 'mp-1-2', machineId: '1', name: 'Ponto Secundário A', sensor: mockSensorHFPlus }, 
      { id: 'mp-1-3', machineId: '1', name: 'Ponto Extra A', sensor: mockSensorHFPlus }, 
    ],
  },
  {
    id: '2',
    name: 'Máquina de Ventilação B',
    type: MachineType.FAN,
    monitoringPoints: [
      { id: 'mp-2-1', machineId: '2', name: 'Entrada B', sensor: mockSensorTcAg },
      { id: 'mp-2-2', machineId: '2', name: 'Saída B', sensor: mockSensorTcAs },
    ],
  },
  {
    id: '3',
    name: 'Máquina de Fluido C',
    type: MachineType.PUMP,
    monitoringPoints: [
      { id: 'mp-3-1', machineId: '3', name: 'Ponto Crítico C', sensor: mockSensorHFPlus },
      { id: 'mp-3-2', machineId: '3', name: 'Ponto Auxiliar C', sensor: mockSensorHFPlus }, 
    ],
  },
  {
    id: '4',
    name: 'Máquina de Processamento D',
    type: MachineType.FAN,
    monitoringPoints: [
      { id: 'mp-4-1', machineId: '4', name: 'Ponto 1 D', sensor: mockSensorTcAg }, 
      { id: 'mp-4-2', machineId: '4', name: 'Ponto 2 D', sensor: mockSensorTcAs },
      { id: 'mp-4-3', machineId: '4', name: 'Ponto 3 D', sensor: mockSensorTcAg }, 
    ],
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

        const id = String(Date.now());
        const machine = { ...newMachine, id, monitoringPoints: [] }; 

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

        // Ao deletar uma máquina, seus pontos de monitoramento também são removidos
        machines = machines.filter((m) => m.id !== id);

        if (machines.length === initialLength) {
            return { error: { status: 404, data: 'Not found' } };
        }
        return { data: undefined };
      },
      invalidatesTags: (result, error, id) => [{ type: 'Machine', id }, { type: 'Machine', id: 'LIST' }, { type: 'MonitoringPoint', id: 'LIST' }],
    }),
    

    // createMonitoringPoint agora pode receber um sensor opcional
    createMonitoringPoint: builder.mutation<
      IMonitoringPoint,
      { machineId: string; name: string; sensor?: ISensor | null } 
    >({
      queryFn: async ({ machineId, name, sensor }) => { // Destruturado o 'sensor'
        await new Promise(resolve => setTimeout(resolve, 500));

        const machineIndex = machines.findIndex(m => m.id === machineId);
        if (machineIndex === -1) {
          return { error: { status: 404, data: 'Machine not found' } };
        }

        // --- REGRA DE NEGÓCIO: Prevenir TcAg/TcAs para máquinas tipo Pump ---
        const machineType = machines[machineIndex].type;
        if (sensor && machineType === MachineType.PUMP && (
            sensor.model === SensorModel.TC_AG ||
            sensor.model === SensorModel.TC_AS
        )) {
          return { error: { status: 400, data: `Não é possível associar sensor '${sensor.model}' a máquinas do tipo 'Pump'.` } };
        }

        const newMonitoringPoint: IMonitoringPoint = {
          id: String(Date.now()),
          machineId,
          name,
          sensor: sensor || null, 
        };

        const updatedMachine = {
          ...machines[machineIndex],
          monitoringPoints: [...machines[machineIndex].monitoringPoints, newMonitoringPoint],
        };

        machines = machines.map((m, index) =>
          index === machineIndex ? updatedMachine : m
        );

        return { data: newMonitoringPoint };
      },
      invalidatesTags: (result) => result ? [{ type: 'MonitoringPoint', id: 'LIST' }, { type: 'Machine', id: result.machineId }] : [],
    }),

    associateSensor: builder.mutation<IMonitoringPoint, { monitoringPointId: string; sensor: ISensor }>({
      queryFn: async ({ monitoringPointId, sensor }) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        let foundMonitoringPoint: IMonitoringPoint | undefined;
        let machineId: string | undefined;
        let machineType: MachineType | undefined;
        let machineIndex: number = -1;
        let monitoringPointIndex: number = -1;

        // Encontra a máquina e o ponto de monitoramento associado
        const machine = machines.find(m => {
          const mpIndex = m.monitoringPoints.findIndex(mp => mp.id === monitoringPointId);
          if (mpIndex !== -1) {
            foundMonitoringPoint = m.monitoringPoints[mpIndex];
            monitoringPointIndex = mpIndex;
            return true;
          }
          return false;
        });

        if (machine) {
          machineId = machine.id;
          machineType = machine.type;
          machineIndex = machines.indexOf(machine);
        }

        if (!foundMonitoringPoint || !machineId || !machineType || machineIndex === -1 || monitoringPointIndex === -1) {
          return { error: { status: 404, data: 'Monitoring Point not found' } };
        }

        // --- REGRA DE NEGÓCIO: Prevenir TcAg/TcAs para máquinas tipo Pump ---
        if (machineType === MachineType.PUMP && (
            sensor.model === SensorModel.TC_AG ||
            sensor.model === SensorModel.TC_AS
        )) {
          return { error: { status: 400, data: `Não é possível associar sensor '${sensor.model}' a máquinas do tipo 'Pump'.` } };
        }

        const updatedMonitoringPoint: IMonitoringPoint = {
          ...foundMonitoringPoint,
          sensor: sensor, // Associa o novo sensor
        };

        const updatedMachine = { ...machines[machineIndex] };
        updatedMachine.monitoringPoints = updatedMachine.monitoringPoints.map((mp, index) =>
          index === monitoringPointIndex ? updatedMonitoringPoint : mp
        );

        machines = machines.map((m, index) =>
          index === machineIndex ? updatedMachine : m
        );

        return { data: updatedMonitoringPoint };
      },
      invalidatesTags: (result) => result ? [{ type: 'MonitoringPoint', id: result.id }, { type: 'MonitoringPoint', id: 'LIST' }, { type: 'Machine', id: result.machineId }] : [],
    }),

    getMonitoringPoints: builder.query<
      { data: (IMonitoringPoint & { machineName: string; machineType: MachineType; sensorModel?: SensorModel })[]; total: number },
      { page?: number; pageSize?: number; sortBy?: keyof IMonitoringPoint | 'machineName' | 'machineType' | 'sensorModel'; sortDirection?: 'asc' | 'desc'; searchTerm?: string }
    >({
      queryFn: async ({ page = 0, pageSize = 5, sortBy = 'name', sortDirection = 'asc', searchTerm }) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const allMonitoringPoints: (IMonitoringPoint & { machineName: string; machineType: MachineType; sensorModel?: SensorModel })[] =
          machines.flatMap(machine =>
            machine.monitoringPoints.map(mp => ({
              ...mp,
              machineName: machine.name,
              machineType: machine.type,
              sensorModel: mp.sensor?.model,
            }))
          );

        // --- Lógica de FILTRAGEM ---
        let filteredPoints = allMonitoringPoints;
        if (searchTerm) {
          const lowerCaseSearchTerm = searchTerm.toLowerCase();
          filteredPoints = allMonitoringPoints.filter(point =>
            point.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            point.machineName.toLowerCase().includes(lowerCaseSearchTerm) ||
            point.machineType.toLowerCase().includes(lowerCaseSearchTerm) ||
            (point.sensorModel && point.sensorModel.toLowerCase().includes(lowerCaseSearchTerm))
          );
        }

        // --- Lógica de ORDENAÇÃO ---
        const sortedPoints = [...filteredPoints];
        if (sortBy) {
          sortedPoints.sort((a, b) => {
            let valA: string | undefined;
            let valB: string | undefined;

            switch (sortBy) {
              case 'name':
              case 'machineName': {
                valA = a.machineName;
                valB = b.machineName;
                break;
              }
              case 'machineType': {
                valA = a.machineType;
                valB = b.machineType;
                break;
              }
              case 'sensorModel': {
                valA = a.sensorModel || '';
                valB = b.sensorModel || '';
                break;
              }
              default: {
                const key = sortBy as keyof IMonitoringPoint;
                if (key in a && key in b) {
                    valA = String(a[key]);
                    valB = String(b[key]);
                } else {
                    valA = undefined;
                    valB = undefined;
                }
                break;
              }
            }

            if (valA === undefined && valB === undefined) return 0;
            if (valA === undefined) return sortDirection === 'asc' ? 1 : -1;
            if (valB === undefined) return sortDirection === 'asc' ? -1 : 1;

            if (typeof valA === 'string' && typeof valB === 'string') {
              return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
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
  useAssociateSensorMutation,
  useGetMonitoringPointsQuery,
} = machinesApi;