import { ScrollView, TextInput, TouchableOpacity, View, Text, Alert, Modal, FlatList } from "react-native";
import stylesSingLog from "./SignLogStyle";
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { AntDesign } from "@expo/vector-icons";

type RootStackParamList = {
    UserScreen: undefined;
    HomeApp: undefined;
    EmpresaMinhaPaginaScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const diasSemana = [
    "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"
];

const ChangeEmpresaInfo = () => {
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
    const [categoria, setCategoria] = useState('');
    const [linkSite, setLinkSite] = useState('');
    const [linkInstagram, setLinkInstagram] = useState('');
    const [intervaloServicos, setIntervaloServicos] = useState('');
    const [sobreNos, setSobreNos] = useState('');
    const { id: userId } = useUserGlobalContext();
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

    function formatarHorario(input: string) {
        let value = input.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 3) {
            return value.slice(0, 2) + ":" + value.slice(2, 4);
        }
        return value;
    }

    type HorarioDia = { inicio: string; fim: string; almocoInicio: string; almocoFim: string };
    type HorariosSemana = { [key: string]: HorarioDia };
    const [horarios, setHorarios] = useState<HorariosSemana>(
        diasSemana.reduce((acc, dia) => {
            acc[dia] = { inicio: "", fim: "", almocoInicio: "", almocoFim: "" };
            return acc;
        }, {} as HorariosSemana)
    );

    type AbertosSemana = { [key: string]: boolean };
    const [abertos, setAbertos] = useState<AbertosSemana>(
        diasSemana.reduce((acc, dia) => {
            acc[dia] = false;
            return acc;
        }, {} as AbertosSemana)
    );

    const handleHorarioChange = (dia: string, campo: string, valor: string) => {
        setHorarios((prev) => ({
            ...prev,
            [dia]: {
                ...prev[dia],
                [campo]: formatarHorario(valor)
            }
        }));
    };

    const handleAbertoFechado = (dia: string) => {
        setAbertos(prev => ({
            ...prev,
            [dia]: !prev[dia]
        }));
    };

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

    useEffect(() => {
        const fetchEmpresa = async () => {
            if (!userId) return;
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setSenha(userData.senha || "");
                }

                const empresasRef = collection(db, "empresas");
                const q = query(empresasRef, where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const empresaDoc = querySnapshot.docs[0];
                    const data = empresaDoc.data();
                    setNome(data.nome || "");
                    setEmail(data.email || "");
                    setTelefone(data.telefone || "");
                    setCategoria(data.categoria || "");
                    setLinkSite(data.linkSite || "");
                    setLinkInstagram(data.linkInstagram || "");
                    setIntervaloServicos(data.intervaloEntreServicos ? String(data.intervaloEntreServicos) : "");
                    setCep(data.endereco?.cep || "");
                    setCidade(data.endereco?.cidade || "");
                    setEndereco(data.endereco?.rua || "");
                    setNumero(data.endereco?.numero || "");
                    setComplemento(data.endereco?.complemento || "");
                    setSobreNos(data.sobre_nos || "");
                    // Preencher horários e abertos se existirem
                    if (data.horarioFuncionamento) {
                        const horariosFirestore = data.horarioFuncionamento;
                        setHorarios(prev => {
                            const novo = { ...prev };
                            diasSemana.forEach(dia => {
                                if (horariosFirestore[dia.toLowerCase()]) {
                                    const diaData = horariosFirestore[dia.toLowerCase()];
                                    const horariosArr = diaData.horarios || [];
                                    novo[dia] = {
                                        inicio: horariosArr[0]?.inicio || "",
                                        fim: horariosArr[horariosArr.length-1]?.fim || "",
                                        almocoInicio: horariosArr[0]?.fim || "",
                                        almocoFim: horariosArr[1]?.inicio || ""
                                    };
                                }
                            });
                            return novo;
                        });
                        setAbertos(prev => {
                            const novo = { ...prev };
                            diasSemana.forEach(dia => {
                                if (horariosFirestore[dia.toLowerCase()]) {
                                    novo[dia] = horariosFirestore[dia.toLowerCase()].aberto ?? false;
                                }
                            });
                            return novo;
                        });
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados da empresa.");
            }
        };
        fetchEmpresa();
    }, [userId]);

    useEffect(() => {
        const carregarCategorias = async () => {
            try {
                const categoriasRef = collection(db, "categorias");
                const categoriasSnapshot = await getDocs(categoriasRef);
                
                // Transformar o objeto de categorias em um array de strings
                const categoriasArray = categoriasSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return Object.keys(data).filter(key => key !== 'id');
                }).flat();

                setCategorias(categoriasArray);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                Alert.alert("Erro", "Não foi possível carregar as categorias.");
            }
        };

        carregarCategorias();
    }, []);

    const handleCadastro = async () => {
        const emailId = email.trim().toLowerCase();
        if (!email || !senha || !nome || !cep || !cidade || !endereco || !numero || !telefone || !categoria) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // Buscar empresa pelo campo userId
            const empresasRef = collection(db, "empresas");
            const q = query(empresasRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            let empresaDocRef;
            let empresaId = null;
            let categoriaAnterior = null;
            if (!querySnapshot.empty) {
                empresaDocRef = querySnapshot.docs[0].ref;
                empresaId = querySnapshot.docs[0].id;
                categoriaAnterior = querySnapshot.docs[0].data().categoria;
            } else {
                Alert.alert("Erro", "Empresa não encontrada para este usuário.");
                return;
            }
            // Montar objeto de horários para Firestore
            const horarioFuncionamentoFirestore: { [key: string]: any } = {};
            diasSemana.forEach(dia => {
                horarioFuncionamentoFirestore[dia.toLowerCase()] = {
                    aberto: abertos[dia],
                    horarios: [
                        { inicio: horarios[dia].inicio, fim: horarios[dia].fim },
                        { inicio: horarios[dia].almocoInicio, fim: horarios[dia].almocoFim }
                    ]
                };
            });
            await setDoc(
                empresaDocRef,
                {
                    nome,
                    email,
                    telefone,
                    categoria,
                    linkSite,
                    linkInstagram,
                    intervaloEntreServicos: Number(intervaloServicos),
                    endereco: {
                        cep,
                        cidade,
                        rua: endereco,
                        numero,
                        complemento: complemento || ""
                    },
                    sobre_nos: sobreNos,
                    horarioFuncionamento: horarioFuncionamentoFirestore,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );

            // Atualizar o documento de categorias
            const categoriasRef = collection(db, "categorias");
            const categoriasSnapshot = await getDocs(categoriasRef);
            if (!categoriasSnapshot.empty && empresaId) {
                const categoriasDocRef = categoriasSnapshot.docs[0].ref;
                const categoriasData = categoriasSnapshot.docs[0].data();
                // Remover da categoria anterior se mudou
                if (categoriaAnterior && categoriaAnterior !== categoria && Array.isArray(categoriasData[categoriaAnterior])) {
                    categoriasData[categoriaAnterior] = categoriasData[categoriaAnterior].filter((id: string) => id !== empresaId);
                }
                // Adicionar à nova categoria
                if (!Array.isArray(categoriasData[categoria])) {
                    categoriasData[categoria] = [];
                }
                if (!categoriasData[categoria].includes(empresaId)) {
                    categoriasData[categoria].push(empresaId);
                }
                await setDoc(categoriasDocRef, categoriasData, { merge: true });
            }

            setNomeGlobal(nome);
            setSenhaGlobal(senha);
            setUsuarioGlobal(emailId);
            setCidadeGlobal(true);
            setEnderecoGlobal(true);
            setNumeroGlobal(numero);
            setTelefoneGlobal(telefone);
            setEmailGlobal(email);

            Alert.alert("Sucesso", "Informações atualizadas com sucesso.");
            navigation.navigate("HomeApp");
        } catch (error) {
            console.error("Erro ao atualizar informações da empresa:", error);
            Alert.alert("Erro", "Erro ao atualizar. Tente novamente.");
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
        { label: 'Link Site', value: linkSite, set: setLinkSite },
        { label: 'Link Instagram', value: linkInstagram, set: setLinkInstagram },
        { label: 'Intervalo entre Serviços (minutos)', value: intervaloServicos, set: setIntervaloServicos },
        { label: 'Sobre nós', value: sobreNos, set: setSobreNos, multiline: true },
    ];

    return (
        <ScrollView style={stylesSingLog.container}>
            <TouchableOpacity onPress={() => navigation.navigate("UserScreen")} style={{marginTop: 20}}>
                <AntDesign 
                    name={"left"} 
                    size={30} 
                    color={"#00C20A"} 
                    style={{ marginLeft: 10 }}         
                />
            </TouchableOpacity>
            <View style={stylesSingLog.containerTitleOther}>
                <Text style={stylesSingLog.Title}>Mudança de Informações</Text>
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
                            multiline={input.multiline}
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
                        <Text style={{ color: categoria ? "#fff" : "#ccc" }}>
                            {categoria || "Selecione uma categoria"}
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
                                                setCategoria(item);
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

                <View>
                    <Text style={{fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 20, margin: 'auto'}}>
                        Horarios de Funcionamento
                    </Text>
                    <View style={{gap: 20}}>
                        {diasSemana.map((dia, idx) => (
                            <View key={dia} style={{gap: 10}}>
                                <View style={stylesSingLog.containerAbertoFechado}>
                                    <Text style={{fontSize: 17, fontWeight: 'bold', color: '#fff'}}>
                                        {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                    </Text>
                                    <View style={stylesSingLog.containerAbertoFechadoMenor}>
                                        <Text style={{ color: '#fff'}}>
                                            Aberto?
                                        </Text>
                                        <TouchableOpacity style={[
                                            stylesSingLog.TouchableOpacityAbertoFechado,
                                            abertos[dia]
                                            ? {backgroundColor: '#00C20A'}
                                            : {backgroundColor: 'transparent'}
                                        ]} onPress={() => handleAbertoFechado(dia)} />
                                    </View>
                                </View>
                                <View style={stylesSingLog.containerTwoInputs}>
                                    <View style={stylesSingLog.inputContainerTwoInputs}>
                                        <Text style={{ color: '#00C20A' }}>
                                            Inicio
                                        </Text>
                                        <TextInput
                                            style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                                            placeholder="HH:MM"
                                            placeholderTextColor="#ccc"
                                            value={horarios[dia].inicio}
                                            onChangeText={v => handleHorarioChange(dia, 'inicio', v)}
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                    </View>
                                    <View style={stylesSingLog.inputContainerTwoInputs}>
                                        <Text style={{ color: '#00C20A' }}>
                                            Fim
                                        </Text>
                                        <TextInput
                                            style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                                            placeholder="HH:MM"
                                            placeholderTextColor="#ccc"
                                            value={horarios[dia].fim}
                                            onChangeText={v => handleHorarioChange(dia, 'fim', v)}
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                    </View>
                                </View>
                                <View style={stylesSingLog.containerTwoInputs}>
                                    <View style={stylesSingLog.inputContainerTwoInputs}>
                                        <Text style={{ color: '#00C20A' }}>
                                            Início do Almoço
                                        </Text>
                                        <TextInput
                                            style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                                            placeholder="HH:MM"
                                            placeholderTextColor="#ccc"
                                            value={horarios[dia].almocoInicio}
                                            onChangeText={v => handleHorarioChange(dia, 'almocoInicio', v)}
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                    </View>
                                    <View style={stylesSingLog.inputContainerTwoInputs}>
                                        <Text style={{ color: '#00C20A' }}>
                                            Fim do Almoço
                                        </Text>
                                        <TextInput
                                            style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                                            placeholder="HH:MM"
                                            placeholderTextColor="#ccc"
                                            value={horarios[dia].almocoFim}
                                            onChangeText={v => handleHorarioChange(dia, 'almocoFim', v)}
                                            keyboardType="numeric"
                                            maxLength={5}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                    <Text style={stylesSingLog.botaoTexto}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ChangeEmpresaInfo;