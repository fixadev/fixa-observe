import { type PropertySchema } from "~/lib/property";
import { env } from "~/env";

const MAP_ID = "2b9b510fdba6b2ef";

interface LatLng {
  lat: number;
  lng: number;
}

async function geocodeAddress(address: string): Promise<LatLng> {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder
      .geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
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

export async function generateStaticMapUrl(
  properties: PropertySchema[],
): Promise<{
  staticMapUrl: string;
  errors: { propertyId: string; error: string }[];
}> {
  try {
    const errors: { propertyId: string; error: string }[] = [];

    const markers = await Promise.all(
      properties.map(async (property, index) => {
        try {
          const location = await geocodeAddress(
            property.attributes.address ?? "",
          );
          if (!location) {
            errors.push({
              propertyId: property.id,
              error: "Invalid address",
            });
            return null;
          }
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

    // Filter out the errors after Promise.all completes
    const validMarkers = markers.filter((marker) => marker !== null);

    validMarkers.sort((a, b) => a.index - b.index);

    const center = calculateCenter(validMarkers);
    const zoom = 13.5;
    const scale = 2;
    const size = "800x600";

    const markersString = validMarkers
      .map(
        (marker, index) =>
          `&markers=color:0x046bb6|label:${index + 1}|${marker.lat},${marker.lng}`,
      )
      .join("");

    const staticMapUrl =
      `https://maps.googleapis.com/maps/api/staticmap?` +
      `center=${center.lat},${center.lng}` +
      `&zoom=${zoom}` +
      `&size=${size}` +
      `&scale=${scale}` +
      `&maptype=roadmap` +
      `&key=${env.NEXT_PUBLIC_GOOGLE_API_KEY}` +
      `&map_id=${MAP_ID}` +
      markersString;

    console.log("mapErrors in survey", errors);
    return { staticMapUrl, errors };
  } catch (error) {
    console.error("Error generating static map URL:", error);
    throw error;
  }
}
