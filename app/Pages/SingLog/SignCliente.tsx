import { TextInput, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import stylesSingLog from "./SignLogStyle";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    HomeApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignCliente = () => {
    const navigation = useNavigation<NavigationProp>();
    const {db} = StartFirebase();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [telefone, setTelefone] = useState('');

    const {
        setNome: setNomeGlobal,
        setSenha: setSenhaGlobal,
        setUsuarioGlobal,
        setCidade: setCidadeGlobal,
        setEndereco: setEnderecoGlobal,
        setNumero: setNumeroGlobal,
        setNumeroTelefone: setTelefoneGlobal,
        setEmail: setEmailGlobal,
    } = useUserGlobalContext();

    const handleCepChange = async (cepDigitado: string) => {
        const onlyNumbers = cepDigitado.replace(/\D/g, '');
        setCep(onlyNumbers);

        if (onlyNumbers.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${onlyNumbers}/json/`);
                const data = await response.json();
                if (data.erro) {
                    Alert.alert("CEP inválido", "Não foi possível encontrar o endereço.");
                    return;
                }
                setCidade(data.localidade);
                setEndereco(data.logradouro);
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
                Alert.alert("Erro", "Não foi possível buscar o endereço.");
            }
        }
    };

    const handleCadastro = async () => {
        const emailId = email.trim().toLowerCase();
        if (!email || !senha || !nome || !cep || !cidade || !endereco || !numero || !telefone) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const usersRef = collection(db, "users");
            const userQuery = await getDocs(query(usersRef, where("email", "==", emailId)));
            
            if (!userQuery.empty) {
                Alert.alert("Aviso", "Já existe um usuário com esse email.");
                return;
            }

            const userData = {
                nome,
                email: emailId,
                senha,
                tipoUsuario: "Cliente",
                telefone,
                endereco: {
                    cep,
                    cidade,
                    rua: endereco,
                    numero,
                    complemento: complemento || ""
                },
                fotoPerfil: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const userRef = await addDoc(usersRef, userData);

            setNomeGlobal(nome);
            setSenhaGlobal(senha);
            setUsuarioGlobal(emailId);
            setCidadeGlobal(true);
            setEnderecoGlobal(true);
            setNumeroGlobal(numero);
            setTelefoneGlobal(telefone);
            setEmailGlobal(email);

            Alert.alert("Sucesso", "Cadastro realizado com sucesso.");
            navigation.navigate("HomeApp");
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            Alert.alert("Erro", "Erro ao cadastrar. Tente novamente.");
        }
    };

    const inputs = [
        { label: 'Email', value: email, set: setEmail },
        { label: 'Senha', value: senha, set: setSenha, secure: true },
        { label: 'Nome', value: nome, set: setNome },
        { label: 'CEP', value: cep, set: handleCepChange },
        { label: 'Cidade', value: cidade, set: setCidade },
        { label: 'Endereço', value: endereco, set: setEndereco },
        { label: 'Número', value: numero, set: setNumero },
        { label: 'Complemento', value: complemento, set: setComplemento },
        { label: 'Telefone', value: telefone, set: setTelefone },
    ];

    return (
        <ScrollView style={stylesSingLog.container}>
            <View style={stylesSingLog.containerTitleOther}>
                <Text style={stylesSingLog.Title}>Cadastro de Cliente</Text>
            </View>
            <View style={stylesSingLog.containerInput}>
                {inputs.map((input, index) => (
                    <View
                        key={index}
                        style={[
                            stylesSingLog.inputContainerOneInput,
                            { backgroundColor: 'transparent' },
                            stylesSingLog.inpuitDeBaixo
                        ]}
                    >
                        <Text style={{ color: '#00C20A' }}>{input.label}</Text>
                        <TextInput
                            style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                            placeholder=""
                            placeholderTextColor="#ccc"
                            value={input.value}
                            onChangeText={input.set}
                            secureTextEntry={input.secure}
                        />
                    </View>
                ))}
                <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                    <Text style={stylesSingLog.botaoTexto}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SignCliente;