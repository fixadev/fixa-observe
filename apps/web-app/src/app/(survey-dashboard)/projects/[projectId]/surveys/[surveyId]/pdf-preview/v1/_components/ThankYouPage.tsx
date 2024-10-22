import { Page, StyleSheet, Font, Image } from "@react-pdf/renderer";

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
    width: "100%",
    height: "100%",
    // position: "absolute",
    // right: 0,
    // bottom: 0,
  },
});

export function ThankYouPage() {
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Image src={"/images/ThankYou.png"} style={styles.image} />
    </Page>
  );
}
