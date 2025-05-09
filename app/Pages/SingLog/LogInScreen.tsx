import React, { useState } from 'react';
import {
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { collection, query, where, getDocs } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import stylesSingLog from "./SignLogStyle";
import { useUserGlobalContext } from '@/app/GlobalContext/UserGlobalContext';

type RootStackParamList = {
    Login: undefined;
    SignIn: undefined;
    SignEmpresa: undefined;
    SignFuncionario: undefined;
    SignCliente: undefined;
    HomeApp: undefined;
    AdicionarCategoriaScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LogInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();

    const {
        setNome: setNomeGlobal,
        setSenha: setSenhaGlobal,
        setUsuarioGlobal,
        setCidade: setCidadeGlobal,
        setEndereco: setEnderecoGlobal,
        setNumero: setNumeroGlobal,
        setNumeroTelefone: setTelefoneGlobal,
        setEmail: setEmailGlobal,
        setId: setIdGlobal,
    } = useUserGlobalContext();

    const handleCadastro = () => {
        navigation.navigate("SignIn");
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha o email e a senha.");
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        console.log("Email consultado:", normalizedEmail);
        console.log("Senha digitada:", password);

        try {
            // Buscar usuário no Firestore por email e senha
            const usersRef = collection(db, "users");
            const q = query(
                usersRef,
                where("email", "==", normalizedEmail),
                where("senha", "==", password)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                // Setando os dados no contexto global
                setNomeGlobal(userData.nome || '');
                setSenhaGlobal(userData.senha || '');
                setUsuarioGlobal(userData.tipoUsuario);
                setCidadeGlobal(userData.endereco?.cidade || '');
                setEnderecoGlobal(userData.endereco?.rua || '');
                setNumeroGlobal(userData.endereco?.numero || '');
                setTelefoneGlobal(userData.telefone || '');
                setEmailGlobal(email);
                setIdGlobal(userDoc.id);
                console.log("ID do usuário definido:", userDoc.id);
                navigation.navigate("HomeApp");
            } else {
                Alert.alert("Erro", "Usuário ou senha incorretos.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            Alert.alert("Erro", "Algo deu errado. Tente novamente.");
        }
    };

    return (
        <View style={stylesSingLog.container}>
            <View style={stylesSingLog.containerImage}>
                <Image
                    source={require("../../../assets/images/image2.png")}
                    style={stylesSingLog.Logo}
                />
            </View>
            <View style={stylesSingLog.containerInput}>
                <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent' }]}>
                    <Text style={{ color: '#00C20A' }}>Email</Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={[
                    stylesSingLog.inputContainerOneInput,
                    { backgroundColor: 'transparent' },
                    stylesSingLog.inpuitDeBaixo
                ]}>
                    <Text style={{ color: '#00C20A' }}>Senha</Text>
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
                        <TouchableOpacity onPress={() => navigation.navigate('AdicionarCategoriaScreen')} style={stylesSingLog.buttonSenha}>
                            <Text style={stylesSingLog.buttonText}>a sua Senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleLogin}>
                    <Text style={stylesSingLog.botaoTexto}>Entre</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('HomeApp')}>
                    <Text>
                        Dev
                    </Text>    
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
    );
};

export default LogInScreen;