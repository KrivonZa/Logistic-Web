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
  status: string;
  balance: number;
  detail?: Record<string, any>;
}

export interface Driver {
  driverID: string;
  phoneNumber: string;
  identityNumber: string;
  licenseNumber: string;
  licenseLevel: string;
  licenseExpiry: string;
  updatedAt: string;
  account: Account;
}

export interface BaseAccount {
  accountID: string;
  email: string;
  fullName: string;
  avatar: string;
  status: string;
  role: string;
}

export interface CustomerDetail {
  customerID: string;
  phoneNumber: string;
  address: string;
  updatedAt: string;
}

export interface DriverDetail {
  driverID: string;
  phoneNumber: string;
  identityNumber: string;
  licenseNumber: string;
  licenseLevel: string;
  licenseExpiry: string;
  companyID: string;
  updatedAt: string;
  companyName: string;
}

export interface CompanyDetail {
  companyID: string;
  taxCode: string;
  legalRep: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  bankAccount: string;
  license: string;
  updatedAt: string;
}

export interface AccountWithRoleDetail extends BaseAccount {
  detail: CustomerDetail | DriverDetail | CompanyDetail;
}
