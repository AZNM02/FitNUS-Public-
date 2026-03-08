import {Tabs,} from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const NutritionLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen
        name = "Nutrition"
        options={{
      unmountOnBlur:true,
      tabBarLabel: 'Nutrition Log',
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="food" color={color} size={size} />
      ),
    }}
        />
        <Tabs.Screen
        name = "AddMeal"
        options={{
      unmountOnBlur:true,
      tabBarLabel: 'Add Meal',
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="pluscircle" color={color} size={size} />
      ),
    }}
        />  
        
       
        </Tabs>
    </>
  )
}

export default NutritionLayout

