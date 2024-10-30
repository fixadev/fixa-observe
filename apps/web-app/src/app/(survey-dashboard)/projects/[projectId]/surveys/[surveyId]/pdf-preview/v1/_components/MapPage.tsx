import { Image, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { type PropertyWithIncludes } from "~/hooks/useSurvey";

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
    fontSize: 20,
    fontWeight: "semibold",
    marginBottom: 5,
    paddingLeft: 20,
    paddingTop: 15,
  },
  propertyList: {
    // marginTop: 10,
  },
  propertyItem: {
    paddingVertical: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 20,

    borderStyle: "solid",
    borderColor: "#DDDEDE",
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
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
  imageBubble: {
    height: 25,
    width: 25,
    fontWeight: "semibold",
    position: "relative",
    backgroundColor: "#046bb6",
    color: "#FFFFFF",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    zIndex: 1,
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
}: {
  mapImageData: string | null;
  properties: (PropertyWithIncludes & { streetAddress: string })[] | null;
}) {
  if (!mapImageData || !properties) return null;

  const bubbleSize = Math.min(25, Math.max(30 - properties.length, 15));
  console.log("bubbleSize", bubbleSize);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.leftColumn}>
        {/* <Text style={styles.header}>Location Overview</Text> */}
        <View style={styles.propertyList}>
          {properties.map((property, index) => (
            <View
              key={index}
              style={{
                ...styles.propertyItem,
                paddingVertical: bubbleSize / 2.5,
              }}
            >
              <View
                style={{
                  ...styles.imageBubble,
                  height: bubbleSize,
                  width: bubbleSize,
                  fontSize: bubbleSize / 2,
                }}
              >
                <Text>{index + 1}</Text>
              </View>
              <Text
                style={{
                  ...styles.propertyText,
                  fontSize: Math.min(bubbleSize / 1.5, 12),
                }}
              >
                {property.streetAddress}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.rightColumn}>
        <View style={styles.mapContainer}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={mapImageData} style={styles.map} />
        </View>
      </View>
      <View style={styles.footer}></View>
    </Page>
  );
}
