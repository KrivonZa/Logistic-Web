"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import polyline from "@mapbox/polyline";
import { Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import axios from "axios";
import { useAppDispatch } from "@/stores";
import { getRoutesByCompany } from "@/stores/routeManager/thunk";
import { useRoute } from "@/hooks/useRoute";
import { Routes, Waypoint } from "@/types/route";
import debounce from "lodash/debounce";

const RouteManagement = () => {
  const [selectedRoute, setSelectedRoute] = useState<Routes | null>(null);
  const [newLocation, setNewLocation] = useState("");
  const [suggestions, setSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const [GoongMap, setGoongMap] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Record<string, any>>({});
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, routes } = useRoute();

  const goongApiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY!;
  const goongMaptilesKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY!;

  // Debounced function to fetch location suggestions
  const fetchSuggestions = debounce(async (input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
        params: {
          api_key: goongApiKey,
          input,
          location: "10.776889,106.700806",
        },
      });
      setSuggestions(res.data.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  }, 300);

  // Fetch routes on mount
  useEffect(() => {
    dispatch(getRoutesByCompany({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Initialize Goong Map
  useEffect(() => {
    if (!mapContainer.current) return;

    let map: any;
    import("@goongmaps/goong-js").then((mod) => {
      const goong = mod.default;
      goong.accessToken = goongMaptilesKey;

      map = new goong.Map({
        container: mapContainer.current!,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [106.700806, 10.776889],
        zoom: 13,
      });

      mapRef.current = map;

      setGoongMap({
        ...goong,
        Marker: mod.Marker,
        Popup: mod.Popup,
        LngLatBounds: mod.LngLatBounds,
      });
    });

    return () => {
      if (map) map.remove();
    };
  }, []);

  // Draw route on map
  const drawRoute = async () => {
    if (
      !GoongMap ||
      !mapRef.current ||
      !selectedRoute ||
      !Array.isArray(selectedRoute.Waypoint) ||
      selectedRoute.Waypoint.length < 2
    ) {
      if (mapRef.current?.getLayer("route")) {
        mapRef.current.removeLayer("route");
      }
      if (mapRef.current?.getSource("route")) {
        mapRef.current.removeSource("route");
      }
      Object.values(markers).forEach((m) => m.remove());
      setMarkers({});
      return;
    }

    try {
      // Remove old layer and source
      if (mapRef.current.getLayer("route")) {
        mapRef.current.removeLayer("route");
      }
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeSource("route");
      }

      // Remove old markers
      Object.values(markers).forEach((m) => m.remove());
      setMarkers({});

      // Filter valid waypoints
      const validWaypoints = selectedRoute.Waypoint.filter((wp) => {
        if (!wp.geoLocation || typeof wp.geoLocation !== "string") return false;
        try {
          const geo = JSON.parse(wp.geoLocation);
          return (
            geo.type === "Point" &&
            Array.isArray(geo.coordinates) &&
            geo.coordinates.length === 2 &&
            !isNaN(geo.coordinates[0]) &&
            !isNaN(geo.coordinates[1])
          );
        } catch {
          return false;
        }
      });

      if (validWaypoints.length < 2) {
        console.warn("Not enough valid waypoints to draw route");
        return;
      }

      // Add new markers
      const newMarkers: Record<string, any> = {};
      validWaypoints.forEach((wp, i) => {
        const geo = JSON.parse(wp.geoLocation);
        const [lng, lat] = geo.coordinates;
        const marker = new GoongMap.Marker({ color: "#1976d2" })
          .setLngLat([lng, lat])
          .setPopup(new GoongMap.Popup().setText(`Điểm ${i + 1}`))
          .addTo(mapRef.current);
        newMarkers[`wp-${i}`] = marker;
      });
      setMarkers(newMarkers);

      // Fetch route coordinates
      let allCoords: number[][] = [];
      for (let i = 0; i < validWaypoints.length - 1; i++) {
        const start = validWaypoints[i];
        const end = validWaypoints[i + 1];

        const startGeo = JSON.parse(start.geoLocation);
        const endGeo = JSON.parse(end.geoLocation);
        const origin = `${startGeo.coordinates[1]},${startGeo.coordinates[0]}`; // lat,lng
        const destination = `${endGeo.coordinates[1]},${endGeo.coordinates[0]}`; // lat,lng

        const res = await axios.get("https://rsapi.goong.io/Direction", {
          params: {
            origin,
            destination,
            vehicle: "car",
            optimize: false,
            api_key: goongApiKey,
          },
        });

        const route = res.data.routes?.[0];
        if (!route) {
          console.warn(`No route from point ${i} to ${i + 1}`);
          continue;
        }

        const coordsSegment = polyline.decode(route.overview_polyline.points);
        if (i === 0) {
          allCoords.push(...coordsSegment);
        } else {
          allCoords.push(...coordsSegment.slice(1));
        }
      }

      if (allCoords.length === 0) {
        console.warn("No coordinates to draw route");
        return;
      }

      // Draw route
      const geoJSON = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: allCoords.map(([lat, lng]) => [lng, lat]),
        },
      };

      mapRef.current.addSource("route", {
        type: "geojson",
        data: geoJSON,
      });

      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#1e88e5",
          "line-width": 8,
        },
      });

      // Adjust map bounds
      const bounds = validWaypoints.reduce((b, wp) => {
        const geo = JSON.parse(wp.geoLocation);
        const [lng, lat] = geo.coordinates;
        return b.extend([lng, lat]);
      }, new GoongMap.LngLatBounds(JSON.parse(validWaypoints[0].geoLocation).coordinates, JSON.parse(validWaypoints[0].geoLocation).coordinates));
      mapRef.current.fitBounds(bounds, { padding: 60 });
    } catch (error) {
      console.error("Error drawing route:", error);
    }
  };

  // Update route when selectedRoute or GoongMap changes
  useEffect(() => {
    if (GoongMap && selectedRoute) {
      drawRoute();
    }
  }, [selectedRoute, GoongMap]);

  // Add location by name
  const handleAddLocationByName = async (placeId: string) => {
    if (!selectedRoute) return;

    try {
      const detailRes = await axios.get("https://rsapi.goong.io/Place/Detail", {
        params: {
          api_key: goongApiKey,
          place_id: placeId,
        },
      });

      const { lat, lng } = detailRes.data.result.geometry.location;
      const newWaypoint: Waypoint = {
        waypointID: `wp-${Date.now()}`,
        routeID: selectedRoute.routeID,
        geoLocation: JSON.stringify({
          type: "Point",
          coordinates: [lng, lat],
        }),
        index: selectedRoute.Waypoint.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSelectedRoute({
        ...selectedRoute,
        Waypoint: [...selectedRoute.Waypoint, newWaypoint],
      });
      setNewLocation("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error finding location:", error);
      alert("An error occurred while finding the location.");
    }
  };

  const handleSelectRoute = (route: Routes) => {
    typeof console.log("Type of Waypoint:", route.Waypoint);
    if (route && Array.isArray(route.Waypoint)) {
      setSelectedRoute(route);
    } else {
      console.warn("Invalid route:", route);
      setSelectedRoute(null);
    }
  };

  // Move waypoint up
  const handleMoveUp = (index: number) => {
    if (!selectedRoute || index === 0) return;
    const updatedWaypoints = [...selectedRoute.Waypoint];
    [updatedWaypoints[index - 1], updatedWaypoints[index]] = [
      { ...updatedWaypoints[index], index: index - 1 },
      { ...updatedWaypoints[index - 1], index },
    ];
    setSelectedRoute({ ...selectedRoute, Waypoint: updatedWaypoints });
  };

  const handleMoveDown = (index: number) => {
    if (!selectedRoute || index === selectedRoute.Waypoint.length - 1) return;
    const updatedWaypoints = [...selectedRoute.Waypoint];
    [updatedWaypoints[index], updatedWaypoints[index + 1]] = [
      { ...updatedWaypoints[index + 1], index },
      { ...updatedWaypoints[index], index: index + 1 },
    ];
    setSelectedRoute({ ...selectedRoute, Waypoint: updatedWaypoints });
  };

  // Delete location
  const handleDeleteLocation = (index: number) => {
    if (!selectedRoute) return;
    const updatedWaypoints = selectedRoute.Waypoint.filter(
      (_, i) => i !== index
    ).map((wp, i) => ({ ...wp, index: i }));
    setSelectedRoute({ ...selectedRoute, Waypoint: updatedWaypoints });
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-12 max-w-screen-2xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Quản lý tuyến đường</h2>
        <Button onClick={() => router.push("/company/create-route")}>
          <Plus className="h-16 w-16 text-white" /> Tạo tuyến mới
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route list */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tuyến đường</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading routes...</p>
            ) : Array.isArray(routes) && routes.length > 0 ? (
              <ScrollArea className="max-h-[300px] space-y-2">
                {routes.map((route) => (
                  <Button
                    key={route.routeID}
                    variant={
                      selectedRoute?.routeID === route.routeID
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => handleSelectRoute(route)}
                  >
                    {route.routeName}
                  </Button>
                ))}
              </ScrollArea>
            ) : (
              <p>No routes available.</p>
            )}
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Bản đồ tuyến đường</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-md">
              <div
                ref={mapContainer}
                className="h-full w-full rounded-md z-0"
              />
            </div>

            {selectedRoute && (
              <div className="mt-4 space-y-2">
                <Label>Thêm địa điểm bằng tên:</Label>
                <Command>
                  <CommandInput
                    placeholder="Nhập địa điểm (ví dụ: Ho Chi Minh City)"
                    value={newLocation}
                    onValueChange={(value: any) => {
                      setNewLocation(value);
                      fetchSuggestions(value);
                    }}
                  />
                  <CommandList>
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.place_id}
                          onSelect={() =>
                            handleAddLocationByName(suggestion.place_id)
                          }
                        >
                          {suggestion.description}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandEmpty>Không tìm thấy địa điểm.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Route details */}
      {selectedRoute && Array.isArray(selectedRoute.Waypoint) && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết {selectedRoute.routeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Danh sách địa điểm:</h4>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {selectedRoute.Waypoint.map((wp, idx) => {
                  let coordinates: string = "Invalid";
                  try {
                    const geo = JSON.parse(wp.geoLocation);
                    coordinates = `(${geo.coordinates[1]}, ${geo.coordinates[0]})`;
                  } catch {
                    console.warn(
                      `Invalid geoLocation for waypoint ${wp.waypointID}`
                    );
                  }
                  return (
                    <li
                      key={wp.waypointID}
                      className="flex items-center justify-between"
                    >
                      <span>
                        Điểm {idx + 1} {coordinates}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === selectedRoute.Waypoint.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteLocation(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Separator />
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RouteManagement;
