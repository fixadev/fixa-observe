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

export async function generateStaticMapUrl(
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

    // Filter out the errors after Promise.all completes
    const validMarkers = markers.filter((marker) => marker !== null);

    validMarkers.sort((a, b) => b.lat - a.lat);

    const center = calculateCenter(validMarkers);
    const zoom = 6;
    const scale = 2;
    // const size = "800x600";
    const size = "600x600";
    const padding = 100;

    const markersString = validMarkers
      .map(
        (marker, index) =>
          `url-${encodeURIComponent(
            `https://www.apex.deal/api/map-pin?number=${index + 1}&size=32`,
          )}(${marker.lng},${marker.lat})`,
      )
      .join(",");

    // let staticMapUrl =
    //   `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/` +
    //   markersString +
    //   `/auto/${size}?` +
    //   `padding=${padding}` +
    //   `&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}` +
    //   `&logo=false` +
    //   `&attribution=false`;
    // console.log("staticMapUrl", staticMapUrl);

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
