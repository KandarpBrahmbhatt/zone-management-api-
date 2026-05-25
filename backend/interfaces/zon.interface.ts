export interface IUser {
  name: string;
  email: string;
  password: string;
  age?: number;
  isActive: boolean;
}

export interface IZone {
  zoneName: string;
  prefix: string;
  zoneCode: string;
  waterValue: number;
  markupValue: number;
  increasePercentage: number;
  description?: string;
  status: boolean;
}