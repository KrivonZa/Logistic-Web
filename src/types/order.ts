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

export type Customer = {
  fullName: string;
  phoneNumber: string;
  avatar: string;
  address: string;
};

export type Route = {
  routeName: string;
};

export type Package = {
  packageName: string;
  packageImage: string;
  packageWeight: number;
  note: string;
};

export type Waypoint = {
  location: string;
};

export type DeliveryOrderDetail = {
  orderID: string;
  customer: Customer;
  route: Route;
  package: Package;
  pickUpPoint: Waypoint;
  dropDownPoint: Waypoint;
  price: number;
  pickUpImage: string;
  dropDownImage: string;
  payloadNote: string;
  status: string;
  createdAt: string;
};

export type UpdateOrder = {
  orderID: string;
  status: string;
};

export enum delivery_status {
  reject = "reject",
  pending = "pending",
  unpaid = "unpaid",
  paid = "paid",
  scheduled = "scheduled",
  in_progress = "in_progress",
  delivered = "delivered",
  canceled = "canceled",
}
