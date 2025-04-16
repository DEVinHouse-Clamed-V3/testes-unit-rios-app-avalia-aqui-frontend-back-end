import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "./src/pages/Home";
import Products from "./src/pages/Products";
import FormAva from "./src/pages/FormAva";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
        />

        <Stack.Screen
          name="Products"
          component={Products}
        />

        <Stack.Screen
          name="FormAva"
          component={FormAva}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
