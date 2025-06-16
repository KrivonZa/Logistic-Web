"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
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

const LocationMarker = ({
  onAdd,
}: {
  onAdd: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const UserLocationMarker = () => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        map.setView(newPos, 15);
      },
      (err) => {
        console.warn("Không lấy được vị trí người dùng:", err);
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position ? (
    <Marker position={position} icon={redIcon}>
      <Popup>Bạn đang ở đây</Popup>
    </Marker>
  ) : null;
};

const CreateRoute = () => {
  const [routeName, setRouteName] = useState("");
  const [waypoints, setWaypoints] = useState<createWaypoints[]>([]);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const addWaypoint = (lat: number, lng: number) => {
    setWaypoints((wps) => [
      ...wps,
      {
        locationLatitude: lat.toString(),
        locationLongtitude: lng.toString(),
        locationName: "",
        index: wps.length,
      },
    ]);
  };

  const updateRoute = async () => {
    if (waypoints.length < 2) {
      setRouteCoords([]);
      return;
    }
    try {
      const coords = waypoints
        .sort((a, b) => a.index - b.index)
        .map((wp) => [
          parseFloat(wp.locationLongtitude),
          parseFloat(wp.locationLatitude),
        ]);
      const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        { coordinates: coords },
        { headers: { Authorization: process.env.NEXT_PUBLIC_ORS_API_KEY! } }
      );
      const line = res.data.features[0].geometry.coordinates.map(
        ([lon, lat]: any) => [lat, lon]
      );
      setRouteCoords(line);
    } catch (err) {
      console.error("Lấy route không thành công", err);
    }
  };

  useEffect(() => {
    updateRoute();
  }, [waypoints]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setWaypoints((wps) => {
      const oldIdx = wps.findIndex((w) => w.index.toString() === active.id);
      const newIdx = wps.findIndex((w) => w.index.toString() === over.id);
      return arrayMove(wps, oldIdx, newIdx).map((wp, i) => ({
        ...wp,
        index: i,
      }));
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

      <MapContainer
        center={[10.762622, 106.660172]}
        zoom={13}
        scrollWheelZoom
        style={{ width: "100%", height: "400px" }}
        className="rounded-lg overflow-hidden"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onAdd={addWaypoint} />
        <UserLocationMarker />
        {routeCoords.length > 1 && (
          <Polyline positions={routeCoords} color="blue" weight={4} />
        )}
        {waypoints.map((wp, i) => (
          <Marker
            key={i}
            position={[
              parseFloat(wp.locationLatitude),
              parseFloat(wp.locationLongtitude),
            ]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const pos = (e.target as L.Marker).getLatLng();
                setWaypoints((wps) =>
                  wps.map((w, idx) =>
                    idx === i
                      ? {
                          ...w,
                          locationLatitude: pos.lat.toString(),
                          locationLongtitude: pos.lng.toString(),
                        }
                      : w
                  )
                );
              },
            }}
          >
            {wp.locationName && <Popup>{wp.locationName}</Popup>}
          </Marker>
        ))}
      </MapContainer>

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
                  onNameChange={(name) => {
                    setWaypoints((wps) =>
                      wps.map((w, idx) =>
                        idx === i ? { ...w, locationName: name } : w
                      )
                    );
                  }}
                  onRemove={() => {
                    setWaypoints((wps) =>
                      wps
                        .filter((_, idx) => idx !== i)
                        .map((w, idx) => ({ ...w, index: idx }))
                    );
                  }}
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

export default CreateRoute;
