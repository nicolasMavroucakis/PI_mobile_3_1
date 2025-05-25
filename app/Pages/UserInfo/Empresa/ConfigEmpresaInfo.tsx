import EmpresaNavBar from "@/components/EmpresaNavBar"
import { ScrollView, TouchableOpacity, View, Image, Text } from "react-native"
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle"
import setaImg from "../../../../assets/images/seta.png";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import addImg from "../../../../assets/images/add.png"
import deleteImg from "../../../../assets/images/deleteImg.png"
import lapisImg from "../../../../assets/images/lapis.png"
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    AdicionarCategoriaScreen: undefined;
    AdicionarServico: undefined;
    ConfigEmpresaInfo: undefined;
    SignFuncionario: undefined;
    FecharAgendaDia: undefined;
    AdicionarFerias: undefined;
    AdicionarLicenca: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConfigEmpresaInfo = () => {
    const navigation = useNavigation<NavigationProp>();
    const { categorias, deleteCategoria, servicos, deleteServico } = useEmpresaGlobalContext(); 
    
    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Configurações</Text>
                <TouchableOpacity style={{ width: 30, height: 30, marginRight: 10 }}/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[UserScreenStyle.containerRest, { minHeight: 750, flexGrow: 1, paddingBottom: 100 }]}>
                <View>
                    <TouchableOpacity style={EmpresaInfoMoneyScreenStyle.touchableOpacityAdd} onPress={() => navigation.navigate("SignFuncionario")}>
                        <Text style={{color: 'white', fontWeight: 'bold',fontSize: 18}}>Adicionar Funcionário</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={EmpresaInfoMoneyScreenStyle.touchableOpacityAdd} onPress={() => navigation.navigate("FecharAgendaDia")}>
                        <Text style={{color: 'white', fontWeight: 'bold',fontSize: 18}}>Fechar Agenda de um Dia</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={EmpresaInfoMoneyScreenStyle.touchableOpacityAdd} onPress={() => navigation.navigate("AdicionarFerias")}>
                        <Text style={{color: 'white', fontWeight: 'bold',fontSize: 18}}>Adicionar Ferias</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={EmpresaInfoMoneyScreenStyle.touchableOpacityAdd} onPress={() => navigation.navigate("AdicionarLicenca")}>
                        <Text style={{color: 'white', fontWeight: 'bold',fontSize: 18}}>Adicionar Licença</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
            <EmpresaNavBar />
        </View>
    )
}

export default ConfigEmpresaInfo
