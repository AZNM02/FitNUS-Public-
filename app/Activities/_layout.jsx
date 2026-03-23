import { Tabs } from "expo-router";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../../constants/theme";

const ActivityLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D0D1A',
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: colors.accentOrange,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.40)',
      }}
    >
      <Tabs.Screen
        name="ActivityLog"
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Activity Log',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="dumbbell" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="AddExercise"
        options={{
          unmountOnBlur: true,
          tabBarLabel: 'Add Exercise',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircle" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default ActivityLayout;
