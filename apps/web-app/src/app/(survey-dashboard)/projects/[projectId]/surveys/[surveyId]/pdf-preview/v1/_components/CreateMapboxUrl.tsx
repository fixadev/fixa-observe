import { type Property } from "../../../_components/PropertiesTable";
import { env } from "~/env";

const MAP_ID = "2b9b510fdba6b2ef";

interface LatLng {
  lat: number;
  lng: number;
}

async function geocodeAddress(
  address: string,
): Promise<LatLng & { city: string }> {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder
      .geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          // Get the city from the address components
          let city = "";
          for (const component of results[0].address_components) {
            if (
              component.types.includes("locality") &&
              component.types.includes("political")
            ) {
              city = component.long_name;
              break;
            }
          }

          // Get the lat and lng from the geometry
          const location = results[0].geometry.location;

          resolve({ lat: location.lat(), lng: location.lng(), city: city });
        } else {
          reject(new Error(`Geocoding failed for address: ${address}`));
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
      });
  });
}

function calculateCenter(markers: LatLng[]): LatLng {
  if (markers.length === 0) return { lat: 0, lng: 0 };
  const latSum = markers.reduce((sum, marker) => sum + marker.lat, 0);
  const lngSum = markers.reduce((sum, marker) => sum + marker.lng, 0);
  return {
    lat: latSum / markers.length,
    lng: lngSum / markers.length,
  };
}

export async function generateStaticMapboxUrl(
  properties: Property[],
  pagePerCity = false,
): Promise<{
  staticMapUrl: string;
  errors: { propertyId: string; error: string }[];
}> {
  try {
    const errors: { propertyId: string; error: string }[] = [];

    const cityMarkers: Record<
      string,
      (LatLng & { city: string; index: number })[]
    > = {};
    const markers = await Promise.all(
      properties.map(async (property, index) => {
        try {
          const location = await geocodeAddress(property.address ?? "");
          if (!location) {
            errors.push({
              propertyId: property.id,
              error: "Invalid address",
            });
            return null;
          }
          cityMarkers[location.city] = [
            ...(cityMarkers[location.city] ?? []),
            { ...location, index },
          ];
          return { ...location, index };
        } catch (error) {
          console.error("Error geocoding address:", error);
          errors.push({
            propertyId: property.id,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return null;
        }
      }),
    );

    let validMarkers = markers.filter((marker) => marker !== null);

    const getDistance = (p1: LatLng, p2: LatLng) => {
      return Math.sqrt(
        Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2),
      );
    };

    const getMinDistance = (markers: LatLng[]) => {
      if (markers.length <= 1) return 0.007;

      // Find the bounds of all markers
      const bounds = markers.reduce(
        (acc, marker) => ({
          minLat: Math.min(acc.minLat, marker.lat),
          maxLat: Math.max(acc.maxLat, marker.lat),
          minLng: Math.min(acc.minLng, marker.lng),
          maxLng: Math.max(acc.maxLng, marker.lng),
        }),
        { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 },
      );

      // Calculate the diagonal distance of the bounding box
      const diagonalDistance = Math.sqrt(
        Math.pow(bounds.maxLat - bounds.minLat, 2) +
          Math.pow(bounds.maxLng - bounds.minLng, 2),
      );

      // Use about 3% of the diagonal as minimum distance
      // with a minimum of 0.0001 and maximum of 0.007
      return Math.max(0.0001, Math.min(0.007, diagonalDistance * 0.03));
    };

    const minDistance = getMinDistance(validMarkers);
    let allMarkers: typeof validMarkers = [];

    // First pass: initial positioning
    allMarkers = validMarkers.reduce((acc: typeof validMarkers, marker) => {
      if (!marker) return acc;
      return [...acc, { ...marker }];
    }, []);

    // Iteratively adjust until no overlaps exist
    let hasOverlaps = true;
    const maxIterations = 10;
    let iteration = 0;

    while (hasOverlaps && iteration < maxIterations) {
      hasOverlaps = false;

      for (let i = 0; i < allMarkers.length; i++) {
        const marker = allMarkers[i];
        if (!marker) continue;

        const overlappingMarkers = allMarkers.filter(
          (m, idx) => idx !== i && m && getDistance(m, marker) < minDistance,
        );

        if (overlappingMarkers.length > 0) {
          hasOverlaps = true;

          const avgPos = overlappingMarkers.reduce(
            (sum, m) => ({
              lat: sum.lat + m.lat,
              lng: sum.lng + m.lng,
            }),
            { lat: 0, lng: 0 },
          );
          avgPos.lat /= overlappingMarkers.length;
          avgPos.lng /= overlappingMarkers.length;

          const direction = {
            lat: marker.lat - avgPos.lat,
            lng: marker.lng - avgPos.lng,
          };

          if (direction.lat === 0 && direction.lng === 0) {
            direction.lat = 1;
          }

          const magnitude = Math.sqrt(direction.lat ** 2 + direction.lng ** 2);
          const normalizedDir = {
            lat: direction.lat / (magnitude || 1),
            lng: direction.lng / (magnitude || 1),
          };

          const pushDistance = minDistance * 0.3;
          marker.lat += normalizedDir.lat * pushDistance;
          marker.lng += normalizedDir.lng * pushDistance;
        }
      }

      iteration++;
    }

    validMarkers = allMarkers;

    const markersString = validMarkers
      .map(
        (marker, index) =>
          `url-${encodeURIComponent(
            `https://www.apex.deal/api/map-pin?number=${index + 1}&size=32`,
          )}(${marker.lng},${marker.lat})`,
      )
      .join(",");

    const center = calculateCenter(validMarkers);
    const zoom = 6;
    const scale = 2;
    // const size = "800x600";
    const size = "600x600";
    const padding = 100;

    const staticMapUrl =
      `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/` +
      markersString +
      `/auto/${size}@2x?` +
      `padding=${padding}` +
      `&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}` +
      `&logo=false` +
      `&attribution=false`;
    console.log("staticMapUrl", staticMapUrl);

    // staticMapUrl =
    //   `https://maps.googleapis.com/maps/api/staticmap?` +
    //   `center=${center.lat},${center.lng}` +
    //   `&zoom=${zoom}` +
    //   `&size=${size}` +
    //   `&scale=${scale}` +
    //   `&maptype=roadmap` +
    //   `&key=${env.NEXT_PUBLIC_GOOGLE_API_KEY}` +
    //   `&map_id=${MAP_ID}` +
    //   markersString;

    return { staticMapUrl, errors };
  } catch (error) {
    console.error("Error generating static map URL:", error);
    throw error;
  }
}
