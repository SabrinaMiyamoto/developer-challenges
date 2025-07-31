export enum SensorModel {
  TC_AG = 'TcAg',
  TC_AS = 'TcAs',
  HF_PLUS = 'HF+',
}

export class Sensor {
  id: string;
  model: SensorModel;
  imageUrl?: string;
}