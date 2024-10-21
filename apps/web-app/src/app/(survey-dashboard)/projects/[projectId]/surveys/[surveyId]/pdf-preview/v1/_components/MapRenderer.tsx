import { Map, AdvancedMarker, Pin, MapEvent } from "@vis.gl/react-google-maps";
import { PropertySchema } from "~/lib/property";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

const MAP_ID = "2b9b510fdba6b2ef";

export function MapRenderer({
  properties,
  mapLoaded,
  mapImageData,
  onMapImageCapture,
}: {
  properties: PropertySchema[];
  mapLoaded: boolean;
  mapImageData: string | null;
  onMapImageCapture: (imageData: string) => void;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<
    Array<google.maps.LatLngLiteral & { index: number }>
  >([]);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();
    const geocodePromises = properties.map(
      (property, index) =>
        new Promise<google.maps.LatLngLiteral & { index: number }>(
          (resolve, reject) => {
            geocoder.geocode(
              { address: property.attributes.address },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  const location = results[0].geometry.location;
                  resolve({ lat: location.lat(), lng: location.lng(), index });
                } else {
                  reject(
                    new Error(
                      `Geocoding failed for address: ${property.attributes.address}`,
                    ),
                  );
                }
              },
            );
          },
        ),
    );

    Promise.all(geocodePromises)
      .then((newMarkers) => {
        setMarkers(newMarkers.sort((a, b) => a.index - b.index));
      })
      .catch((error) => console.error("Error geocoding addresses:", error));
  }, [properties]);

  const center = useMemo(() => {
    if (markers.length === 0) return { lat: 0, lng: 0 };
    const latSum = markers.reduce((sum, marker) => sum + marker.lat, 0);
    const lngSum = markers.reduce((sum, marker) => sum + marker.lng, 0);
    return {
      lat: latSum / markers.length,
      lng: lngSum / markers.length,
    };
  }, [markers]);

  const mapOptions = useMemo(
    () => ({
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeId: "roadmap",
      gestureHandling: "none",
      keyboardShortcuts: false,
    }),
    [],
  );

  const captureMap = useCallback(() => {
    if (mapRef.current && isMapReady && mapImageData === null) {
      console.log("Capturing map");
      const mapContainer = mapRef.current.getDiv();
      html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        scale: 5, // Increase scale for better quality
      }).then((canvas) => {
        const imageData = canvas.toDataURL("image/png");
        console.log("Map captured");
        onMapImageCapture(imageData);
      });
    }
  }, [onMapImageCapture, isMapReady]);

  const handleMapIdle = useCallback((e: MapEvent) => {
    if (e.map && !mapRef.current) {
      mapRef.current = e.map;
      setIsMapReady(true);
      if (mapLoaded) {
        captureMap();
      }
    }
  }, []);

  useEffect(() => {
    if (isMapReady && markers.length > 0) {
      // Wait for the map to be fully loaded and rendered
      const timer = setTimeout(captureMap, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMapReady, markers, captureMap]);

  return (
    <Map
      defaultZoom={13}
      center={center}
      mapId={MAP_ID}
      {...mapOptions}
      onIdle={handleMapIdle}
      style={{ width: "800px", height: "600px" }}
    >
      {markers.map((marker) => (
        <AdvancedMarker key={marker.index} position={marker}>
          <Pin
            background={"#046bb6"}
            borderColor={"#046bb6"}
            glyphColor={"#FFFFFF"}
            scale={1}
          >
            {marker.index + 1}
          </Pin>
        </AdvancedMarker>
      ))}
    </Map>
  );
}
