import {
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Svg,
} from "@react-pdf/renderer";

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
    fontFamily: "IBM Plex Sans",
    backgroundColor: "#FFFFFF",
    width: "100%",
    height: "100%",
    position: "relative",
    padding: 0,
  },
  image: {
    position: "absolute",
    top: -2,
    left: -2,
    right: 0,
    bottom: 0,
  },
  quadrangle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 40,
    color: "#FFFFFF",
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  subheader: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 20,
    textAlign: "right",
    fontSize: 18,
  },
  newmarkLogo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: "30%",
  },
});

export function CoverPage() {
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={"/images/CoverPage.png"} style={styles.image} />
      {/* <Image src={"/images/palo-alto.jpg"} style={styles.image} />
      <View style={styles.quadrangle}>
        <Text style={styles.header}>Peninsula Property Survey</Text>
        <Text style={styles.footer}>Colin Kloezeman</Text>
        <Image src={"/images/newmark.png"} style={styles.newmarkLogo} />
      </View> */}
    </Page>
  );
}
