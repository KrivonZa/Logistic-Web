export interface createRoute {
  routeName: string;
  waypoints: createWaypoints[];
}

export interface createWaypoints {
  id: string;
  locationLatitude: string;
  locationLongtitude: string;
  locationName: string;
  index: number;
}

export interface Waypoint {
  waypointID: string;
  routeID: string;
  location: string;
  index: number;
  createdAt: string;
  updatedAt: string;
  geoLocation: string;
}

export interface Routes {
  routeID: string;
  companyID: string;
  routeName: string;
  createdAt: string;
  updatedAt: string;
  Waypoint: Waypoint[];
}
