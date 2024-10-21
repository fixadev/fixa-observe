import {
  Map,
  AdvancedMarker,
  Pin,
  type MapEvent,
} from "@vis.gl/react-google-maps";
import { type PropertySchema } from "~/lib/property";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

const MAP_ID = "2b9b510fdba6b2ef";

export function MapRenderer({
  properties,
  mapLoaded,
  mapImageData,
  onMapImageCapture,
  setMapCaptured,
}: {
  properties: PropertySchema[];
  mapLoaded: boolean;
  mapImageData: string | null;
  onMapImageCapture: (imageData: string) => void;
  setMapCaptured: (isCaptured: boolean) => void;
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
            geocoder
              .geocode(
                { address: property.attributes.address },
                (results, status) => {
                  if (
                    status === google.maps.GeocoderStatus.OK &&
                    results?.[0]
                  ) {
                    const location = results[0].geometry.location;
                    resolve({
                      lat: location.lat(),
                      lng: location.lng(),
                      index,
                    });
                  } else {
                    reject(
                      new Error(
                        `Geocoding failed for address: ${property.attributes.address}`,
                      ),
                    );
                  }
                },
              )
              .catch((error) => {
                console.error(
                  `Error geocoding address: ${property.attributes.address}`,
                  error,
                );
              });
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
    if (mapRef.current && isMapReady) {
      console.log("Capturing map");
      const mapContainer = mapRef.current.getDiv();
      html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        scale: 5, // Increase scale for better quality
      })
        .then((canvas) => {
          const imageData = canvas.toDataURL("image/png");
          console.log("Map captured");
          onMapImageCapture(imageData);
          setMapCaptured(true);
        })
        .catch((error) => {
          console.error("Error capturing map", error);
        });
    }
  }, [onMapImageCapture, isMapReady, setMapCaptured]);

  const handleTilesLoaded = useCallback(
    (e: MapEvent) => {
      console.log("Tiles loaded");
      setIsMapReady(true);
      mapRef.current = e.map;
      captureMap();
    },
    [captureMap],
  );

  // this fires when the map has already rendered but needs to be captured again
  useEffect(() => {
    if (isMapReady && mapImageData === null) {
      console.log("firing useEffect", mapImageData);
      captureMap();
    }
  }, [isMapReady, captureMap, mapImageData]);

  return (
    <div className="display-none">
      <Map
        defaultZoom={13.3}
        center={center}
        mapId={MAP_ID}
        {...mapOptions}
        onTilesLoaded={handleTilesLoaded}
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
    </div>
  );
}
