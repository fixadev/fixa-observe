import { Image, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { PropertySchema } from "~/lib/property";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "IBM Plex Sans",
  },
  leftColumn: {
    width: "50%",
    padding: 20,
  },
  rightColumn: {
    width: "50%",
    padding: 20,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F0F0F0",
  },
  header: {
    fontSize: 24,
    fontWeight: "semibold",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 10,
  },
  propertyList: {
    marginTop: 20,
  },
  propertyItem: {
    padding: 10,
    gap: 10,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F0F0",
  },
  propertyText: {
    marginLeft: 10,
    fontSize: 12,
    width: "50%",
    textAlign: "left",
    fontWeight: "semibold",
  },
  propertyNeighborhood: {
    fontSize: 12,
  },
  propertyNumber: {
    fontSize: 14,
    fontWeight: "semibold",
  },
  map: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
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
        <Text style={styles.header}>Map</Text>
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
                {property.attributes.address?.split(",")[0]}
              </Text>
              <Text style={styles.propertyNeighborhood}>
                {property.attributes.address?.split(",")[1]?.trim()}
              </Text>
              {/* Add more property details as needed */}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rightColumn}>
        <Image src={mapImageData} style={styles.map} />
      </View>
      <View style={styles.footer}></View>
    </Page>
  );
}
