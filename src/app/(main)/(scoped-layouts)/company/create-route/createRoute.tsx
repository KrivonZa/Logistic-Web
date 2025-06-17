"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "@goongmaps/goong-js";
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

export interface createWaypoints {
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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const goongApiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY;

  useEffect(() => {
    mapboxgl.accessToken = goongApiKey!;
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [106.660172, 10.762622],
        zoom: 13,
      });
      mapRef.current = map;

      map.on("click", (e:any) => {
        const { lng, lat } = e.lngLat;
        addWaypoint(lat, lng);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userPos = [pos.coords.longitude, pos.coords.latitude];
          new mapboxgl.Marker({ color: "red" })
            .setLngLat(userPos)
            .setPopup(new mapboxgl.Popup().setText("Bạn đang ở đây"))
            .addTo(map);
          map.setCenter(userPos);
        });
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const addWaypoint = (lat: number, lng: number) => {
    const newWp: createWaypoints = {
      locationLatitude: lat.toString(),
      locationLongtitude: lng.toString(),
      locationName: "",
      index: waypoints.length,
    };
    setWaypoints((wps) => [...wps, newWp]);
  };

  const updateRoute = async () => {
    if (waypoints.length < 2) return;
    const sorted = waypoints.sort((a, b) => a.index - b.index);
    const coords = sorted.map((wp) => `${wp.locationLongtitude},${wp.locationLatitude}`);
    const url = `https://rsapi.goong.io/Direction?origin=${coords[0]}&destination=${coords[coords.length - 1]}&waypoints=${coords.slice(1, -1).join("|")}&vehicle=car&api_key=${goongApiKey}`;

    try {
      const res = await axios.get(url);
      const points = res.data.routes[0].overview_polyline.points;
      const decoded = decodePolyline(points);
      setRouteCoords(decoded);

      const map = mapRef.current!;
      map.getSource("route")?.setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: decoded },
      });
    } catch (err) {
      console.error("Không thể lấy dữ liệu từ Goong:", err);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [] },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#1976d2", "line-width": 4 },
      });
    });
  }, []);

  useEffect(() => {
    updateRoute();
  }, [waypoints]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setWaypoints((wps) => {
      const oldIdx = wps.findIndex((w) => w.index.toString() === active.id);
      const newIdx = wps.findIndex((w) => w.index.toString() === over.id);
      return arrayMove(wps, oldIdx, newIdx).map((wp, i) => ({ ...wp, index: i }));
    });
  };

  const handleSubmit = () => {
    const payload: createRoute = {
      routeID: crypto.randomUUID(),
      routeName,
      waypoints,
    };
    console.log(payload);
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
            items={waypoints.map((w) => w.index.toString())}
            strategy={verticalListSortingStrategy}
          >
            <div className="bg-gray-100 rounded-lg p-2 min-h-[100px]">
              {waypoints.map((wp, i) => (
                <SortableItem
                  key={wp.index.toString()}
                  id={wp.index.toString()}
                  label={wp.locationName}
                  onNameChange={(name) =>
                    setWaypoints((wps) =>
                      wps.map((w, idx) =>
                        idx === i ? { ...w, locationName: name } : w
                      )
                    )
                  }
                  onRemove={() =>
                    setWaypoints((wps) =>
                      wps
                        .filter((_, idx) => idx !== i)
                        .map((w, idx) => ({ ...w, index: idx }))
                    )
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <Button onClick={handleSubmit}>Gửi tuyến đường</Button>
    </motion.div>
  );
};

// Hàm decode polyline của Goong (dựa trên Google Polyline)
function decodePolyline(str: string): [number, number][] {
  let index = 0, lat = 0, lng = 0, coordinates = [];

  while (index < str.length) {
    let result = 1, shift = 0, b;
    do {
      b = str.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1; shift = 0;
    do {
      b = str.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push([lng * 1e-5, lat * 1e-5]);
  }
  return coordinates as [number, number][];
}

export default CreateRoute;
