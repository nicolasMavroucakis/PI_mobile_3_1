import { ScrollView, TouchableOpacity, View, Text, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import stylesSingLog from "../../SingLog/SignLogStyle";

type RootStackParamList = {
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ClienteConfigPage = () => {
    const navigation = useNavigation<NavigationProp>();
    const { id: userId, setNome: setNomeGlobal, setSenha: setSenhaGlobal, setUsuarioGlobal, 
            setNumero: setNumeroGlobal, setComplemento: setComplementoGlobal, 
            setNumeroTelefone: setTelefoneGlobal } = useUserGlobalContext();
    const { db } = StartFirebase();

    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarDadosUsuario = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setNome(userData.nome || '');
                    setSenha(userData.senha || '');
                    setEmail(userData.email || '');
                    setTelefone(userData.telefone || '');
                    
                    // Carregar dados do endereço
                    if (userData.endereco) {
                        setCep(userData.endereco.cep || '');
                        setCidade(userData.endereco.cidade || '');
                        setRua(userData.endereco.rua || '');
                        setNumero(userData.endereco.numero || '');
                        setComplemento(userData.endereco.complemento || '');
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
            } finally {
                setIsLoading(false);
            }
        };

        carregarDadosUsuario();
    }, [userId]);

    const handleSalvarAlteracoes = async () => {
        if (!email || !senha || !nome || !cep || !cidade || !rua || !numero || !telefone) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const userRef = doc(db, "users", userId);
            const userData = {
                email: email.trim().toLowerCase(),
                endereco: {
                    cep,
                    cidade,
                    complemento: complemento || "",
                    numero,
                    rua,
                },
                nome,
                senha,
                telefone,
                updatedAt: serverTimestamp()
            };

            await updateDoc(userRef, userData);

            // Atualizar contexto global
            setNomeGlobal(nome);
            setSenhaGlobal(senha);
            setUsuarioGlobal(email.trim().toLowerCase());
            setNumeroGlobal(numero);
            setComplementoGlobal(complemento);
            setTelefoneGlobal(telefone);

            Alert.alert("Sucesso", "Dados atualizados com sucesso.");
            navigation.navigate("UserScreen");
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            Alert.alert("Erro", "Erro ao atualizar dados. Tente novamente.");
        }
    };

    if (isLoading) {
        return (
            <View style={[stylesSingLog.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={stylesSingLog.Title}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{flex: 1}} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={[stylesSingLog.container, { minHeight: 1300 }]}>
                <View style={stylesSingLog.containerTitleOther}>
                    <Text style={stylesSingLog.Title}>
                        Editar Informações
                    </Text>
                </View>
                <View style={[stylesSingLog.containerInput, { paddingBottom: 100 }]}>
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
                    <View style={{ gap: 10, marginTop: 20 }}>
                        <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleSalvarAlteracoes}>
                            <Text style={stylesSingLog.botaoTexto}>Salvar Alterações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[stylesSingLog.botaoCadastro, { backgroundColor: '#ff4444', borderColor: '#ff4444' }]} 
                            onPress={() => navigation.navigate('UserScreen')}
                        >
                            <Text style={stylesSingLog.botaoTexto}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ClienteConfigPage;