"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import debounce from "lodash/debounce";
import axios from "axios";
import polyline from "@mapbox/polyline";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { createRoute, createWaypoints } from "@/types/route";
import { useAppDispatch } from "@/stores";
import { useRoute } from "@/hooks/useRoute";
import { createRoutes } from "@/stores/routeManager/thunk";
import type { FeatureCollection } from "geojson";

// Type cho Goong
type GoongMapModule = typeof import("@goongmaps/goong-js");
type MarkerInstance = import("@goongmaps/goong-js").Marker;
type Suggestion = { place_id: string; description: string };

const SortableItem = ({
  id,
  label,
  onNameChange,
  onRemove,
}: {
  id: string;
  label: string;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-2 bg-white rounded shadow-sm mb-2 border flex items-center justify-between gap-2"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Input
        className="flex-1"
        placeholder="Tên điểm"
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
  const dispatch = useAppDispatch();
  const { loading } = useRoute();

  const [routeName, setRouteName] = useState("");
  const [waypoints, setWaypoints] = useState<createWaypoints[]>([]);
  const [GoongMap, setGoongMap] = useState<{
    Marker: GoongMapModule["Marker"];
    Popup: GoongMapModule["Popup"];
    LngLatBounds: GoongMapModule["LngLatBounds"];
  } | null>(null);
  const mapRef = useRef<import("@goongmaps/goong-js").Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<Record<string, MarkerInstance>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const goongApiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY!;
  const goongMaptilesKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY!;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const fetchSuggestions = debounce(async (query: string) => {
    if (!query) return setSuggestions([]);

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
      console.error("Lỗi khi lấy gợi ý:", error);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(searchQuery);
    return () => fetchSuggestions.cancel();
  }, [searchQuery]);

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
        Marker: mod.Marker,
        Popup: mod.Popup,
        LngLatBounds: mod.LngLatBounds,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const userPos: [number, number] = [
            pos.coords.longitude,
            pos.coords.latitude,
          ];
          new mod.Marker({ color: "red" })
            .setLngLat(userPos)
            .setPopup(new mod.Popup().setText("Bạn đang ở đây"))
            .addTo(map);
          map.setCenter(userPos);
        });
      }
    });

    return () => {
      Object.values(markers).forEach((m) => m.remove());
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (GoongMap) drawRoute();
  }, [GoongMap, waypoints]);

  const drawRoute = async () => {
    if (!GoongMap || !mapRef.current || waypoints.length < 2) return;

    try {
      if (mapRef.current.getLayer("route")) mapRef.current.removeLayer("route");
      if (mapRef.current.getSource("route"))
        mapRef.current.removeSource("route");

      let allCoords: number[][] = [];

      for (let i = 0; i < waypoints.length - 1; i++) {
        const origin = `${waypoints[i].locationLatitude},${waypoints[i].locationLongtitude}`;
        const destination = `${waypoints[i + 1].locationLatitude},${
          waypoints[i + 1].locationLongtitude
        }`;

        const res = await axios.get("https://rsapi.goong.io/Direction", {
          params: {
            origin,
            destination,
            vehicle: "car",
            api_key: goongApiKey,
          },
        });

        const segment = polyline.decode(
          res.data.routes?.[0]?.overview_polyline?.points || ""
        );

        if (i === 0) allCoords.push(...segment);
        else allCoords.push(...segment.slice(1));
      }

      if (!allCoords.length) return;

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

      mapRef.current.addSource("route", { type: "geojson", data: geoJSON });
      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#1e88e5", "line-width": 6 },
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
    } catch (err) {
      console.error("Lỗi khi vẽ route:", err);
    }
  };

  const addWaypoint = (lat: number, lng: number, name: string) => {
    if (!GoongMap || !mapRef.current) return;

    const newWp: createWaypoints = {
      id: Date.now().toString(),
      locationLatitude: lat.toFixed(6),
      locationLongtitude: lng.toFixed(6),
      locationName: name,
      index: waypoints.length + 1,
    };

    setWaypoints((wps) => [...wps, newWp]);

    const marker = new GoongMap.Marker({ color: "#1976d2" })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    setMarkers((prev) => ({ ...prev, [newWp.id]: marker }));
  };

  const handleSelectSuggestion = async (placeId: string, desc: string) => {
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/Detail", {
        params: { api_key: goongApiKey, place_id: placeId },
      });
      const { lat, lng } = res.data.result.geometry.location;
      addWaypoint(lat, lng, desc);
      setSearchQuery("");
      setSuggestions([]);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết địa điểm:", err);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setWaypoints((wps) => {
      const oldIdx = wps.findIndex((w) => w.id === active.id);
      const newIdx = wps.findIndex((w) => w.id === over.id);
      const newWps = arrayMove(wps, oldIdx, newIdx);
      return newWps.map((w, i) => ({ ...w, index: i + 1 }));
    });
  };

  const handleSubmit = async () => {
    const payload: createRoute = {
      routeName,
      waypoints,
    };
    try {
      const result = await dispatch(createRoutes(payload)).unwrap();
      console.log("Route created:", result);
    } catch (err) {
      console.error("Tạo route thất bại:", err);
    }
  };

  return (
    <motion.div
      className="relative w-full h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute top-0 left-0 p-4 w-96 z-10">
        <Input
          placeholder="Tìm kiếm địa điểm..."
          value={searchQuery}
          className="bg-white"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow">
            {suggestions.map((sug) => (
              <li
                key={sug.place_id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  handleSelectSuggestion(sug.place_id, sug.description)
                }
              >
                {sug.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="absolute top-0 right-0 w-96 h-full bg-white shadow z-10 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Tạo hành trình</h2>
        <Input
          placeholder="Tên hành trình"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />

        <h3 className="font-semibold text-lg mt-6 mb-2">Danh sách điểm</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={waypoints.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            {waypoints.map((wp) => (
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
                  markers[wp.id]?.remove();
                  setMarkers((prev) => {
                    const copy = { ...prev };
                    delete copy[wp.id];
                    return copy;
                  });
                  setWaypoints((wps) =>
                    wps
                      .filter((w) => w.id !== wp.id)
                      .map((w, i) => ({ ...w, index: i + 1 }))
                  );
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          className="mt-4 w-full"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <Spinner size="medium" /> : "Gửi hành trình"}
        </Button>
      </div>
    </motion.div>
  );
};

export default CreateRoute;
