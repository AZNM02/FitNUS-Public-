import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FitnessProvider } from "../context/FitnessContext";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FitnessProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FitnessProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
