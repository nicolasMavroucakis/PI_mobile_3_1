import { SafeAreaView } from "react-native-safe-area-context"
import React, { useState } from 'react';
import { View, Image, Text, TextInput, Button, TouchableOpacity } from "react-native"
import stylesSingLog from "./SignLogStyle"
import SignIn from "./SignInScreen";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Login: undefined;
    SignIn: undefined;
    SignEmpresa: undefined;
    SignFuncionario: undefined;
    SignCliente: undefined;
  };

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LogInScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation<NavigationProp>();

    const handleCadastro = () => {
        navigation.navigate("SignIn"); 
      };

    return(
        <View style={stylesSingLog.container}>
            <View style={stylesSingLog.containerImage}>
                <Image source={require("../../../assets/images/image2.png")} style={stylesSingLog.Logo} />
            </View>
            <View style={stylesSingLog.containerInput}>
                <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent' }]}>
                    <Text style={{color: '#00C20A'}}>
                        Email
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent' }, stylesSingLog.inpuitDeBaixo]}>
                    <Text style={{color: '#00C20A'}}>
                        Senha
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <View style={stylesSingLog.esqueceuSenha}>
                    <View>
                        <Text style={{ color: '#fff', fontSize: 18, marginLeft: 10 }}>Esqueceu</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={handleCadastro} style={stylesSingLog.buttonSenha}>
                            <Text style={stylesSingLog.buttonText}>a sua Senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                    <Text style={stylesSingLog.botaoTexto}>Entre</Text>
                </TouchableOpacity>
            </View>
            <View style={stylesSingLog.cadastreseText}>
                <View>
                    <Text style={{ color: '#fff', fontSize: 15, marginLeft: 10 }}>Não tem conta ainda?</Text>
                </View>
                <View>
                <TouchableOpacity onPress={handleCadastro} style={stylesSingLog.button}>
                    <Text style={stylesSingLog.buttonText}>Cadastre-se</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default LogInScreen