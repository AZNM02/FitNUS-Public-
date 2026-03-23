import { Tabs } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";

const NutritionLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D1A',
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: colors.accentGreen,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.40)',
      }}
    >
      <Tabs.Screen
        name="Nutrition"
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Nutrition Log',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddMeal"
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Add Meal',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default NutritionLayout;
