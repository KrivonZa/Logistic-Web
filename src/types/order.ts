export interface Orders {
  orderID: string;
  customerID: string;
  routeID: string;
  packageID: string;
  pickUpPointID: string;
  dropDownPointID: string;
  price: number;
  companyID: string;
  pickUpImage: string | null;
  dropDownImage: string | null;
  payloadNote: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
