import { ScrollView, TextInput, TouchableOpacity, View, Text, Alert, Modal, FlatList } from "react-native";
import stylesSingLog from "./SignLogStyle";
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    HomeApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Categoria {
    id: string;
    nome: string;
    empresas: string[];
}

interface CategoriasData {
    [key: string]: string[] | string;
    id: string;
}

const SignEmpresa = () => {
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
    const [categoriaId, setCategoriaId] = useState('');
    const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);
    const [categorias, setCategorias] = useState<string[]>([]);

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

    useEffect(() => {
        const carregarCategorias = async () => {
            try {
                console.log("Iniciando carregamento de categorias...");
                const categoriasRef = collection(db, "categorias");
                const categoriasSnapshot = await getDocs(categoriasRef);
                
                // Transformar o objeto de categorias em um array de strings
                const categoriasArray = categoriasSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return Object.keys(data).filter(key => key !== 'id');
                }).flat();

                console.log("Categorias processadas:", categoriasArray);
                setCategorias(categoriasArray);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            }
        };

        carregarCategorias();
    }, []);

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
        if (!email || !senha || !nome || !cep || !cidade || !endereco || !numero || !telefone || !categoriaId) {
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
                tipoUsuario: "Empresa",
                telefone,
                categoriaId,
                endereco: {
                    cep,
                    cidade,
                    rua: endereco,
                    numero,
                    complemento: complemento || ""
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const userRef = await addDoc(usersRef, userData);

            const empresaData = {
                userId: userRef.id,
                nome,
                categoriaId,
                horarioFuncionamento: {
                    inicio: "09:00",
                    fim: "18:00"
                },
                diasFuncionamento: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
                servicos: [],
                fotoPerfil: "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const empresaRef = await addDoc(collection(db, "empresas"), empresaData);

            // Atualizar a categoria selecionada com o ID da nova empresa
            const categoriaRef = doc(db, "categorias", categoriaId);
            await updateDoc(categoriaRef, {
                empresas: arrayUnion(empresaRef.id)
            });

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
        { label: 'Nome da Empresa', value: nome, set: setNome },
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
                <Text style={stylesSingLog.Title}>Cad de Empresa</Text>
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

                <View
                    style={[
                        stylesSingLog.inputContainerOneInput,
                        { backgroundColor: 'transparent' },
                        stylesSingLog.inpuitDeBaixo
                    ]}
                >
                    <Text style={{ color: '#00C20A' }}>Categoria</Text>
                    <TouchableOpacity
                        style={[stylesSingLog.input, { backgroundColor: 'transparent', justifyContent: 'center' }]}
                        onPress={() => setModalCategoriaVisible(true)}
                    >
                        <Text style={{ color: categoriaId ? "#fff" : "#ccc" }}>
                            {categoriaId || "Selecione uma categoria"}
                        </Text>
                    </TouchableOpacity>

                    <Modal
                        visible={modalCategoriaVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setModalCategoriaVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: 300 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: '#00C20A' }}>
                                    Selecione uma categoria
                                </Text>
                                <FlatList
                                    data={categorias}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setCategoriaId(item);
                                                setModalCategoriaVisible(false);
                                            }}
                                            style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                                        >
                                            <Text style={{ color: '#333', fontSize: 16 }}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity 
                                    onPress={() => setModalCategoriaVisible(false)} 
                                    style={{ marginTop: 10, alignItems: 'center' }}
                                >
                                    <Text style={{ color: '#B10000' }}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

                <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                    <Text style={stylesSingLog.botaoTexto}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default SignEmpresa;