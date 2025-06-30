export type AccountInfo = {
  accountID: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
};

export type ApplicationResponse = {
  applicationID: string;
  senderID: string;
  adminID: string;
  createdAt: string;
  reviewedAt: string | null;
  senderNote: string;
  senderFileUrl: string;
  adminNote: string | null;
  adminFileUrl: string | null;
  status: string;
  type: string;
  sender: AccountInfo;
  admin: AccountInfo;
};
