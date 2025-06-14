"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { LatLngExpression } from "leaflet";
import { MapPin, Plus } from "lucide-react";
import { renderToString } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Tải các thành phần react-leaflet bằng dynamic import
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  {
    ssr: false,
  }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Dữ liệu mock với ít nhất 5 điểm mỗi route
const mockRoutes = [
  {
    id: "r1",
    name: "Route A",
    locations: [
      { name: "Điểm 1 - Quận 1", lat: 10.776889, lng: 106.700806 },
      { name: "Điểm 2 - Quận 3", lat: 10.783333, lng: 106.683333 },
      { name: "Điểm 3 - Quận 7", lat: 10.733333, lng: 106.716667 },
      { name: "Điểm 4 - Bình Thạnh", lat: 10.803333, lng: 106.716667 },
      { name: "Điểm 5 - Thủ Đức", lat: 10.85, lng: 106.766667 },
    ],
    drivers: ["Nguyễn Văn A", "Trần Văn B"],
  },
  {
    id: "r2",
    name: "Route B",
    locations: [
      { name: "Điểm 1 - Quận 5", lat: 10.753333, lng: 106.666667 },
      { name: "Điểm 2 - Quận 10", lat: 10.766667, lng: 106.666667 },
      { name: "Điểm 3 - Tân Bình", lat: 10.8, lng: 106.65 },
      { name: "Điểm 4 - Gò Vấp", lat: 10.833333, lng: 106.666667 },
      { name: "Điểm 5 - Quận 12", lat: 10.866667, lng: 106.633333 },
    ],
    drivers: ["Lê Thị C", "Phạm Văn D"],
  },
];

// Định nghĩa kiểu cho route
interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface Route {
  id: string;
  name: string;
  locations: Location[];
  drivers: string[];
}

// Component xử lý sự kiện click trên bản đồ
const ClickHandler = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) => {
  const { useMapEvents } = require("react-leaflet");
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Tạo divIcon từ Lucide React
const createLucideIcon = () => {
  if (typeof window === "undefined") return undefined;
  const iconHtml = renderToString(<MapPin className="w-6 h-6 text-red-500" />);
  return L.divIcon({
    html: iconHtml,
    className: "lucide-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const RouteManagement = () => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [newLocation, setNewLocation] = useState("");
  const [routePath, setRoutePath] = useState<LatLngExpression[]>([]);
  const router = useRouter();

  // Tạo divIcon trong useMemo
  const lucideIcon = useMemo(() => createLucideIcon(), []);

  // Lấy tuyến đường thực tế từ OSRM
  const fetchRoutePath = async (locations: Location[]) => {
    if (locations.length < 2) {
      setRoutePath([]);
      return;
    }

    const coordinates = locations
      .map((loc) => `${loc.lng},${loc.lat}`)
      .join(";");
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=polyline&steps=true`
      );
      const data = await response.json();
      console.log("OSRM response:", data); // Log để kiểm tra
      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const decodedPath = polyline.decode(data.routes[0].geometry);
        const latLngPath: LatLngExpression[] = decodedPath.map(([lat, lng]) => [
          lat,
          lng,
        ]);
        setRoutePath(latLngPath);
        console.log("Decoded routePath:", latLngPath); // Log để kiểm tra
      } else {
        console.warn(
          "Không tìm thấy tuyến đường từ OSRM:",
          data.message || "No routes found"
        );
        setRoutePath([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tuyến đường:", error);
      setRoutePath([]);
    }
  };

  // Cập nhật tuyến đường khi selectedRoute thay đổi
  useEffect(() => {
    if (selectedRoute && Array.isArray(selectedRoute.locations)) {
      fetchRoutePath(selectedRoute.locations);
    } else {
      setRoutePath([]);
    }
  }, [selectedRoute]);

  const handleAddLocationByName = async () => {
    if (!selectedRoute || !newLocation.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          newLocation
        )}&addressdetails=1&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newLocationData = {
          name: newLocation.trim(),
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        };
        const updatedRoutes = routes.map((route) =>
          route.id === selectedRoute.id
            ? {
                ...route,
                locations: [...route.locations, newLocationData],
              }
            : route
        );
        setRoutes(updatedRoutes);
        setSelectedRoute({
          ...selectedRoute,
          locations: [...selectedRoute.locations, newLocationData],
        });
        setNewLocation("");
        // Cập nhật tuyến đường
        fetchRoutePath([...selectedRoute.locations, newLocationData]);
      } else {
        alert("Không tìm thấy địa điểm! Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tìm địa điểm:", error);
      alert("Đã xảy ra lỗi khi tìm địa điểm.");
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!selectedRoute) return;
    const newLocationData = {
      name: `Điểm mới ${Date.now().toString().slice(-4)}`,
      lat,
      lng,
    };
    const updatedRoutes = routes.map((route) =>
      route.id === selectedRoute.id
        ? {
            ...route,
            locations: [...route.locations, newLocationData],
          }
        : route
    );
    setRoutes(updatedRoutes);
    setSelectedRoute({
      ...selectedRoute,
      locations: [...selectedRoute.locations, newLocationData],
    });
    // Cập nhật tuyến đường
    fetchRoutePath([...selectedRoute.locations, newLocationData]);
  };

  const handleSelectRoute = (route: Route) => {
    if (route && Array.isArray(route.locations)) {
      setSelectedRoute(route);
    } else {
      console.warn("Route không hợp lệ:", route);
      setSelectedRoute(null);
    }
  };

  // Xóa địa điểm
  const handleDeleteLocation = (index: number) => {
    if (!selectedRoute) return;
    const updatedLocations = selectedRoute.locations.filter(
      (_, i) => i !== index
    );
    const updatedRoutes = routes.map((route) =>
      route.id === selectedRoute.id
        ? { ...route, locations: updatedLocations }
        : route
    );
    setRoutes(updatedRoutes);
    setSelectedRoute({ ...selectedRoute, locations: updatedLocations });
    fetchRoutePath(updatedLocations);
  };

  const center = useMemo(() => [10.776889, 106.700806] as LatLngExpression, []);

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
          <Plus className="h-16 w-16 text-white" /> Tạo route mới
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách route */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Tuyến đường</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[300px] space-y-2">
              {routes.map((route) => (
                <Button
                  key={route.id}
                  variant={
                    selectedRoute?.id === route.id ? "default" : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => handleSelectRoute(route)}
                >
                  {route.name}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Bản đồ */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Bản đồ tuyến đường</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-md">
              <MapContainer
                center={center}
                zoom={13}
                className="h-full w-full rounded-md z-0"
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Tiles by <a href="https://carto.com">Carto</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {selectedRoute &&
                  Array.isArray(selectedRoute.locations) &&
                  lucideIcon && (
                    <>
                      {selectedRoute.locations.map((loc, i) => (
                        <Marker
                          key={i}
                          position={[loc.lat, loc.lng]}
                          icon={lucideIcon}
                        >
                          <Popup>{loc.name}</Popup>
                        </Marker>
                      ))}
                      {routePath.length > 0 && (
                        <Polyline positions={routePath} color="blue" />
                      )}
                    </>
                  )}
                <ClickHandler onMapClick={handleMapClick} />
              </MapContainer>
            </div>

            {selectedRoute && (
              <div className="mt-4 space-y-2">
                <Label>Thêm địa điểm theo tên:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập địa điểm (ví dụ: Ho Chi Minh City)"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                  <Button onClick={handleAddLocationByName}>Thêm</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chi tiết tuyến */}
      {selectedRoute && Array.isArray(selectedRoute.locations) && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết {selectedRoute.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Danh sách địa điểm:</h4>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {selectedRoute.locations.map((loc, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>
                      {loc.name} (lat: {loc.lat.toFixed(5)}, lng:{" "}
                      {loc.lng.toFixed(5)})
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteLocation(idx)}
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Tài xế chạy tuyến này:</h4>
              <Textarea
                defaultValue={selectedRoute.drivers.join("\n")}
                rows={selectedRoute.drivers.length + 1}
                onBlur={(e) => {
                  const updatedDrivers = e.target.value
                    .split("\n")
                    .map((d) => d.trim())
                    .filter(Boolean);
                  const updatedRoutes = routes.map((r) =>
                    r.id === selectedRoute.id
                      ? { ...r, drivers: updatedDrivers }
                      : r
                  );
                  setRoutes(updatedRoutes);
                  setSelectedRoute({
                    ...selectedRoute,
                    drivers: updatedDrivers,
                  });
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Mỗi dòng là 1 tài xế
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RouteManagement;
