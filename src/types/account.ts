export interface Login {
  email: string;
  password: string;
}

export interface BusinessRegister {
  email: string;
  fullName: string;
  password: string;
  taxCode: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  bankAccount: string;
  license: File;
}

export interface Account {
  accountID: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
  detail?: Record<string, any>;
}
