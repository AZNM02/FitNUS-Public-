import { Stack } from "expo-router";
import { FitnessProvider } from "../context/FitnessContext";

const RootLayout = () => {
  return (
    <FitnessProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FitnessProvider>
  );
};

export default RootLayout;
