export interface createRoute {
  routeID: string;
  routeName: string;
  waypoints: createWaypoints[];
}

export interface createWaypoints {
  locationLatitude: string;
  locationLongtitude: string;
  locationName: string;
  index: number;
}
