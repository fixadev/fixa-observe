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
import { useMemo } from "react";
import {
  type ColumnWithIncludes,
  type PropertyWithIncludes,
} from "~/hooks/useSurvey";

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
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    fontFamily: "IBM Plex Sans",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: "12%",
    display: "flex",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  logo: {
    height: 20,
    display: "flex",
  },
  title: {
    display: "flex",
    fontSize: 25,
    fontWeight: "semibold",
    textAlign: "center",
  },
  table: {
    display: "flex",
    width: "100%",
    height: "88%",
    alignItems: "flex-start",
    flexDirection: "row",
  },

  tableCol: {
    // marginVertical: 1,
    // width: "auto",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "20%",
    height: "100%",
  },
  tableCell: {
    width: "100%",
    // maxHeight: "30px",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 10,
    padding: 5,
    position: "relative",

    borderStyle: "solid",
    borderColor: "#DDDEDE",
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  commentsCell: {
    textAlign: "left",
    fontSize: 8,
    padding: 5,
    width: "100%",
    borderStyle: "solid",
    borderColor: "#DDDEDE",
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  tableHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#F6F7F8",
    width: "20%",
    height: "100%",
  },

  headerCell: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlign: "left",
    fontSize: 10,
    fontWeight: "semibold",
    textTransform: "uppercase",
    padding: 5,
    paddingLeft: 15,
    color: "#999DA9",

    borderStyle: "solid",
    borderColor: "#DDDEDE",
    borderTopWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  image: {
    position: "relative",
    height: 90,
    width: 120,
    borderRadius: 10,
    zIndex: 100,
  },
  imageBubble: {
    height: 25,
    width: 25,
    fontWeight: "semibold",
    position: "absolute",
    top: 2,
    left: 2,
    backgroundColor: "#046bb6",
    color: "#FFFFFF",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    zIndex: 1,
  },
  footer: {
    height: 4,
    width: "100%",
    backgroundColor: "#046bb6",
    position: "absolute",
    bottom: 0,
  },
});

const getHeight = (attributeId: string) => {
  if (attributeId === "displayAddress") {
    return "12%";
  } else if (attributeId === "comments") {
    return "26%";
  } else {
    return "5%";
  }
};

export function ColumnsPage({
  pageNumber,
  properties,
  columns,
}: {
  pageNumber: number;
  properties: PropertyWithIncludes[];
  columns: ColumnWithIncludes[];
}) {
  function formatAddress(address: string | undefined) {
    if (!address) {
      return "";
    }

    return address;
  }

  const propertyIdToColumnIdToValue = useMemo(() => {
    return new Map(
      properties.map((property) => [
        property.id,
        new Map(
          property.propertyValues.map((value) => [value.columnId, value.value]),
        ),
      ]),
    );
  }, [properties]);

  // const brochureAttribute: AttributeSchema = {
  //   id: "brochure",
  //   label: "Brochure",
  //   type: "text",
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   ownerId: null,
  //   defaultIndex: 0,
  // };

  // const attributesWithBrochures = [...attributes];
  // attributesWithBrochures.splice(
  //   attributesWithBrochures.length - 1,
  //   0,
  //   brochureAttribute,
  // );

  const propertiesPerPage = 4;

  const linkColumn: ColumnWithIncludes = {
    id: "brochure",
    createdAt: new Date(),
    updatedAt: new Date(),
    displayIndex: 0,
    surveyId: "",
    attributeId: "brochure",
    attribute: {
      id: "brochure",
      ownerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      label: "Brochure",
      defaultIndex: 0,
      defaultVisible: true,
    },
  };

  const columnsWithBrochures = [...columns];

  columnsWithBrochures.splice(columnsWithBrochures.length - 1, 0, linkColumn);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Property Matrix</Text>
        <Image style={styles.logo} src="/images/newmark-dark.png" />
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.tableCell}>
            <View style={styles.image}></View>
          </View>
          <View
            style={{
              height: getHeight("displayAddress"),
              ...styles.headerCell,
            }}
          >
            <Text>Address</Text>
          </View>
          {columnsWithBrochures.map((column) => (
            <View
              key={column.id}
              style={{
                height: getHeight(column.attributeId),
                ...styles.headerCell,
              }}
            >
              <Text>{column.attribute.label}</Text>
            </View>
          ))}
        </View>
        {properties.map((property, index) => (
          <View
            key={property.id}
            style={{
              ...styles.tableCol,
            }}
          >
            <View style={styles.tableCell}>
              <Image
                style={styles.image}
                src={
                  property.photoUrl ??
                  "https://m.foolcdn.com/media/dubs/images/GettyImages-695968212.width-880.jpg"
                }
              />
              <View style={styles.imageBubble}>
                <Text>{(pageNumber - 1) * propertiesPerPage + index + 1}</Text>
              </View>
            </View>

            <View
              style={{
                ...styles.tableCell,
                height: getHeight("displayAddress"),
                fontWeight: "semibold",
              }}
            >
              <View>
                <Text>{formatAddress(property.address)}</Text>
              </View>
            </View>

            {columnsWithBrochures.map((column) => (
              <View
                key={column.id}
                style={{
                  ...(column.attributeId === "comments"
                    ? styles.commentsCell
                    : styles.tableCell),
                  height: getHeight(column.attributeId),
                  fontWeight:
                    column.attributeId === "displayAddress"
                      ? "semibold"
                      : "normal",
                }}
              >
                <View>
                  {column.attributeId === "brochure" ? (
                    property.brochures[0]?.url ? (
                      <Link
                        src={
                          property.brochures[0]?.exportedUrl ??
                          property.brochures[0]?.url ??
                          ""
                        }
                      >
                        Link
                      </Link>
                    ) : (
                      <Text></Text>
                    )
                  ) : (
                    <Text>
                      {propertyIdToColumnIdToValue
                        .get(property.id)
                        ?.get(column.id)}
                    </Text>
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
