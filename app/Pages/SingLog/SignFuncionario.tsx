import { ScrollView, TouchableOpacity, View, Text, TextInput, Alert } from "react-native";
import stylesSingLog from "./SignLogStyle";
import { useState } from "react";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    HomeApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignFuncionario = () => {
    const navigation = useNavigation<NavigationProp>();
    const db = StartFirebase();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [categoria, setCategoria] = useState('');
    const [empresaId, setEmpresaId] = useState('');

    const {
        setNome: setNomeGlobal,
        setSenha: setSenhaGlobal,
        setUsuarioGlobal,
        setCidade: setCidadeGlobal,
        setEndereco: setEnderecoGlobal,
        setNumero: setNumeroGlobal,
        setComplemento: setComplementoGlobal,
        setNumeroTelefone: setTelefoneGlobal,
    } = useUserGlobalContext();

    const handleCadastro = async () => {
        const emailId = email.trim().toLowerCase();
        if (!email || !senha || !nome || !cep || !cidade || !rua || !numero || !empresaId) {
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

            const empresaRef = doc(db, "empresas", empresaId);
            const empresaDoc = await getDoc(empresaRef);
            
            if (!empresaDoc.exists()) {
                Alert.alert("Erro", "Empresa não encontrada.");
                return;
            }

            const userData = {
                nome,
                email: emailId,
                senha,
                tipoUsuario: "Funcionario",
                telefone: "",
                endereco: {
                    cep,
                    cidade,
                    rua,
                    numero,
                    complemento: complemento || ""
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const userRef = await addDoc(usersRef, userData);

            const funcionarioData = {
                userId: userRef.id,
                empresaId,
                nome,
                especialidades: [categoria || "Geral"],
                horarioTrabalho: {
                    inicio: "09:00",
                    fim: "18:00"
                },
                diasTrabalho: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const funcionarioRef = await addDoc(collection(db, "funcionarios"), funcionarioData);

            setNomeGlobal(nome);
            setSenhaGlobal(senha);
            setUsuarioGlobal(emailId);
            setCidadeGlobal(true);
            setEnderecoGlobal(true);
            setNumeroGlobal(numero);
            setComplementoGlobal(complemento);

            Alert.alert("Sucesso", "Cadastro realizado com sucesso.");
            navigation.navigate("HomeApp");
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            Alert.alert("Erro", "Erro ao cadastrar. Tente novamente.");
        }
    };

    return (
        <ScrollView style={{flex: 1}}>
            <View style={stylesSingLog.container}>
                <View style={stylesSingLog.containerTitleOther}>
                    <Text style={stylesSingLog.Title}>
                        Adicione suas Informações
                    </Text>
                </View>
                <View style={stylesSingLog.containerInput}>
                    {[
                        { label: 'Email', value: email, set: setEmail },
                        { label: 'Senha', value: senha, set: setSenha, secure: true },
                        { label: 'Nome', value: nome, set: setNome },
                        { label: 'CEP', value: cep, set: setCep },
                        { label: 'Cidade', value: cidade, set: setCidade },
                        { label: 'Rua', value: rua, set: setRua },
                        { label: 'Numero', value: numero, set: setNumero },
                        { label: 'Complemento', value: complemento, set: setComplemento },
                        { label: 'Categoria', value: categoria, set: setCategoria },
                        { label: 'ID da Empresa', value: empresaId, set: setEmpresaId },
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
                                secureTextEntry={input.secure || false}
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

export default SignFuncionario;