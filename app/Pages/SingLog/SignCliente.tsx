import { TextInput, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import stylesSingLog from "./SignLogStyle";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { doc, getDoc, setDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    HomeApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignCliente = () => {
    const navigation = useNavigation<NavigationProp>();
    const db = StartFirebase();

    const {
        setNome: setNomeGlobal,
        setSenha: setSenhaGlobal,
        setUsuarioGlobal,
        setCidade: setCidadeGlobal,
        setEndereco: setEnderecoGlobal,
        setNumero: setNumeroGlobal,
        setComplemento: setComplementoGlobal
    } = useUserGlobalContext();

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [cpf, setCpf] = useState('');

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
        if (!email || !senha || !nome || !cep || !cidade || !endereco || !numero || !cpf) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }
        try {
            const docRef = doc(db, "InfoUsuaEmpresaFuncionario", emailId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                Alert.alert("Aviso", "Já existe um usuário com esse email.");
                return;
            }
            const novoUsuario = {
                Cep: cep,
                Cidade: cidade,
                Complemento: complemento || "",
                Nome: nome,
                Numero: numero,
                Endereco: endereco,
                Senha: senha,
                CPF: cpf,
                TipoUsuario: "Cliente"
            };
            await setDoc(docRef, novoUsuario);

            setNomeGlobal(nome);
            setSenhaGlobal(senha);
            setUsuarioGlobal(email);
            setCidadeGlobal(true);
            setEnderecoGlobal(true);
            setNumeroGlobal(numero);
            setComplemento(complemento);

            Alert.alert("Sucesso", "Cadastro realizado com sucesso.");
            navigation.navigate("HomeApp");

        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            Alert.alert("Erro", "Erro ao cadastrar. Tente novamente.");
        }
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={[stylesSingLog.container]}>
                <View style={stylesSingLog.containerTitleOther}>
                    <Text style={stylesSingLog.Title}>
                        Adicione suas Informações
                    </Text>
                </View>
                <View style={stylesSingLog.containerInput}>
                    {[
                        { label: 'Email', value: email, set: setEmail },
                        { label: 'Senha', value: senha, set: setSenha, secure: true },
                        { label: 'Nome Completo', value: nome, set: setNome },
                        { label: 'CPF', value: cpf, set: setCpf },
                        { label: 'CEP', value: cep, set: handleCepChange },
                        { label: 'Cidade', value: cidade, set: setCidade },
                        { label: 'Endereco', value: endereco, set: setEndereco },
                        { label: 'Numero', value: numero, set: setNumero },
                        { label: 'Complemento', value: complemento, set: setComplemento },
                    ].map((input, index) => (
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
                                secureTextEntry={input.secure}
                                value={input.value}
                                onChangeText={input.set}
                            />
                        </View>
                    ))}
                    <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                        <Text style={stylesSingLog.botaoTexto}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignCliente;