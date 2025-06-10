import { ScrollView, TouchableOpacity, View, Text, TextInput, Alert, Image } from "react-native";
import stylesSingLog from "../../SingLog/SignLogStyle";
import { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import UserScreenStyle from "../UserScreen/UserScreenStyle";
import FuncionarioNavBar from "@/components/FuncionarioNavBar";
import { AntDesign } from "@expo/vector-icons";
import setaImg from "../../../../assets/images/seta.png";
import EmpresaInfoMoneyScreenStyle from "../../UserInfo/Empresa/EmpresaInfoMoneyScreenStyle";
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext";

type RootStackParamList = {
    FuncionarioScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const diasSemana = [
    "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"
];

const FuncionarioChangeInfo = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const {
        id: userId,
        nome: nomeGlobal,
        email: emailGlobal,
        senha: senhaGlobal,
        cidade: cidadeGlobal,
        endereco: enderecoGlobal,
        numero: numeroGlobal,
        complemento: complementoGlobal,
        numeroTelefone: telefoneGlobal,
        setNome: setNomeGlobal,
        setEmail: setEmailGlobal,
        setSenha: setSenhaGlobal,
        setCidade: setCidadeGlobal,
        setEndereco: setEnderecoGlobal,
        setNumero: setNumeroGlobal,
        setComplemento: setComplementoGlobal,
        setNumeroTelefone: setTelefoneGlobal,
    } = useUserGlobalContext();
    const { servicos } = useEmpresaGlobalContext();
    const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
    const [isEmpresa, setIsEmpresa] = useState(false);
    const [nome, setNome] = useState(nomeGlobal);
    const [senha, setSenha] = useState(senhaGlobal);
    const [email, setEmail] = useState(emailGlobal);
    const [cep, setCep] = useState('');
    const [cidade, setCidade] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState(numeroGlobal);
    const [complemento, setComplemento] = useState(complementoGlobal);
    const [telefone, setTelefone] = useState(telefoneGlobal);
    const [loading, setLoading] = useState(false);

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

    function formatarHorario(input: string) {
        let value = input.replace(/\D/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 3) {
            return value.slice(0, 2) + ":" + value.slice(2, 4);
        }
        return value;
    }

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

    useEffect(() => {
        const carregarDadosUsuario = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const endereco = userData.endereco || {};
                    
                    setNome(userData.nome || nomeGlobal);
                    setEmail(userData.email || emailGlobal);
                    setSenha(userData.senha || senhaGlobal);
                    setCep(endereco.cep || '');
                    setCidade(endereco.cidade || '');
                    setRua(endereco.rua || '');
                    setNumero(endereco.numero || numeroGlobal);
                    setComplemento(endereco.complemento || complementoGlobal);
                    setTelefone(userData.telefone || telefoneGlobal);
  
                    const empresaRef = collection(db, "empresas");
                    const q = query(empresaRef, where("userId", "==", userId));
                    const querySnapshot = await getDocs(q);
                    setIsEmpresa(!querySnapshot.empty);

                    if (userData.horarioFuncionamento) {
                        const horariosFirestore = userData.horarioFuncionamento;
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

                    if (userData.servicos) {
                        setServicosSelecionados(userData.servicos);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
            }
        };

        carregarDadosUsuario();
    }, [userId]);

    const handleServicoToggle = (servicoId: string) => {
        setServicosSelecionados(prev => {
            if (prev.includes(servicoId)) {
                return prev.filter(id => id !== servicoId);
            } else {
                return [...prev, servicoId];
            }
        });
    };

    const handleAtualizar = async () => {
        if (!nome || !email || !telefone || !cep || !cidade || !rua || !numero) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        setLoading(true);
        try {
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

            const userRef = doc(db, "users", userId);
            const updateData: any = {
                nome,
                email: email.trim().toLowerCase(),
                senha,
                telefone,
                endereco: {
                    cep,
                    cidade,
                    complemento: complemento || "",
                    numero,
                    rua,
                },
                horarioFuncionamento: horarioFuncionamentoFirestore,
                updatedAt: new Date()
            };

            if (!isEmpresa) {
                updateData.servicos = servicosSelecionados;
            }

            await updateDoc(userRef, updateData);

            setNomeGlobal(nome);
            setEmailGlobal(email);
            setSenhaGlobal(senha);
            setCidadeGlobal(true);
            setEnderecoGlobal(true);
            setNumeroGlobal(numero);
            setComplementoGlobal(complemento);
            setTelefoneGlobal(telefone);

            Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao atualizar informações:", error);
            Alert.alert("Erro", "Não foi possível atualizar as informações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[UserScreenStyle.containerTitle, {justifyContent: 'space-between', flexDirection: 'row'}]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Editar Perfil</Text>
                <TouchableOpacity style={{ width: 30, height: 30, marginRight: 10 }}/>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={[stylesSingLog.container, { height: 'auto', paddingBottom: 100, borderTopRightRadius: 20, borderTopLeftRadius: 20 }]}>
                    <View style={stylesSingLog.containerInput}>
                        {[
                            { label: 'Nome', value: nome, set: setNome },
                            { label: 'Email', value: email, set: setEmail },
                            { label: 'Senha', value: senha, set: setSenha, secure: true },
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

                        <View>
                            <Text style={{fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginTop: 20, margin: 'auto'}}>
                                Horários de Funcionamento
                            </Text>
                            <View style={{gap: 20}}>
                                {diasSemana.map((dia) => (
                                    <View key={dia} style={{gap: 10}}>
                                        <View style={stylesSingLog.containerAbertoFechado}>
                                            <Text style={{fontSize: 17, fontWeight: 'bold', color: '#fff'}}>
                                                {dia.charAt(0).toUpperCase() + dia.slice(1)}
                                            </Text>
                                            <View style={stylesSingLog.containerAbertoFechadoMenor}>
                                                <Text style={{ color: '#fff'}}>
                                                    Aberto?
                                                </Text>
                                                <TouchableOpacity 
                                                    style={[
                                                        stylesSingLog.TouchableOpacityAbertoFechado,
                                                        abertos[dia]
                                                        ? {backgroundColor: '#00C20A'}
                                                        : {backgroundColor: 'transparent'}
                                                    ]} 
                                                    onPress={() => handleAbertoFechado(dia)} 
                                                />
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

                        {!isEmpresa && (
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>
                                    Serviços Disponíveis
                                </Text>
                                <View style={{ gap: 10 }}>
                                    {servicos.map((servico: any) => (
                                        <TouchableOpacity
                                            key={servico.id}
                                            style={[
                                                stylesSingLog.inputContainerOneInput,
                                                {
                                                    backgroundColor: servicosSelecionados.includes(servico.id) ? '#00C20A20' : 'transparent',
                                                    borderColor: servicosSelecionados.includes(servico.id) ? '#00C20A' : '#ccc',
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }
                                            ]}
                                            onPress={() => handleServicoToggle(servico.id)}
                                        >
                                            <View>
                                                <Text style={{ color: '#fff', fontSize: 16 }}>
                                                    {servico.nome}
                                                </Text>
                                                <Text style={{ color: '#ccc', fontSize: 14 }}>
                                                    {servico.categoria}
                                                </Text>
                                            </View>
                                            {servicosSelecionados.includes(servico.id) && (
                                                <AntDesign name="checkcircle" size={24} color="#00C20A" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        <TouchableOpacity 
                            style={[stylesSingLog.botaoCadastro, loading && { opacity: 0.7 }]} 
                            onPress={handleAtualizar}
                            disabled={loading}
                        >
                            <Text style={stylesSingLog.botaoTexto}>
                                {loading ? "Atualizando..." : "Atualizar Informações"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <FuncionarioNavBar />
        </View>
    );
};

export default FuncionarioChangeInfo;