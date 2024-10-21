import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
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
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    height: "100%",
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
    right: 0,
    textAlign: "center",
    fontSize: 18,
  },
});

export function CoverPage() {
  // ... existing code ...

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View>
        <Text style={styles.header}>Peninsula Property Survey</Text>
        <Text style={styles.subheader}>Prepared for: Oliver</Text>
        <Text style={styles.footer}>Colin Kloezeman</Text>
      </View>
    </Page>
  );
}
