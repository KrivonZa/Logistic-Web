"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "@goongmaps/goong-js/dist/goong-js.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import axios from "axios";
import polyline from "@mapbox/polyline";

const GoongJS = dynamic(() => import("@goongmaps/goong-js"), { ssr: false });

export interface createWaypoints {
  id: string;
  locationLatitude: string;
  locationLongtitude: string;
  locationName: string;
  index: number;
}

export interface createRoute {
  routeID: string;
  routeName: string;
  waypoints: createWaypoints[];
}

const SortableItem = ({
  id,
  label,
  onNameChange,
  onRemove,
}: {
  id: string;
  label: string;
  onNameChange: (newName: string) => void;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 bg-white rounded shadow-sm mb-2 border flex items-center justify-between gap-2"
      style={style}
    >
      <Input
        className="flex-1"
        placeholder="Tên điểm (có thể để trống)"
        value={label}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Button size="icon" variant="ghost" onClick={onRemove}>
        <X className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
};

const CreateRoute = () => {
  const [routeName, setRouteName] = useState("");
  const [waypoints, setWaypoints] = useState<createWaypoints[]>([]);
  const [GoongMap, setGoongMap] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  const goongApiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY!;
  const goongMaptilesKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY!;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const drawRoute = async () => {
    if (waypoints.length < 2 || !GoongMap || !mapRef.current) return;

    try {
      const res = await axios.get("https://rsapi.goong.io/Direction", {
        params: {
          origin: `${waypoints[0].locationLatitude},${waypoints[0].locationLongtitude}`,
          destination: `${waypoints[waypoints.length - 1].locationLatitude},${
            waypoints[waypoints.length - 1].locationLongtitude
          }`,
          vehicle: "car",
          waypoint: waypoints
            .slice(1, -1)
            .map((wp) => `${wp.locationLatitude},${wp.locationLongtitude}`)
            .join("|"),
          api_key: goongApiKey,
        },
      });

      const route = res.data.routes[0];
      const geometry_string = route.overview_polyline.points;

      const geoJSON = polyline.toGeoJSON(geometry_string); // convert polyline to GeoJSON

      if (mapRef.current.getSource("route")) {
        (mapRef.current.getSource("route") as any).setData(geoJSON);
      } else {
        // Tìm lớp symbol đầu tiên (nếu bạn cần thêm dưới lớp symbol như ví dụ gốc)
        let firstSymbolId = "";
        const layers = mapRef.current.getStyle().layers;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === "symbol") {
            firstSymbolId = layers[i].id;
            break;
          }
        }

        mapRef.current.addSource("route", {
          type: "geojson",
          data: geoJSON,
        });

        mapRef.current.addLayer(
          {
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
          },
          firstSymbolId || undefined // thêm phía dưới lớp symbol đầu tiên nếu có
        );
      }
    } catch (error) {
      console.error("Lỗi khi gọi directions API:", error);
    }
  };

  useEffect(() => {
    import("@goongmaps/goong-js").then((mod) => {
      const goong = mod.default;
      goong.accessToken = goongMaptilesKey;

      const map = new goong.Map({
        container: mapContainer.current!,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [106.660172, 10.762622],
        zoom: 13,
      });

      mapRef.current = map;

      // Gán GoongMap *sau cùng*
      setGoongMap({
        ...goong,
        Marker: mod.Marker,
        Popup: mod.Popup,
        polyline: mod.polyline,
      });

      // Đặt marker vị trí người dùng
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userPos = [pos.coords.longitude, pos.coords.latitude];
          new mod.Marker({ color: "red" })
            .setLngLat(userPos)
            .setPopup(new mod.Popup().setText("Bạn đang ở đây"))
            .addTo(map);
          map.setCenter(userPos);
        });
      }
    });

    return () => {
      markers.forEach((m) => m.remove());
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!GoongMap || !mapRef.current) return;

    const handleMapClick = (e: any) => {
      const { lng, lat } = e.lngLat;
      addWaypoint(lat, lng);
    };

    mapRef.current.on("click", handleMapClick);

    return () => {
      mapRef.current?.off("click", handleMapClick);
    };
  }, [GoongMap]);

  useEffect(() => {
    if (GoongMap) drawRoute();
  }, [waypoints, GoongMap]);

  const addWaypoint = (lat: number, lng: number) => {
    console.log("Thêm waypoint tại:", lat, lng);
    if (!GoongMap) {
      console.warn("GoongMap chưa sẵn sàng");
      return;
    }

    const newWp: createWaypoints = {
      id: Date.now().toString(),
      locationLatitude: lat.toFixed(6),
      locationLongtitude: lng.toFixed(6),
      locationName: "",
      index: waypoints.length,
    };

    setWaypoints((wps) => [...wps, newWp]);

    if (mapRef.current) {
      const marker = new GoongMap.Marker({ color: "#1976d2" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      setMarkers((prev) => [...prev, marker]);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWaypoints((wps) => {
      const oldIdx = wps.findIndex((w) => w.id === active.id);
      const newIdx = wps.findIndex((w) => w.id === over.id);

      const newWaypoints = arrayMove(wps, oldIdx, newIdx);
      return newWaypoints.map((wp, i) => ({
        ...wp,
        index: i, // nếu bạn vẫn cần field này để hiển thị số thứ tự
      }));
    });
  };

  const handleSubmit = () => {
    const payload: createRoute = {
      routeID: crypto.randomUUID(),
      routeName,
      waypoints,
    };
    console.log("Route gửi:", payload);
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-4 p-4"
    >
      <Input
        placeholder="Tên hành trình"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        className="w-full max-w-xl"
      />

      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-lg overflow-hidden"
      />

      <div className="w-full max-w-xl">
        <h3 className="font-semibold text-lg">Danh sách waypoint</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={waypoints.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            {waypoints.map((wp, i) => (
              <SortableItem
                key={wp.id}
                id={wp.id}
                label={wp.locationName}
                onNameChange={(name) =>
                  setWaypoints((wps) =>
                    wps.map((w) =>
                      w.id === wp.id ? { ...w, locationName: name } : w
                    )
                  )
                }
                onRemove={() => {
                  markers[i]?.remove();
                  setWaypoints((wps) =>
                    wps
                      .filter((w) => w.id !== wp.id)
                      .map((w, idx) => ({ ...w, index: idx }))
                  );
                  setMarkers((mks) => mks.filter((_, idx) => idx !== i));
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Button onClick={handleSubmit}>Gửi tuyến đường</Button>
    </motion.div>
  );
};

export default CreateRoute;
