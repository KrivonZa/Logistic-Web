export interface Login {
  email: string;
  password: string;
}

export interface Account {
  accountID: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
  detail?: Record<string, any>;
}
