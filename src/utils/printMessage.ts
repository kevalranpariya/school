export const notFoundMessage = (name: string):string => {
  return `${name} not found`;
};

export const notAccessMessage = (name: string):string => {
  return `Can not access this ${name}`;
};

export const notAssignMessage = (name: string): string => {
  return `This ${name} already assign`;
};

export const passwordLengthMessage: string = 'Password length between 7 & 14 char';

export const usernameUniqueMessage: string = 'Username must be unique';

export const successMessage: string = 'Operation successfully done';