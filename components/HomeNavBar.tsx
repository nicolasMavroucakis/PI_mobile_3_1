import { TouchableOpacity, View, Image, Text } from "react-native";
import HomeNavBarStyle from "./HomeNavBarStyle";
import HomeImg from "./assets/Images/Home.png";
import BuscaImg from "./assets/Images/Busca.png";
import UserImg from "./assets/Images/User.png";
import UserScreen from "@/app/Pages/PrincipalApp/UserScreen/UserScreen";
import CalendarioImg from "./assets/Images/Calendario.png";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    SearchScreen: undefined;
    HomeApp: undefined;
    AgendamentoScreen: undefined;
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeNavBar = () => {
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
                onPress={() => navigation.navigate('SearchScreen')}
            >
                <Image source={BuscaImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Busca</Text>
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
                <Image source={UserImg} style={HomeNavBarStyle.tamanhoImagem} />
                <Text style={HomeNavBarStyle.text}>Perfil</Text>
            </TouchableOpacity>
        </View> );
};

export default HomeNavBar;