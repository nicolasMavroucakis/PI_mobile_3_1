import { StyleSheet, View, StatusBar } from "react-native";
import LogInScreen from "./Pages/SingLog/LogInScreen";

export default function Page() {
  return (
    <View style={styles.container}>  
      <LogInScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#717171",
  },
});