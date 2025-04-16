import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";

interface HomeProps {
  navigation: NavigationProp<any>;
}

export default function Home({ navigation }: HomeProps) {
  function navigateHomeButton() {
    navigation.navigate("Products");
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.containerImgHome}>
        <Image
          style={styles.imageHome}
          source={require("../../assets/zum.jpg")}
        ></Image>

        <Image
          style={styles.imageHome}
          source={require("../../assets/pan.jpg")}
        ></Image>

        <Image
          style={styles.imageHome}
          source={require("../../assets/its.jpg")}
        ></Image>
      </View>

      <Text style={styles.textAvalie}>Avalie Aqui</Text>
      <Text style={styles.textHome}>
        Escolha o produto que deseja avaliar e compartilhe sua experiência com
        outros consumidores.
      </Text>
      <TouchableOpacity style={styles.homeButton} onPress={navigateHomeButton}>
        <Text style={styles.textHomeButton}>Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerImgHome: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 40,
    gap: 10,
  },
  imageHome: {
    width: 110,
    height: 110,
  },
  textAvalie: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    color: "#515050",
    marginBottom: 15,
  },
  textHome: {
    textAlign: "center",
    fontSize: 18,
    color: "#949292",
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: "#317bcf",
    width: 100,
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  textHomeButton: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
