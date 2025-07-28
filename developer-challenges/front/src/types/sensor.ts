export enum SensorModel {
  TC_AG = 'TcAg', 
  TC_AS = 'TcAs',
  HF_PLUS = 'HF+'
}

export interface ISensor {
  id: string;
  model: SensorModel; 
  imageUrl?: string;
}
