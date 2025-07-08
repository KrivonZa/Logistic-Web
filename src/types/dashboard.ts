//Company
export type VehicleTripStat = {
  vehicleID: string;
  vehicleNumber: string;
  tripCount: number;
};

export type DriverTripStat = {
  driverID: string;
  fullName: string;
  tripCount: number;
};

export type DriverIncomeStat = {
  driverID: string;
  fullName: string;
  totalIncome: number;
};

export type DashboardCompanyResponse = {
  totalDrivers: number;
  totalVehicles: number;
  totalOrders: number;
  totalTrips: number;
  percentCanceled: number;
  percentCompletedTrips: number;
  companyRevenueThisMonth: number;
  companyTotalRevenue: number;
  orderStatusCountThisMonth: Record<string, number>;
  vehicleTripStatsThisMonth: VehicleTripStat[];
  driverTripStatsThisMonth: DriverTripStat[];
  driverIncomeThisMonth: DriverIncomeStat[];
  topDriverThisMonth: DriverTripStat[];
};

//Admin
export interface CompanyRevenue {
  companyID: string;
  companyName: string;
  totalRevenue: number;
}

export interface TopCompanyDelivery {
  companyID: string;
  companyName: string;
  orderCount: number;
}

export interface AdminDashboardResponse {
  totalCompanies: number;
  totalDrivers: number;
  totalDeliveryOrders: number;
  totalRevenue: number;
  totalRatings: number;
  totalApplications: number;
  companyRevenues: CompanyRevenue[];
  topCompaniesByRevenue: CompanyRevenue[];
  topCompaniesByDeliveryCount: TopCompanyDelivery[];
}