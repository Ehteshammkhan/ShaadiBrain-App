import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
// import MyWeddingsScreen from "../screens/weddings/MyWeddingsScreen";
// import CreateWeddingScreen from "../screens/weddings/CreateWeddingScreen";
// import EventsScreen from "../screens/events/EventsScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      {/* Keep Home */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* New flow */}
      {/* <Stack.Screen name="MyWeddings" component={MyWeddingsScreen} /> */}
      {/* <Stack.Screen name="CreateWedding" component={CreateWeddingScreen} /> */}
      {/* <Stack.Screen name="Events" component={EventsScreen} /> */}
    </Stack.Navigator>
  );
}