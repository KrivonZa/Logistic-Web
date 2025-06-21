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
import debounce from "lodash/debounce";

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
  const [markers, setMarkers] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const goongApiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY!;
  const goongMaptilesKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY!;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const drawRoute = async () => {
    if (!GoongMap || !mapRef.current) return;

    if (waypoints.length < 2) {
      if (mapRef.current.getLayer("route")) {
        mapRef.current.removeLayer("route");
      }
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeSource("route");
      }
      return;
    }

    try {
      if (mapRef.current.getLayer("route")) {
        mapRef.current.removeLayer("route");
      }
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeSource("route");
      }

      let allCoords: any[] = [];

      for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];

        const origin = `${start.locationLatitude},${start.locationLongtitude}`;
        const destination = `${end.locationLatitude},${end.locationLongtitude}`;

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
          console.error(`Không có route từ điểm ${i} đến ${i + 1}`);
          continue;
        }

        const coordsSegment = polyline.decode(route.overview_polyline.points);

        if (i === 0) {
          allCoords.push(...coordsSegment);
        } else {
          allCoords.push(...coordsSegment.slice(1));
        }
      }

      if (allCoords.length === 0) return;

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

      const bounds = waypoints.reduce(
        (b, wp) =>
          b.extend([
            parseFloat(wp.locationLongtitude),
            parseFloat(wp.locationLatitude),
          ]),
        new GoongMap.LngLatBounds(
          [
            parseFloat(waypoints[0].locationLongtitude),
            parseFloat(waypoints[0].locationLatitude),
          ],
          [
            parseFloat(waypoints[0].locationLongtitude),
            parseFloat(waypoints[0].locationLatitude),
          ]
        )
      );

      mapRef.current.fitBounds(bounds, { padding: 60 });
    } catch (error) {
      console.error("Lỗi khi vẽ từng đoạn route:", error);
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

      setGoongMap({
        ...goong,
        Marker: mod.Marker,
        Popup: mod.Popup,
        polyline: mod.polyline,
        LngLatBounds: mod.LngLatBounds,
      });

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
      markers.forEach((m: any) => m.remove());
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (GoongMap) drawRoute();
  }, [waypoints, GoongMap]);

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
        params: {
          api_key: goongApiKey,
          input: query,
          location: "10.762622,106.660172",
        },
      });
      setSuggestions(res.data.predictions);
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý địa điểm:", error);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => fetchSuggestions.cancel();
  }, [searchQuery]);

  const addWaypoint = (lat: number, lng: number, name: string) => {
    if (!GoongMap) {
      console.warn("GoongMap chưa sẵn sàng");
      return;
    }

    const newWp: createWaypoints = {
      id: Date.now().toString(),
      locationLatitude: lat.toFixed(6),
      locationLongtitude: lng.toFixed(6),
      locationName: name,
      index: waypoints.length,
    };

    setWaypoints((wps) => [...wps, newWp]);

    if (mapRef.current) {
      const marker = new GoongMap.Marker({ color: "#1976d2" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      setMarkers((prev) => ({ ...prev, [newWp.id]: marker }));
    }

    if (waypoints.length === 0) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        speed: 1.2,
      });
    }
  };

  const handleSelectSuggestion = async (
    placeId: string,
    description: string
  ) => {
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/Detail", {
        params: {
          api_key: goongApiKey,
          place_id: placeId,
        },
      });
      const { lat, lng } = res.data.result.geometry.location;
      addWaypoint(lat, lng, description);
      setSearchQuery("");
      setSuggestions([]);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết địa điểm:", error);
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
    console.log("Route gửi:", payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-screen flex flex-col"
    >
      <h2 className="text-2xl font-semibold self-center mb-10">
        Tạo hành trình
      </h2>
      {/* Bản đồ chiếm phần còn lại */}
      <div className="relative w-full flex-1 overflow-hidden">
        {/* Fullscreen map (background) */}
        <div
          ref={mapContainer}
          className="absolute top-0 left-0 w-full h-full"
        />

        {/* Top input bar (overlapping the map) */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 z-10">
          {/* Search input field on the left */}
          <div className="w-96">
            <Input
              placeholder="Tìm kiếm địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white shadow-md"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-40 w-96 bg-white border rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      handleSelectSuggestion(
                        suggestion.place_id,
                        suggestion.description
                      )
                    }
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar for waypoint list on the right (overlapping the map) */}
        <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-lg z-10 p-4 overflow-y-auto">
          <div className="w-full mb-10 self-center">
            <Input
              placeholder="Tên hành trình"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="w-full bg-white shadow-md"
            />
          </div>
          <h3 className="font-semibold text-lg mb-4">Danh sách địa điểm</h3>
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
                    const marker = markers[wp.id];
                    if (marker) marker.remove();

                    setMarkers((prev) => {
                      const updated = { ...prev };
                      delete updated[wp.id];
                      return updated;
                    });

                    setWaypoints((wps) =>
                      wps
                        .filter((w) => w.id !== wp.id)
                        .map((w, idx) => ({ ...w, index: idx }))
                    );
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
          <Button onClick={handleSubmit} className="mt-4 w-full">
            Gửi hành trình
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateRoute;
