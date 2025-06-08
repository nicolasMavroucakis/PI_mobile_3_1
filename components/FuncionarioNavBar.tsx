import { TouchableOpacity, View, Image, Text } from "react-native";
import HomeNavBarStyle from "./HomeNavBarStyle";
import CalendarioImg from "./assets/Images/Calendario.png";
import { useNavigation } from '@react-navigation/native';
import HomeImg from "./assets/Images/Home.png";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UserImg from "./assets/Images/User.png";

type RootStackParamList = {
    SearchScreen: undefined;
    FuncionarioHomeScreen: undefined;
    EmpresaInfoAgendamentoScreen: undefined;
    FuncionarioAgendamentoScreen: undefined;
    UserScreen: undefined;
    FuncionarioScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FuncionarioNavBar = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={HomeNavBarStyle.containerNavBar}>
            <TouchableOpacity
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('FuncionarioHomeScreen')}
            >
                <Image source={HomeImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('FuncionarioAgendamentoScreen')}
            >
                <Image source={CalendarioImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Agendamentos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={HomeNavBarStyle.tamanhoBotao}
                onPress={() => navigation.navigate('FuncionarioScreen')}
            >
                <Image source={UserImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Perfil</Text>
            </TouchableOpacity>
        </View> );
};

export default FuncionarioNavBar;