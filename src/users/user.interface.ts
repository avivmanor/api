export interface User {
  id: number;
  username: string;
  steps: number;
  gender: GenderEnum;
  nationality: string;
  location: any;
  phone: string;
  email: string;
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  UNDETERMINED = 'undetermined',
}
