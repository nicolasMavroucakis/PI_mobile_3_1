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
import DetalhesAgendamento from "./Pages/PrincipalApp/AgendamentosScreen/DetalhesAgendamento";
import EmpresaInfoMoneyScreen from "./Pages/UserInfo/Empresa/EmpresaInfoMoneyScreen";
import EmpresaInfoFuncionariosScreen from "./Pages/UserInfo/Empresa/EmpresaInfoFuncionariosScreen";

import { UserGlobalContextProvider } from "./GlobalContext/UserGlobalContext";

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
  DetalhesAgendamento: undefined;
  EmpresaInfoMoneyScreen: undefined;
  EmpresaInfoFuncionariosScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Page() {
  return (
    <UserGlobalContextProvider>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignCliente" component={SignCliente} options={{ headerShown: false }} />
        <Stack.Screen name="SignFuncionario" component={SignFuncionario} options={{ headerShown: false }} />
        <Stack.Screen name="SignEmpresa" component={SignEmpresa} options={{ headerShown: false }} />
        <Stack.Screen name="HomeApp" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AgendamentoScreen" component={AgendamentoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserScreen" component={UserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClienteConfig" component={ClienteConfigPage} options={{ headerShown: false }} />
        <Stack.Screen name="CategoriaScreen" component={CategoriaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmpresaInfoScreen" component={EmpresaInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdicionarCategoriaScreen" component={AdicionarCategoriaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesAgendamento" component={DetalhesAgendamento} options={{ headerShown: false }} />
        <Stack.Screen name="EmpresaInfoMoneyScreen" component={EmpresaInfoMoneyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmpresaInfoFuncionariosScreen" component={EmpresaInfoFuncionariosScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </UserGlobalContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#717171",
  },
});