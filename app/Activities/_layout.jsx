import {Tabs} from "expo-router";
import { AntDesign,FontAwesome5,} from "@expo/vector-icons";


const ActivityLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen
        name = "ActivityLog"
        options={{
      unmountOnBlur:true,
      tabBarLabel: 'Activity Log',
      tabBarIcon: ({ color, size }) => (
        <FontAwesome5 name="dumbbell" color={color} size={size} />
      ),
    }}
        /> 
         <Tabs.Screen
        name = "AddExercise"
        options={{
      unmountOnBlur:true,
      tabBarLabel: 'Add Exercise',
      tabBarIcon: ({ color, size }) => (
        <AntDesign name="pluscircle" color={color} size={size} />
      ),
    }}
        /> 
        
       
        </Tabs>
    </>
  )
}

export default ActivityLayout

