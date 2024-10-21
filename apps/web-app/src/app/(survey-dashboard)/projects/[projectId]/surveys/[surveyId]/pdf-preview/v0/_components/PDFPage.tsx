/* eslint-disable jsx-a11y/alt-text */
import { Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import { type AttributeSchema, type PropertySchema } from "~/lib/property";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingTop: 20,
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
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    backgroundColor: "#046bb6",
    color: "#FFFFFF",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  leftCol: {
    width: "15px",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#046bb6",
    color: "#FFFFFF",
    textAlign: "center",
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
    fontSize: 8,
    marginLeft: 3,
    marginVertical: 3,
    maxHeight: 50,
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
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    marginVertical: 5,
    fontSize: 10,
  },

  image: {
    height: 53,
    width: "100%",
  },
});

const getWidth = (attribute: AttributeSchema) => {
  if (attribute.id === "address") {
    return "14%";
  } else if (attribute.id === "size") {
    return "8%";
  } else if (attribute.id === "divisibility") {
    return "10%";
  } else if (attribute.id === "askingRate" || attribute.id === "opEx") {
    return "10%";
  } else if (attribute.id === "comments") {
    return "20%";
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
  console.log("properties", properties);
  console.log("attributes", attributes);

  function formatAttributeLabel(label: string) {
    if (label === "Address") {
      return "Address \n **Click address for \n flyer/website**";
    }
    return label;
  }

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Image
          style={{ width: "20%" }}
          src="https://mma.prnewswire.com/media/1057994/Newmark_Group_Inc_Logo.jpg?p=facebook"
        />
        <Text style={styles.title}>Property Survey</Text>
      </View>
      <View style={styles.table}>
        <View style={{ ...styles.tableHeader, ...styles.tableRow }}>
          <View style={styles.leftCol}>
            <Text style={styles.leftCell}></Text>
          </View>
          <View style={{ ...styles.tableCol, width: "10%" }}>
            <View style={styles.headerCell}>
              <Text>Photo</Text>
            </View>
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
          <View key={property.id} style={styles.tableRow}>
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
                style={{ ...styles.tableCol, width: getWidth(attribute) }}
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
                        {property.attributes.displayAddress}
                      </Link>
                    ) : (
                      <Text>{property.attributes.displayAddress}</Text>
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
    </Page>
  );
}
