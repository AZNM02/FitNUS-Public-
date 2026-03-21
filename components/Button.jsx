import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#474eff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 12,
    marginBottom: 20,
    marginTop: 30,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});

const Button = ({
  title,
  handlePress,
  style,
  textStyle,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.appButtonContainer, style]}
      disabled={isLoading}
    >
      <Text style={[styles.appButtonText, textStyle]}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
        />
      )}
    </TouchableOpacity>
  );
};

export default Button ;