import { Image, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { type PropertySchema } from "~/lib/property";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "IBM Plex Sans",
  },
  leftColumn: {
    width: "30%",
  },
  rightColumn: {
    width: "70%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  header: {
    fontSize: 24,
    fontWeight: "semibold",
    marginBottom: 10,
    paddingLeft: 20,
    paddingTop: 20,
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
  },
  propertyList: {
    marginTop: 10,
  },
  propertyItem: {
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F0F0F0",
    paddingLeft: 20,
  },
  propertyText: {
    marginLeft: 10,
    fontSize: 12,
    textAlign: "left",
    fontWeight: "semibold",
  },
  propertyNeighborhood: {
    fontSize: 12,
    paddingRight: 10,
  },
  propertyNumber: {
    fontSize: 14,
    fontWeight: "semibold",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
  },
  map: {
    position: "absolute",
    width: "120%",
    height: "120%",
    objectFit: "cover",
    left: "-10%",
    top: "-10%",
  },
  footer: {
    height: 4,
    width: "100%",
    backgroundColor: "#046bb6",
    position: "absolute",
    bottom: 0,
  },
});

Font.register({
  family: "IBM Plex Sans",
  fonts: [
    {
      src: "/fonts/IBMPlexSans-Regular.ttf",
    },
    {
      src: "/fonts/IBMPlexSans-SemiBold.ttf",
      fontWeight: "semibold",
    },
  ],
});

export function MapPage({
  mapImageData,
  properties,
  clientName,
}: {
  mapImageData: string | null;
  properties: PropertySchema[] | null;
  clientName: string;
}) {
  if (!mapImageData || !properties) return null;
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.leftColumn}>
        <Text style={styles.header}>Location Overview</Text>
        <View style={styles.propertyList}>
          {properties.map((property, index) => (
            <View
              key={index}
              style={{
                ...styles.propertyItem,
                backgroundColor: index % 2 === 0 ? "#F0F0F0" : "#FFFFFF",
              }}
            >
              <Text style={styles.propertyNumber}>{index + 1}.</Text>
              <Text style={styles.propertyText}>
                {property.attributes.displayAddress?.split("\n")[0]}
              </Text>
              {/* Add more property details as needed */}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.mapContainer}>
          <Image src={mapImageData} style={styles.map} />
        </View>
      </View>
      <View style={styles.footer}></View>
    </Page>
  );
}
