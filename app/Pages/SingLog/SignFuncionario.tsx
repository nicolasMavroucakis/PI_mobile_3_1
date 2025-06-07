import { ScrollView, TouchableOpacity, View, Text, TextInput, Alert } from "react-native";
import stylesSingLog from "./SignLogStyle";
import { useState } from "react";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    HomeApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignFuncionario = () => {
    const navigation = useNavigation<NavigationProp>();
    const { id: userId } = useUserGlobalContext();
    const {db} = StartFirebase();
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [rua, setRua] = useState('');
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
        setComplemento: setComplementoGlobal,
        setNumeroTelefone: setTelefoneGlobal,
    } = useUserGlobalContext();

    const handleCadastro = async () => {
        const emailId = email.trim().toLowerCase();
        if (!email || !senha || !nome || !cep || !cidade || !rua || !numero || !telefone) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // Verificar se o email já existe
            const usersRef = collection(db, "users");
            const userQuery = await getDocs(query(usersRef, where("email", "==", emailId)));
            
            if (!userQuery.empty) {
                Alert.alert("Aviso", "Já existe um usuário com esse email.");
                return;
            }

            // Buscar a empresa pelo userId do contexto global
            const empresasRef = collection(db, "empresas");
            const empresaQuery = await getDocs(query(empresasRef, where("userId", "==", userId)));

            if (empresaQuery.empty) {
                Alert.alert("Erro", "Empresa não encontrada.");
                return;
            }

            const empresaDoc = empresaQuery.docs[0];
            const empresaId = empresaDoc.id;

            // Criar documento do funcionário
            const userData = {
                createdAt: serverTimestamp(),
                email: emailId,
                endereco: {
                    cep,
                    cidade,
                    complemento: complemento || "",
                    numero,
                    rua,
                },
                fotoPerfil: "",
                nome,
                senha,
                telefone,
                tipoUsuario: "Funcionario",
                updatedAt: serverTimestamp()
            };

            const userDocRef = await addDoc(usersRef, userData);

            await updateDoc(doc(db, "empresas", empresaId), {
                funcionarios: arrayUnion(userDocRef.id)
            });

            setNomeGlobal(nome);
            setSenhaGlobal(senha);
            setUsuarioGlobal(emailId);
            setCidadeGlobal(true);
            setEnderecoGlobal(true);
            setNumeroGlobal(numero);
            setComplementoGlobal(complemento);
            setTelefoneGlobal(telefone);

            Alert.alert("Sucesso", "Cadastro realizado com sucesso.");
            navigation.navigate("HomeApp");
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            Alert.alert("Erro", "Erro ao cadastrar. Tente novamente.");
        }
    };

    return (
        <ScrollView style={{flex: 1}}>
            <View style={[stylesSingLog.container, {height: 1100}]}>
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
                        { label: 'Telefone', value: telefone, set: setTelefone },
                        { label: 'CEP', value: cep, set: setCep },
                        { label: 'Cidade', value: cidade, set: setCidade },
                        { label: 'Rua', value: rua, set: setRua },
                        { label: 'Numero', value: numero, set: setNumero },
                        { label: 'Complemento', value: complemento, set: setComplemento }
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