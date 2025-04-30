import { useState } from "react"
import stylesSingLog from "./SignLogStyle"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import HomeScreen from "../PrincipalApp/HomeScreen/HomeScreen";

type RootStackParamList = {
    Login: undefined;
    SignIn: undefined;
    SignEmpresa: undefined;
    SignCliente: undefined;
    HomeScreen: undefined
  };

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const SignIn = () => {
    const [usuario, setUsuario] = useState(false);
    const [empresa, setEmpresa] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const handleClick = (tipo: string) => {
        if (tipo === 'usuario') {
            setUsuario(prev => !prev);
            setEmpresa(false);
        } else if (tipo === 'empresa') {
            setEmpresa(prev => !prev);
            setUsuario(false);
        };
    }

    const handleCadastro = () => {
        if (usuario) {
            navigation.navigate("SignCliente"); 
        } else if (empresa) {
            navigation.navigate("SignEmpresa"); 
        } else {
            Alert.alert(
                "Erro ao entrar",
                "Selecione um tipo de cadastro antes de continuar.",
                [{ text: "OK", style: "destructive" }]
              );
        }
    };

    return (
        <View style={stylesSingLog.container}>
            <View style={stylesSingLog.containerTitle}>
                <Text style={stylesSingLog.Title}>
                    Quer se registrar como:
                </Text>
            </View>
            <View style={stylesSingLog.containerRegistrar}>
                <TouchableOpacity style={stylesSingLog.TouchableOpacityContainer} onPress={() => handleClick('usuario')}>
                    <View>
                        <Image source={require("../../../assets/images/cliente.png")} style={stylesSingLog.imgTipo} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
                            Cliente
                        </Text>
                    </View>
                    <View style={usuario ? stylesSingLog.squareActive : stylesSingLog.square} />
                </TouchableOpacity>
                <TouchableOpacity style={stylesSingLog.TouchableOpacityContainer} onPress={() => handleClick('empresa')}>
                    <View>
                        <Image source={require("../../../assets/images/empresa.png")} style={stylesSingLog.imgTipo} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
                            Empresa
                        </Text>
                    </View>
                    <View style={empresa ? stylesSingLog.squareActive : stylesSingLog.square} />
                </TouchableOpacity>
            </View>
            <View style={stylesSingLog.botaoFinal}>
                <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                    <Text style={stylesSingLog.botaoTexto}>Avançar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignIn;