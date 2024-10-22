/* eslint-disable jsx-a11y/alt-text */
import {
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  Font,
} from "@react-pdf/renderer";
import { type AttributeSchema, type PropertySchema } from "~/lib/property";

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

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    fontFamily: "IBM Plex Sans",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 35,
    display: "flex",
    margin: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "ultrabold",
    textAlign: "center",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    // backgroundColor: "#046bb6",
    color: "#000000",
  },
  tableRow: {
    margin: "auto",
    // marginVertical: 1,
    flexDirection: "row",
  },
  tableCol: {
    width: "12%",
    // borderStyle: "solid",
    // borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  leftCol: {
    width: "15px",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#046bb6",
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCell: {
    margin: "auto",
    // maxHeight: "30px",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 10,
  },
  commentsCell: {
    textAlign: "left",
    flexDirection: "row",
    alignItems: "center",
    margin: "auto",
    justifyContent: "flex-start",
    fontSize: 8,
    paddingVertical: 6,
    paddingRight: 6,
    width: "100%",
  },
  leftCell: {
    alignItems: "center",
    justifyContent: "center",
    alignText: "center",
    marginTop: 5,
    width: "2%",
    fontSize: 10,
    paddingLeft: -2,
  },
  headerCell: {
    height: 35,
    margin: "5px",
    display: "flex",
    color: "#808080",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    marginVertical: 5,
    fontSize: 10,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },

  image: {
    height: 65,
    width: "100%",
  },
  footer: {
    height: 4,
    width: "100%",
    backgroundColor: "#046bb6",
    position: "absolute",
    bottom: 0,
  },
});

const getWidth = (attribute: { id: string }) => {
  if (attribute.id === "displayAddress") {
    return "18%";
  } else if (attribute.id === "photo") {
    return "12%";
  } else if (
    ["size", "divisibility", "askingRate", "opEx"].includes(attribute.id)
  ) {
    return "10%";
  } else if (attribute.id === "comments") {
    return "26%";
  } else {
    return "12%";
  }
};

export function PDFPage({
  pageNumber,
  properties,
  attributes,
}: {
  pageNumber: number;
  properties: PropertySchema[];
  attributes: AttributeSchema[];
}) {
  function formatAddress(address: string | undefined) {
    if (!address) {
      return "";
    }
    return address;
  }

  function formatAttributeLabel(label: string) {
    if (label === "Address") {
      return "Address \n **Click for flyer**";
    }
    return label;
  }

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.table}>
        <View style={{ ...styles.tableHeader, ...styles.tableRow }}>
          <View style={styles.leftCol}>
            <Text style={styles.leftCell}></Text>
          </View>
          <View
            style={{ ...styles.tableCol, width: getWidth({ id: "photo" }) }}
          >
            <View style={styles.headerCell}></View>
          </View>
          {attributes.map((attribute) => (
            <View
              key={attribute.id}
              style={{
                ...styles.tableCol,
                width: getWidth(attribute),
              }}
            >
              <View style={styles.headerCell}>
                <Text>{formatAttributeLabel(attribute.label)}</Text>
              </View>
            </View>
          ))}
        </View>
        {properties.map((property, index) => (
          <View
            key={property.id}
            style={{
              ...styles.tableRow,
              backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
            }}
          >
            <View key={index} style={styles.leftCol}>
              <Text style={styles.leftCell}>
                {(pageNumber - 1) * 7 + index + 1}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Image
                style={styles.image}
                src={
                  property.photoUrl ??
                  "https://m.foolcdn.com/media/dubs/images/GettyImages-695968212.width-880.jpg"
                }
              />
            </View>
            {attributes.map((attribute) => (
              <View
                key={attribute.id}
                style={{
                  ...styles.tableCol,
                  width: getWidth(attribute),
                  fontWeight:
                    attribute.id === "displayAddress" ? "semibold" : "normal",
                }}
              >
                <View
                  style={
                    attribute.id === "comments"
                      ? styles.commentsCell
                      : styles.tableCell
                  }
                >
                  {attribute.id === "displayAddress" ? (
                    property.brochures[0]?.url ? (
                      <Link src={property.brochures[0]?.url ?? ""}>
                        {formatAddress(property.attributes.displayAddress)}
                      </Link>
                    ) : (
                      <Text>
                        {formatAddress(property.attributes.displayAddress)}
                      </Text>
                    )
                  ) : (
                    <Text>{property.attributes?.[attribute.id]}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.footer}></View>
    </Page>
  );
}
