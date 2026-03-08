import { setBackgroundColorAsync } from "expo-system-ui";
import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#474eff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop:30,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});

const Button = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.appButtonContainer}
      disabled={isLoading}
    >
      <Text style={styles.appButtonText}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default Button ;