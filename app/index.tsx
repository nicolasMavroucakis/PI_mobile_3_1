import { StyleSheet, View, StatusBar } from "react-native";
import LogInScreen from "./Pages/SingLog/LogInScreen";
import SignIn from "./Pages/SingLog/SignInScreen";
import SignCliente from "./Pages/SingLog/SignCliente";
import SignFuncionario from "./Pages/SingLog/SignFuncionario";
import SignEmpresa from "./Pages/SingLog/SignEmpresa";
import HomeScreen from "./Pages/PrincipalApp/HomeScreen/HomeScreen";
import SearchScreen from "./Pages/PrincipalApp/SearchScreen.tsx/SearchScreen";
import UserScreen from "./Pages/PrincipalApp/UserScreen/UserScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgendamentoScreen from "./Pages/PrincipalApp/AgendamentosScreen/AgendamentosScreen";
import ClienteConfigPage from "./Pages/UserInfo/Cliente/ClienteConfigPage";
import EmpresaInfoScreen from "./Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreen";
import CategoriaScreen from "./Pages/PrincipalApp/CategoriaScreen/CategoriaScreen";
import AdicionarCategoriaScreen from "./Pages/PrincipalApp/CategoriaScreen/AdicionarCategoriaScreen";
import AdicionarServico from "./Pages/PrincipalApp/CategoriaScreen/AdicionarServico";

type RootStackParamList = {
  Login: undefined;
  SignIn: undefined;
  SignEmpresa: undefined;
  SignFuncionario: undefined;
  SignCliente: undefined;
  HomeApp: undefined;
  SearchScreen: undefined;
  AgendamentoScreen: undefined;
  UserScreen: undefined;
  ClienteConfig: undefined;
  CategoriaScreen: undefined;
  EmpresaInfoScreen: undefined;
  AdicionarCategoriaScreen: undefined;
  AdicionarServico:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Page() {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignCliente" component={SignCliente} options={{ headerShown: false }} />
        <Stack.Screen name="SignFuncionario" component={SignEmpresa} options={{ headerShown: false }} />
        <Stack.Screen name="SignEmpresa" component={SignFuncionario} options={{ headerShown: false }} />
        <Stack.Screen name="HomeApp" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AgendamentoScreen" component={AgendamentoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserScreen" component={UserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClienteConfig" component={ClienteConfigPage} options={{ headerShown: false }} />
        <Stack.Screen name="CategoriaScreen" component={CategoriaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmpresaInfoScreen" component={EmpresaInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdicionarCategoriaScreen" component={AdicionarCategoriaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdicionarServico" component={AdicionarServico} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#717171",
  },
});