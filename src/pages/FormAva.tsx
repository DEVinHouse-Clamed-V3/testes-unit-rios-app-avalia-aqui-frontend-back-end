import {
  Text,
  StyleSheet,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { AirbnbRating } from "react-native-ratings";
import { Switch } from "react-native-switch";
import { BASE_URL } from "@env";

interface Review {
  name: string;
  email: string;
  feedback: string;
  experience: string;
  recommend: boolean;
}

export default function FormAva(navigation: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [recommend, setRecommend] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const route = useRoute();

  const { productId, productName, productImage } = route.params as {
    productId: number;
    productName: string;
    productImage: string;
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/reviews`)
      .then((res) => {
        const filtered = res.data.filter(
          (review: any) => review.product_id === productId
        );
        setReviews(filtered);
      })
      .catch((err) => {
        console.error("Erro ao buscar avaliações:", err);
      });
  }, []);

  const handleRating = (rating: number) => {
    switch (rating) {
      case 1:
        setFeedback("ruim");
        break;
      case 2:
        setFeedback("regular");
        break;
      case 3:
        setFeedback("bom");
        break;
      case 4:
        setFeedback("muito bom");
        break;
      case 5:
        setFeedback("ótimo");
        break;
      default:
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !experience || !feedback) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }

    const review = {
      productId: productId,
      name: productName,
      email: email,
      experience: experience,
      recommend: recommend,
      feedback: feedback,
    };

    setLoading(true);

    const baseURL = BASE_URL;


    axios
      .post(`${BASE_URL}/reviews`, review)
      .then(() => {
        Alert.alert("Sucesso", "Feedback enviado com sucesso!");
        setName("");
        setEmail("");
        setExperience("");
        setFeedback("");
        setRecommend(false);

        // Atualizar lista de reviews
        axios
          .get(`${BASE_URL}/reviews`)
          .then((res) => {
            const filtered = res.data.filter(
              (review: any) => review.product_id === productId
            );
            setReviews(filtered);
          });
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{productName}</Text>
        <Image
          source={{ uri: productImage }}
          style={styles.productImage}
        />
      </View>

      <View>
        <Text style={styles.feedbackText}>Nos dê seu Feedback</Text>
        <Text style={styles.feedbackTextTwo}>
          Sua opinião é importante para nós. Por favor, compartilhe sua
          experiência.
        </Text>
      </View>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
        placeholderTextColor="#ccc"
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#ccc"
      />

      <TextInput
        style={styles.input}
        value={experience}
        onChangeText={setExperience}
        placeholder="Descreva sua experiência"
        placeholderTextColor="#ccc"
        multiline
        numberOfLines={3}
        maxLength={60}
      />

      <View>
        <Text style={styles.feedbackText}>Compartilhe seu feedback</Text>
        <AirbnbRating
          count={5}
          reviews={["Ruim", "Regular", "Bom", "Muito Bom", "Ótimo"]}
          defaultRating={0}
          onFinishRating={handleRating}
          size={30}
          reviewSize={12}
          reviewColor="#317bcf"
          selectedColor="#317bcf"
        />
      </View>

      <View>
        <Text style={styles.feedbackText}>
          Recomendaria para outras pessoas?
        </Text>
        <View style={styles.feedbackSwitch}>
          <Switch
            value={recommend}
            onValueChange={(value) => setRecommend(value)}
            activeText={"Sim"}
            inActiveText={"Não"}
            backgroundActive={"#317bcf"}
            backgroundInactive={"#ccc"}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonFeedback}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonFeedbackText}>Enviar Feedback</Text>
      </TouchableOpacity>

      <Text style={styles.feedbackText}>Últimas Avaliações</Text>

      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewCard}>
          <Text style={styles.reviewName}>{review.name}</Text>
          <Text style={styles.reviewText}>
            {review.feedback} - {review.experience}
          </Text>
          <Text style={styles.reviewRecommend}>
            Recomendou: {review.recommend ? "Sim" : "Não"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  productHeader: {
    alignItems: "center",
    marginTop: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productImage: {
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  feedbackText: {
    textAlign: "center",
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
    marginVertical: 10,
  },
  feedbackTextTwo: {
    textAlign: "center",
    marginHorizontal: 30,
    marginBottom: 20,
    color: "#666",
  },
  feedbackSwitch: {
    alignItems: "center",
  },
  buttonFeedback: {
    backgroundColor: "#317bcf",
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 10,
  },
  buttonFeedbackText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewCard: {
    backgroundColor: "#f6f6f6",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  reviewName: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
  },
  reviewText: {
    color: "#555",
    marginBottom: 5,
  },
  reviewRecommend: {
    color: "#888",
    fontSize: 12,
  },
});
