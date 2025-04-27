import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@env";

interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  description: string;
  url_image: string;
  category: string;
}

export default function Products({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listProducts = async () => {
      setLoading(true);

      const baseURL = BASE_URL;

      axios
        .get(`${BASE_URL}/products`)
        .then((response) => {
          setLoading(false);
          setProducts(response.data);
        })
        .catch(() => {
          Alert.alert("Não foi possivel obter a lista de produtos");
        });
    };
    listProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.url_image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity
          style={styles.evaluateButton}
          onPress={() =>
            navigation.navigate("FormAva", {
              productId: item.id,
              productName: item.name,
              productImage: item.url_image,
            })
          }
        >
          <Text style={styles.evaluateButtonText}>Avaliar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          testID="ActivityIndicator"
          size="large"
          color="#317bcf"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Produtos</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fbfb",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    color: "#515050",
    marginVertical: 15,
  },
  productContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 20,
    height: 230,
  },
  productImage: {
    width: 150,
    height: 180,
    resizeMode: "contain",
    marginBottom: 15,
    alignSelf: "center",
  },
  productInfo: {
    width: 200,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  productDescription: {
    marginVertical: 5,
    color: "#666",
  },
  productPrice: {
    fontSize: 14,
    color: "#900707",
    marginBottom: 10,
  },
  evaluateButton: {
    backgroundColor: "#317bcf",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  evaluateButtonText: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
