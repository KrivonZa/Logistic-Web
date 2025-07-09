"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import polyline from "@mapbox/polyline";
import {
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Edit,
  Save,
  MapPin,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { useAppDispatch } from "@/stores";
import { useRoute } from "@/hooks/useRoute";
import { getRoutesByCompany } from "@/stores/routeManager/thunk";
import { Routes, Waypoint } from "@/types/route";
import debounce from "lodash/debounce";
import goong, { Map, Marker } from "@goongmaps/goong-js";
import type { FeatureCollection } from "geojson";
import { toast } from "sonner";

const RouteManagement = () => {
  const [selectedRoute, setSelectedRoute] = useState<Routes | null>(null);
  const [newLocation, setNewLocation] = useState("");
  const [suggestions, setSuggestions] = useState<
    { place_id: string; description: string }[]
  >([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [goongMap, setGoongMap] = useState<typeof goong | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [markers, setMarkers] = useState<Record<string, Marker>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null);
  const [editLocationName, setEditLocationName] = useState<string>();
  const [pendingWaypoints, setPendingWaypoints] = useState<Waypoint[]>([]);
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, routes } = useRoute();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const goongApiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY!;
  const goongMaptilesKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY!;

  const fetchSuggestions = useCallback(
    debounce(async (input: string) => {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          "https://rsapi.goong.io/Place/AutoComplete",
          {
            params: {
              api_key: goongApiKey,
              input,
              location: "10.776889,106.700806",
            },
          }
        );
        setSuggestions(res.data.predictions || []);
      } catch {
        setSuggestions([]);
      }
    }, 300),
    [goongApiKey]
  );

  useEffect(() => {
    dispatch(getRoutesByCompany({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (!mapContainer.current) return;

    import("@goongmaps/goong-js").then((mod) => {
      const goong = mod.default;
      goong.accessToken = goongMaptilesKey;

      const map = new goong.Map({
        container: mapContainer.current!,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [106.700806, 10.776889],
        zoom: 10,
      });

      mapRef.current = map;
      setGoongMap(goong); // ✅ đúng rồi
    });
  }, []);

  const drawRoute = useCallback(async () => {
    if (
      !goongMap ||
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
      if (mapRef.current.getLayer("route")) {
        mapRef.current.removeLayer("route");
      }
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeSource("route");
      }

      Object.values(markers).forEach((m) => m.remove());
      setMarkers({});

      const validWaypoints = [
        ...selectedRoute.Waypoint,
        ...pendingWaypoints,
      ].filter((wp): wp is Waypoint & { geoLocation: string } => {
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
        return;
      }

      const newMarkers: Record<string, Marker> = {};
      validWaypoints.forEach((wp, i) => {
        const geo = JSON.parse(wp.geoLocation);
        const [lng, lat] = geo.coordinates;
        const marker = new goongMap.Marker({
          color:
            i === 0
              ? "#ff0000"
              : i === validWaypoints.length - 1
              ? "#00ff00"
              : "#1976d2",
        })
          .setLngLat([lng, lat])
          .setPopup(
            new goongMap.Popup().setHTML(
              `<strong>${
                wp.location || `Point ${i + 1}`
              }</strong><br>(${lat.toFixed(4)}, ${lng.toFixed(4)})`
            )
          )
          .addTo(mapRef.current!);
        newMarkers[`wp-${i}`] = marker;
      });
      setMarkers(newMarkers);

      const allCoords = await validWaypoints.reduce(
        async (coordsPromise, _, i) => {
          const coords = await coordsPromise;
          if (i >= validWaypoints.length - 1) return coords;

          const start = validWaypoints[i];
          const end = validWaypoints[i + 1];

          const startGeo = JSON.parse(start.geoLocation);
          const endGeo = JSON.parse(end.geoLocation);
          const origin = `${startGeo.coordinates[1]},${startGeo.coordinates[0]}`;
          const destination = `${endGeo.coordinates[1]},${endGeo.coordinates[0]}`;

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
            return coords;
          }

          const coordsSegment = polyline.decode(route.overview_polyline.points);
          return i === 0
            ? [...coords, ...coordsSegment]
            : [...coords, ...coordsSegment.slice(1)];
        },
        Promise.resolve([] as [number, number][])
      );

      if (allCoords.length === 0) {
        return;
      }

      const geoJSON: FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: allCoords.map(([lat, lng]) => [lng, lat]),
            },
            properties: {},
          },
        ],
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
          "line-color": "#3b82f6",
          "line-width": 6,
          "line-opacity": 0.8,
        },
      });

      const bounds = validWaypoints.reduce((b, wp) => {
        const geo = JSON.parse(wp.geoLocation);
        const [lng, lat] = geo.coordinates;
        return b.extend([lng, lat]);
      }, new goongMap.LngLatBounds(JSON.parse(validWaypoints[0].geoLocation).coordinates, JSON.parse(validWaypoints[0].geoLocation).coordinates));
      mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 15 });
    } catch {}
  }, [goongMap, mapRef, selectedRoute, pendingWaypoints, goongApiKey]);

  useEffect(() => {
    if (goongMap && selectedRoute) {
      drawRoute();
    }
  }, [goongMap, selectedRoute, pendingWaypoints, drawRoute]);

  const handleAddLocationByName = useCallback(
    async (placeId: string) => {
      if (!selectedRoute) return;

      try {
        const detailRes = await axios.get(
          "https://rsapi.goong.io/Place/Detail",
          {
            params: {
              api_key: goongApiKey,
              place_id: placeId,
            },
          }
        );

        const { lat, lng } = detailRes.data.result.geometry.location;
        const newWaypoint: Waypoint = {
          waypointID: `wp-${Date.now()}`,
          routeID: selectedRoute.routeID,
          location:
            detailRes.data.result.name ||
            detailRes.data.result.formatted_address,
          geoLocation: JSON.stringify({
            type: "Point",
            coordinates: [lng, lat],
          }),
          index: selectedRoute.Waypoint.length + pendingWaypoints.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPendingWaypoints((prev) => [...prev, newWaypoint]);
        setIsUpdateNeeded(true);
        setNewLocation("");
        setSuggestions([]);
      } catch (error) {
        toast.error("Lỗi thêm tuyến đường", {
          description: error instanceof Error ? error.message : String(error),
        });
      }
    },
    [goongApiKey, selectedRoute, pendingWaypoints]
  );

  const handleSelectRoute = useCallback((route: Routes) => {
    if (route && Array.isArray(route.Waypoint)) {
      setSelectedRoute(route);
      setPendingWaypoints([]);
      setIsUpdateNeeded(false);
      setIsSidebarOpen(false);
    } else {
      setSelectedRoute(null);
      setPendingWaypoints([]);
      setIsUpdateNeeded(false);
    }
  }, []);

  const handleMoveUp = useCallback(
    (index: number) => {
      if (!selectedRoute || index === 0) return;
      const allWaypoints = [...selectedRoute.Waypoint, ...pendingWaypoints];
      [allWaypoints[index - 1], allWaypoints[index]] = [
        { ...allWaypoints[index], index: index - 1 },
        { ...allWaypoints[index - 1], index },
      ];
      const savedCount = selectedRoute.Waypoint.length;
      setSelectedRoute({
        ...selectedRoute,
        Waypoint: allWaypoints.slice(0, savedCount),
      });
      setPendingWaypoints(allWaypoints.slice(savedCount));
      setIsUpdateNeeded(true);
    },
    [selectedRoute, pendingWaypoints]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (
        !selectedRoute ||
        index === selectedRoute.Waypoint.length + pendingWaypoints.length - 1
      )
        return;
      const allWaypoints = [...selectedRoute.Waypoint, ...pendingWaypoints];
      [allWaypoints[index], allWaypoints[index + 1]] = [
        { ...allWaypoints[index + 1], index },
        { ...allWaypoints[index], index: index + 1 },
      ];
      const savedCount = selectedRoute.Waypoint.length;
      setSelectedRoute({
        ...selectedRoute,
        Waypoint: allWaypoints.slice(0, savedCount),
      });
      setPendingWaypoints(allWaypoints.slice(savedCount));
      setIsUpdateNeeded(true);
    },
    [selectedRoute, pendingWaypoints]
  );

  const handleDeleteLocation = useCallback(
    (index: number) => {
      if (!selectedRoute) return;
      const allWaypoints = [...selectedRoute.Waypoint, ...pendingWaypoints];
      allWaypoints.splice(index, 1);
      const savedCount = selectedRoute.Waypoint.length;
      setSelectedRoute({
        ...selectedRoute,
        Waypoint: allWaypoints
          .slice(0, savedCount)
          .map((wp, i) => ({ ...wp, index: i })),
      });
      setPendingWaypoints(
        allWaypoints
          .slice(savedCount)
          .map((wp, i) => ({ ...wp, index: savedCount + i }))
      );
      setIsUpdateNeeded(true);
    },
    [selectedRoute, pendingWaypoints]
  );

  const handleEditWaypoint = useCallback((waypoint: Waypoint) => {
    setEditingWaypoint(waypoint);
    setEditLocationName(waypoint.location || "");
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!selectedRoute || !editingWaypoint || !editLocationName?.trim()) {
      alert("Location name cannot be empty!");
      return;
    }

    const allWaypoints = [...selectedRoute.Waypoint, ...pendingWaypoints];
    const updatedWaypoints = allWaypoints.map((wp) =>
      wp.waypointID === editingWaypoint.waypointID
        ? {
            ...wp,
            location: editLocationName,
            updatedAt: new Date().toISOString(),
          }
        : wp
    );

    const savedCount = selectedRoute.Waypoint.length;
    setSelectedRoute({
      ...selectedRoute,
      Waypoint: updatedWaypoints.slice(0, savedCount),
    });
    setPendingWaypoints(updatedWaypoints.slice(savedCount));
    setIsUpdateNeeded(true);
    setEditingWaypoint(null);
    setEditLocationName("");
  }, [selectedRoute, editingWaypoint, editLocationName, pendingWaypoints]);

  const handleUpdateRoute = useCallback(() => {
    if (!selectedRoute) return;
    setSelectedRoute({
      ...selectedRoute,
      Waypoint: [...selectedRoute.Waypoint, ...pendingWaypoints].map(
        (wp, i) => ({
          ...wp,
          index: i,
        })
      ),
    });
    setPendingWaypoints([]);
    setIsUpdateNeeded(false);
  }, [selectedRoute, pendingWaypoints]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || (routes && page > Math.ceil(routes.total / routes.limit)))
        return;
      setCurrentPage(page);
      setSelectedRoute(null);
      setPendingWaypoints([]);
      setIsUpdateNeeded(false);
      setIsSidebarOpen(false);
    },
    [routes]
  );

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý tuyến đường
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
              onClick={() => router.push("/company/create-route")}
            >
              <Plus className="h-5 w-5 mr-2" /> Tạo tuyến đường mới
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card
            className={`lg:col-span-1 transition-all duration-300 ${
              isSidebarOpen ? "block" : "hidden lg:block"
            }`}
          >
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold">
                Danh sách tuyến đường
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 py-2">
              <div className="flex flex-col space-y-6 w-full">
                <div className="rounded-xl overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-280px)] w-full">
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                      </div>
                    ) : routes && routes.data.length > 0 ? (
                      <div className="flex flex-col gap-3 p-4">
                        {routes.data.map((route) => (
                          <Button
                            key={route.routeID}
                            variant={
                              selectedRoute?.routeID === route.routeID
                                ? "default"
                                : "ghost"
                            }
                            className={`w-full justify-start text-left py-4 px-4 rounded-lg border transition-colors ${
                              selectedRoute?.routeID === route.routeID
                                ? "bg-blue-100 border-blue-400"
                                : "hover:bg-blue-50"
                            }`}
                            onClick={() => handleSelectRoute(route)}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <MapPin className="h-5 w-5 text-blue-500 mt-1 shrink-0" />
                              <div className="flex-1 break-words text-base font-medium leading-snug overflow-hidden whitespace-nowrap text-ellipsis">
                                {route.routeName}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-16">
                        Không tìm thấy tuyến đường
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {routes && routes.total > 0 && (
                  <div className="flex items-center justify-between px-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-gray-600">
                      Trang {routes.page} /{" "}
                      {Math.ceil(routes.total / routes.limit)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage === Math.ceil(routes.total / routes.limit)
                      }
                      className="rounded-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-xl font-semibold">Bản đồ</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <div ref={mapContainer} className="h-full w-full" />
                </div>
                {selectedRoute && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium text-gray-700">
                      Thêm địa điểm
                    </Label>
                    <Command className="mt-2 border rounded-lg">
                      <CommandInput
                        placeholder="Tìm địa điểm (vd., Thành phố Hồ Chí Minh)"
                        value={newLocation}
                        onValueChange={(value: string) => {
                          setNewLocation(value);
                          fetchSuggestions(value);
                        }}
                        className="border-none focus:ring-0"
                      />
                      <CommandList className="max-h-48 overflow-auto">
                        {suggestions.length > 0 ? (
                          suggestions.map((suggestion) => (
                            <CommandItem
                              key={suggestion.place_id}
                              onSelect={() =>
                                handleAddLocationByName(suggestion.place_id)
                              }
                              className="py-2 px-4 hover:bg-blue-50 cursor-pointer"
                            >
                              {suggestion.description}
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty className="py-4 text-center text-gray-500">
                            Không tìm thấy địa điểm
                          </CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedRoute && (
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-xl font-semibold">
                    Chi tiết tuyến đường: {selectedRoute.routeName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                      Thông tin tuyến đường
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Mã tuyến đường:</span>{" "}
                        {selectedRoute.routeID}
                      </div>
                      <div>
                        <span className="font-semibold">Công ty:</span>{" "}
                        {selectedRoute.companyID}
                      </div>
                      <div>
                        <span className="font-semibold">Ngày tạo:</span>{" "}
                        {formatDate(selectedRoute.createdAt)}
                      </div>
                      <div>
                        <span className="font-semibold">Ngày cập nhật:</span>{" "}
                        {formatDate(selectedRoute.updatedAt)}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-medium text-gray-800">
                        Danh sách địa điểm
                      </h4>
                      {isUpdateNeeded && (
                        <Button
                          onClick={handleUpdateRoute}
                          className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                          <Save className="h-4 w-4 mr-2" /> Cập nhật
                        </Button>
                      )}
                    </div>
                    <ScrollArea className="h-64">
                      <ul className="space-y-3">
                        {[...selectedRoute.Waypoint, ...pendingWaypoints].map(
                          (wp, idx) => {
                            let coordinates: string = "Invalid";
                            try {
                              const geo = JSON.parse(wp.geoLocation);
                              coordinates = `(${geo.coordinates[1].toFixed(
                                4
                              )}, ${geo.coordinates[0].toFixed(4)})`;
                            } catch {
                              toast.error("Lỗi tọa độ");
                            }
                            return (
                              <li
                                key={wp.waypointID}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex-1 truncate">
                                  <span className="font-medium text-gray-800">
                                    {wp.location || `Point ${idx + 1}`}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-2 truncate">
                                    {coordinates}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleEditWaypoint(wp)}
                                    className="rounded-full"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveUp(idx)}
                                    disabled={idx === 0}
                                    className="rounded-full"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleMoveDown(idx)}
                                    disabled={
                                      idx ===
                                      selectedRoute.Waypoint.length +
                                        pendingWaypoints.length -
                                        1
                                    }
                                    className="rounded-full"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteLocation(idx)}
                                    className="rounded-full"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog
          open={!!editingWaypoint}
          onOpenChange={() => setEditingWaypoint(null)}
        >
          <DialogContent className="sm:max-w-md rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Tùy chỉnh
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Địa điểm
                </Label>
                <Input
                  value={editLocationName}
                  onChange={(e) => setEditLocationName(e.target.value)}
                  placeholder="Enter location name"
                  className="mt-1 rounded-lg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingWaypoint(null)}
                className="rounded-lg"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Lưu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default RouteManagement;
