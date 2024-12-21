import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function InfoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ paddingTop: 60 }}>
        <Text style={styles.title}>Practice Math with Nouns!</Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/images/glasses-hip-rose.png")}
          style={{ width: 150, height: 150, margin: 0, padding: 0 }}
        />
      </View>
      <View style={{ paddingBottom: 10 }}>
        <Text style={styles.sectionTitle}>What are Nouns?</Text>
        <View>
          <Text style={styles.text}>
            Nouns is an open-source, community-driven project featuring unique,
            pixel-art characters and assets. Operated under a Creative Commons
            Zero (CC0) license, Nouns assets are free to use without copyright
            restrictions. This app incorporates these assets to create a fun and
            engaging learning experience.
          </Text>
        </View>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.sectionTitle}>Purpose of the App</Text>
        <Text style={styles.text}>
          This app aims to make math learning enjoyable and effective by
          incorporating vibrant visuals, interactive challenges, and a playful
          environment. It focuses on improving basic arithmetic, number
          comparison, and logical reasoning for children.
        </Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.sectionTitle}>Legal Note</Text>
        <Text style={styles.text}>
          All Nouns-themed assets are used under the CC0 license. These assets
          are legally free for public use, ensuring there are no copyright
          restrictions or legal issues.
        </Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.sectionTitle}>Credits</Text>
        <Text style={styles.text}>
          This app is inspired by the Nouns project and is designed to support
          educational growth through creative technology. Visit{" "}
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => Linking.openURL("https://nouns.wtf")}
          >
            <Text style={styles.link}>nouns.wtf</Text>
            <FontAwesome
              name="external-link"
              size={16}
              color="#0645AD"
              style={styles.icon}
            />
          </TouchableOpacity>{" "}
          to learn more about the Nouns project.
        </Text>
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.sectionTitle}>Developer Info</Text>
        <Text style={styles.text}>
          This app was developed by Hannah Kang as part of the Mobile App Making
          course at Ewha Womans University.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#E4D025",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    textAlign: "justify",
  },
  link: {
    fontSize: 16,
    color: "#0645AD",
    textDecorationLine: "underline",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 5,
  },
});
