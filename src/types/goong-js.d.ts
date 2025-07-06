declare module "@goongmaps/goong-js" {
  export interface GoongMapOptions {
    container: string | HTMLElement;
    style: string;
    center?: [number, number];
    zoom?: number;
  }

  export class Map {
    constructor(options: GoongMapOptions);
    on(type: string, listener: (...args: any[]) => void): void;
    getLayer(id: string): any;
    removeLayer(id: string): void;
    getSource(id: string): any;
    removeSource(id: string): void;
    addSource(id: string, source: any): void;
    addLayer(layer: any): void;
    fitBounds(bounds: LngLatBounds, options?: any): void;
    flyTo(options: {
      center: [number, number];
      zoom?: number;
      speed?: number;
    }): void;
    setCenter(center: [number, number]): void;
    remove(): void;
  }

  export class Marker {
    constructor(options?: { color?: string });
    setLngLat(lngLat: [number, number]): Marker;
    setPopup(popup: Popup): Marker;
    addTo(map: Map): Marker;
    remove(): void;
  }

  export class Popup {
    constructor(options?: any);
    setText(text: string): Popup;
    setHTML(html: string): Popup;
  }

  export class LngLatBounds {
    constructor(sw: [number, number], ne: [number, number]);
    extend(lngLat: [number, number]): LngLatBounds;
  }

  const goong: {
    accessToken: string;
    Map: typeof Map;
    Marker: typeof Marker;
    Popup: typeof Popup;
    LngLatBounds: typeof LngLatBounds;
  };

  export default goong;
}
