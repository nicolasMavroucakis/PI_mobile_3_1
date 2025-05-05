import { TouchableOpacity, View, Image, Text } from "react-native";
import HomeNavBarStyle from "./HomeNavBarStyle";
import minhaPaginaImg from "./assets/Images/minhaPagina.png";
import FuncionarioImg from "../assets/images/funcionarios.png";
import UserScreen from "@/app/Pages/PrincipalApp/UserScreen/UserScreen";
import CalendarioImg from "./assets/Images/Calendario.png";
import { useNavigation } from '@react-navigation/native';
import HomeImg from "./assets/Images/Home.png";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SearchScreen: undefined;
    HomeApp: undefined;
    AgendamentoScreen: undefined;
    UserScreen: undefined;
    EmpresaInfoFuncionariosScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmpresaNavBar = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={HomeNavBarStyle.containerNavBar}>
            <TouchableOpacity
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('HomeApp')}
            >
                <Image source={HomeImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('EmpresaInfoFuncionariosScreen')}
            >
                <Image source={FuncionarioImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Funcionarios</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('AgendamentoScreen')}
            >
                <Image source={CalendarioImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Agendamento</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('UserScreen')}
            >
                <Image source={minhaPaginaImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>M.Pagina</Text>
            </TouchableOpacity>
        </View> );
};

export default EmpresaNavBar;