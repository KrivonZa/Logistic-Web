export type VehicleStatus = "active" | "inactive";

export interface Vehicles {
  vehicleID: string;
  companyID: string;
  vehicleNumber: string;
  vehicleImage: string;
  loadCapacity: number;
  updatedAt: string;
  companyName: string;
  status: VehicleStatus;
}
