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
import DetalhesAgendamento from "./Pages/PrincipalApp/AgendamentosScreen/DetalhesAgendamento";
import EmpresaInfoMoneyScreen from "./Pages/UserInfo/Empresa/EmpresaInfoMoneyScreen";
import EmpresaInfoFuncionariosScreen from "./Pages/UserInfo/Empresa/EmpresaInfoFuncionariosScreen";
import EmpresaInfoAgendamentoScreen from "./Pages/UserInfo/Empresa/EmpresaInfoAgendamentoScreen";
import EmpresaMinhaPaginaScreen from "./Pages/UserInfo/Empresa/EmpresaMinhaPaginaScreen";
import ReservaScreen from "./Pages/ReservaScreen/ReservaScreen";
import ChangeEmpresaInfo from "./Pages/SingLog/ChangeEmpresaInfo";
import ConfigEmpresaInfo from "./Pages/UserInfo/Empresa/ConfigEmpresaInfo";
import FecharAgendaDia from "./Pages/UserInfo/Empresa/FecharAgendaDia";
import AdicionarFerias from "./Pages/UserInfo/Empresa/AdicionarFerias";
import AdicionarLicenca from "./Pages/UserInfo/Empresa/AdicionarLicenca";
import IniciarAgendamentoScreen from "./Pages/UserInfo/Empresa/IniciarAgendamentoScreen";
import AgendamentosScreen from "./Pages/PrincipalApp/AgendamentosScreen/AgendamentosScreen";
import DetalhesAgendamentoStatusChangeScreen from "./Pages/PrincipalApp/AgendamentosScreen/DetalhesAgendamentoScreen";

import { UserGlobalContextProvider } from "./GlobalContext/UserGlobalContext";
import { EmpresaGlobalContextProvider } from "./GlobalContext/EmpresaGlobalContext";
import { EmpresaProvider } from "./GlobalContext/EmpresaReservaGlobalContext";
import { AgendamentoServicosProvider } from "./GlobalContext/AgendamentoServicosGlobalContext";

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
  AdicionarServico: undefined;
  DetalhesAgendamento: undefined;
  EmpresaInfoMoneyScreen: undefined;
  EmpresaInfoFuncionariosScreen: undefined;
  EmpresaInfoAgendamentoScreen: undefined;
  EmpresaMinhaPaginaScreen: undefined;
  ReservaScreen: undefined;
  ChangeEmpresaInfo: undefined;
  ConfigEmpresaInfo: undefined;
  FecharAgendaDia: undefined;
  AdicionarFerias: undefined;
  AdicionarLicenca: undefined;
  IniciarAgendamentoScreen: undefined;
  AgendamentosScreen: undefined;
  DetalhesAgendamentoStatusChangeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Page() {
  return (
    <UserGlobalContextProvider>
      <EmpresaGlobalContextProvider>
        <EmpresaProvider>
          <AgendamentoServicosProvider>
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
              <Stack.Screen name="AdicionarServico" component={AdicionarServico} options={{ headerShown: false }} />
              <Stack.Screen name="DetalhesAgendamento" component={DetalhesAgendamento} options={{ headerShown: false }} />
              <Stack.Screen name="EmpresaInfoMoneyScreen" component={EmpresaInfoMoneyScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EmpresaInfoFuncionariosScreen" component={EmpresaInfoFuncionariosScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EmpresaInfoAgendamentoScreen" component={EmpresaInfoAgendamentoScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EmpresaMinhaPaginaScreen" component={EmpresaMinhaPaginaScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ReservaScreen" component={ReservaScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ChangeEmpresaInfo" component={ChangeEmpresaInfo} options={{ headerShown: false }} />
              <Stack.Screen name="ConfigEmpresaInfo" component={ConfigEmpresaInfo} options={{ headerShown: false }} />
              <Stack.Screen name="FecharAgendaDia" component={FecharAgendaDia} options={{ headerShown: false }} />
              <Stack.Screen name="AdicionarFerias" component={AdicionarFerias} options={{ headerShown: false }} />
              <Stack.Screen name="AdicionarLicenca" component={AdicionarLicenca} options={{ headerShown: false }} />
              <Stack.Screen name="IniciarAgendamentoScreen" component={IniciarAgendamentoScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AgendamentosScreen" component={AgendamentosScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DetalhesAgendamentoStatusChangeScreen" component={DetalhesAgendamentoStatusChangeScreen} options={{ headerShown: false }} />
            </Stack.Navigator>      
          </AgendamentoServicosProvider>
        </EmpresaProvider>
      </EmpresaGlobalContextProvider>
    </UserGlobalContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#717171",
  },
});