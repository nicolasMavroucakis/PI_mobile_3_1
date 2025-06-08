import { ScrollView, TouchableOpacity, View, Image, Text, Modal, Alert, StyleSheet, FlatList } from "react-native";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import EmpresaInfoMoneyScreenStyle from "../../UserInfo/Empresa/EmpresaInfoMoneyScreenStyle";
import setaImg from "../../../../assets/images/seta.png";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ferramentaImg from "../../../../assets/images/ferramenta.png";
import calendarioImg from "../../../../components/assets/Images/Calendario.png";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { format } from 'date-fns';
import ReservaScreenStyle from "../../ReservaScreen/ReservascreenStyle";
import FuncionarioNavBar from "@/components/FuncionarioNavBar";

type RootStackParamList = {
    UserScreen: undefined;
    ConfigEmpresaInfo: undefined;
    IniciarAgendamentoScreen: {
        agendamento: Agendamento;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Funcionario {
    id: string;
    nome: string;
    fotoPerfil: string;
    especialidade?: string;
}

interface ClienteData {
    nome?: string;
    [key: string]: any;
}

interface Servico {
    id: string;
    nome: string;
    preco: number;
    duracao: number;
    categoria: string;
}

type StatusAgendamento = 'agendado' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado';

interface Agendamento {
    id: string;
    clienteId: string;
    clienteNome?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    data: Timestamp;
    empresaId: string;
    funcionarioId: string;
    servico: Servico;
    status: StatusAgendamento;
    horaInicio: string;
    horaFim: string;
}

const FuncionarioAgendamentoScreen = () => {
    const [selectedService, setSelectedService] = useState("Todos");
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [carregandoServicos, setCarregandoServicos] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    const [funcionarioInfo, setFuncionarioInfo] = useState<Funcionario | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null);

    const carregarFuncionarioInfo = async () => {
        if (!userId) return null;
        try {
            console.log("Buscando informações do funcionário:", userId);
            const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", userId)));
            if (!userDoc.empty) {
                const funcionarioData = userDoc.docs[0].data();
                console.log("Dados do funcionário:", funcionarioData);

                const empresasRef = collection(db, "empresas");
                const empresasQuery = await getDocs(query(empresasRef, where("funcionarios", "array-contains", userId)));
                
                if (!empresasQuery.empty) {
                    const empresaDoc = empresasQuery.docs[0];
                    const empresaId = empresaDoc.id;
                    console.log("Empresa encontrada:", empresaId);
                    
                    setFuncionarioInfo({
                        id: userDoc.docs[0].id,
                        nome: funcionarioData.nome || "Nome não disponível",
                        fotoPerfil: funcionarioData.fotoPerfil || "",
                        especialidade: funcionarioData.especialidade
                    });
                    setEmpresaId(empresaId);
                    return { ...funcionarioData, empresaId };
                } else {
                    console.log("Nenhuma empresa encontrada para o funcionário");
                    Alert.alert(
                        "Aviso",
                        "Você não está vinculado a nenhuma empresa. Entre em contato com o administrador."
                    );
                }
            } else {
                console.log("Funcionário não encontrado");
            }
            return null;
        } catch (error) {
            console.error("Erro ao carregar informações do funcionário:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar suas informações. Tente novamente."
            );
            return null;
        }
    };

    const carregarServicos = async () => {
        if (!empresaId) {
            console.log("EmpresaId não definido");
            return;
        }

        setCarregandoServicos(true);
        try {
            console.log("Buscando serviços da empresa:", empresaId);
            const empresaRef = doc(db, "empresas", empresaId);
            const empresaDoc = await getDoc(empresaRef);
            
            if (!empresaDoc.exists()) {
                console.log("Empresa não encontrada");
                Alert.alert(
                    "Erro",
                    "Não foi possível encontrar a empresa. Tente novamente."
                );
                return;
            }

            const empresaData = empresaDoc.data();
            const servicosData = empresaData.servicos || [];
            console.log("Serviços encontrados na empresa:", servicosData.length);
            console.log("Dados dos serviços:", servicosData);

            const servicosList = servicosData
                .map((servico: any) => ({
                    id: servico.id || servico.nome,
                    nome: servico.nome,
                    preco: servico.preco || 0,
                    duracao: servico.duracao || 30,
                    categoria: servico.categoria || "Geral"
                }))
                .sort((a: Servico, b: Servico) => a.nome.localeCompare(b.nome));

            console.log("Serviços processados:", servicosList.length);
            console.log("Lista de serviços:", servicosList.map((s: Servico) => s.nome));
            
            setServicos(servicosList);
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar os serviços da empresa. Tente novamente."
            );
        } finally {
            setCarregandoServicos(false);
        }
    };

    const buscarAgendamentosDoDia = async (selectedDate: Date) => {
        if (!userId) return;
        
        setCarregandoAgendamentos(true);
        try {
            const inicioDia = new Date(selectedDate);
            inicioDia.setHours(0, 0, 0, 0);
            const timestampInicio = Timestamp.fromDate(inicioDia);

            const fimDia = new Date(selectedDate);
            fimDia.setHours(23, 59, 59, 999);
            const timestampFim = Timestamp.fromDate(fimDia);

            const agendamentosRef = collection(db, "agendamentos");
            const q = query(
                agendamentosRef,
                where("funcionarioId", "==", userId),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            const querySnapshot = await getDocs(q);
            let agendamentosDoDia = await Promise.all(
                querySnapshot.docs.map(async (agendamentoDoc) => {
                    const agendamentoData = agendamentoDoc.data();
                    // Buscar informações do cliente
                    try {
                        const clienteDocRef = doc(db, "users", agendamentoData.clienteId);
                        const clienteDoc = await getDoc(clienteDocRef);
                        if (clienteDoc.exists()) {
                            const clienteData = clienteDoc.data() as ClienteData;
                            // Pegar apenas o primeiro nome do cliente
                            const primeiroNome = clienteData.nome?.split(' ')[0] || "Cliente";
                            return {
                                id: agendamentoDoc.id,
                                ...agendamentoData,
                                clienteNome: primeiroNome
                            };
                        }
                    } catch (error) {
                        console.error("Erro ao buscar dados do cliente:", error);
                    }
                    return {
                        id: agendamentoDoc.id,
                        ...agendamentoData,
                        clienteNome: "Cliente"
                    };
                })
            ) as Agendamento[];

            if (selectedService && selectedService !== "Todos") {
                agendamentosDoDia = agendamentosDoDia.filter(
                    agendamento => agendamento.servico.nome === selectedService
                );
            }

            setAgendamentos(agendamentosDoDia);
            console.log(`Encontrados ${agendamentosDoDia.length} agendamentos para ${format(selectedDate, 'dd/MM/yyyy')}${selectedService !== "Todos" ? ` do serviço ${selectedService}` : ''}`);
        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar os agendamentos. Tente novamente."
            );
        } finally {
            setCarregandoAgendamentos(false);
        }
    };

    useEffect(() => {
        const inicializar = async () => {
            const funcionarioData = await carregarFuncionarioInfo();
            if (funcionarioData?.empresaId) {
                await carregarServicos();
            }
        };
        inicializar();
    }, [userId]);

    useEffect(() => {
        if (empresaId) {
            carregarServicos();
        }
    }, [empresaId]);

    useEffect(() => {
        if (userId) {
            buscarAgendamentosDoDia(date);
        }
    }, [selectedService, date, userId]);

    const getAgendamentosHora = (hora: number) => {
        if (!agendamentos || !agendamentos.length) return [];
        
        return agendamentos.filter(agendamento => {
            if (!agendamento || !agendamento.data) return false;

            const [horaInicioStr] = agendamento.horaInicio.split(':');
            const [horaFimStr] = agendamento.horaFim.split(':');
            
            const horaInicio = parseInt(horaInicioStr);
            const horaFim = parseInt(horaFimStr);
            
            return hora >= horaInicio && hora < horaFim;
        });
    };

    const calcularAlturaAgendamento = (agendamento: Agendamento, horaAtual: number): { altura: number; offsetTop: number } => {
        if (!agendamento || !agendamento.horaInicio || !agendamento.horaFim) {
            return { altura: 80, offsetTop: 0 };
        }

        const [horaInicioStr] = agendamento.horaInicio.split(':');
        const [horaFimStr] = agendamento.horaFim.split(':');
        
        const horaInicio = parseInt(horaInicioStr);
        const horaFim = parseInt(horaFimStr);
        
        const offsetTop = horaInicio < horaAtual ? (horaAtual - horaInicio) * -80 : 0;
        const altura = (horaFim - horaInicio) * 80;
        
        return { altura, offsetTop };
    };

    const renderAgendamento = (agendamento: Agendamento, horaAtual: number) => {
        const { altura, offsetTop } = calcularAlturaAgendamento(agendamento, horaAtual);
        
        return (
            <TouchableOpacity 
                key={agendamento.id} 
                style={[
                    ReservaScreenStyle.boxAgendamento,
                    { 
                        height: altura,
                        marginTop: offsetTop,
                    }
                ]}
                onPress={() => navigation.navigate('IniciarAgendamentoScreen', { agendamento })}
            >
                <View style={ReservaScreenStyle.containerTextAgendamento}>
                    <Text style={ReservaScreenStyle.textAgendamento}>
                        {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                    </Text>
                    <Text style={ReservaScreenStyle.textAgendamento}>
                        {agendamento.clienteNome || "Cliente"}
                    </Text>
                    <Text style={ReservaScreenStyle.textAgendamento}>
                        {agendamento.servico.nome}
                    </Text>
                    {carregandoAgendamentos && (
                        <Text style={{color: '#717171', fontSize: 12}}>Carregando...</Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderHorario = (hora: number) => {
        const agendamentosHora = getAgendamentosHora(hora);
        
        return (
            <View key={hora} style={{ height: 80 }}>
                <View style={ReservaScreenStyle.containerHoraLinha}>
                    <Text style={{
                        fontSize: 10, 
                        fontWeight: 'bold', 
                        marginLeft: 5,
                        color: '#000'
                    }}>
                        {hora.toString().padStart(2, '0')}
                    </Text>
                    <View style={ReservaScreenStyle.linhaEntreHorarios}/>
                </View>
                <ScrollView 
                    horizontal
                    style={ReservaScreenStyle.espacoParaAgendamentos}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        gap: 10,
                    }}
                >
                    {agendamentosHora.map(agendamento => 
                        agendamento ? renderAgendamento(agendamento, hora) : null
                    )}
                </ScrollView>
            </View>
        );
    };

    const renderServiceItem = ({ item }: { item: Servico | { id: string; nome: string } }) => (
        <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => {
                setSelectedService(item.nome);
                setModalVisible(false);
            }}
        >
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.serviceItemText}>
                {item.nome}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle, {alignItems: 'center', justifyContent: 'center'}]}>
                <Text style={UserScreenStyle.textTitle}>Meus Agendamentos</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[UserScreenStyle.containerRest, { minHeight: 750, flexGrow: 1 }]}>
                    <View style={EmpresaInfoMoneyScreenStyle.containerServicoReservadosfiltros}>
                        <View style={[EmpresaInfoMoneyScreenStyle.containerFilterEsquerda, { alignItems: 'flex-start', justifyContent: 'center' }]}>
                            <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>
                                Linha Temporal
                            </Text>
                            <View style={EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda}>
                                <Image source={calendarioImg} style={EmpresaInfoMoneyScreenStyle.imgFiltros} />
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setDate(selectedDate);
                                            buscarAgendamentosDoDia(selectedDate);
                                        }
                                    }}
                                    textColor="red"
                                    style={{ zIndex: 1000 }}
                                />
                                <View style={{ backgroundColor: 'transparent', width: 120, height: 30, position: 'relative', top: 0, left: -120, borderRadius: 4 }} />
                            </View>
                        </View>
                        <View style={[EmpresaInfoMoneyScreenStyle.containerFilterDireita, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                            <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>
                                Serviços
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={[EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda, { backgroundColor: "rgba(50, 50, 50, 0.8)", padding: 10, borderRadius: 8, justifyContent: 'flex-end', }]}
                            >
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: "white", maxWidth: 150 }}>
                                    {selectedService || "Selecione um serviço"}
                                </Text>
                                <Image source={ferramentaImg} style={[EmpresaInfoMoneyScreenStyle.imgFiltros, { marginLeft: 10 }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={ReservaScreenStyle.ContainerCalendario}>
                        {Array.from({length: 24}, (_, i) => renderHorario(i))}
                    </ScrollView>
                </View>
            </ScrollView>
            <FuncionarioNavBar />
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o serviço</Text>
                        {carregandoServicos ? (
                            <Text style={styles.loadingText}>Carregando serviços...</Text>
                        ) : (
                            <FlatList
                                data={[{ id: "todos", nome: "Todos" }, ...servicos]}
                                renderItem={renderServiceItem}
                                keyExtractor={(item) => item.id}
                                style={styles.serviceList}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>
                                        Nenhum serviço encontrado
                                    </Text>
                                }
                            />
                        )}
                        <TouchableOpacity 
                            onPress={() => setModalVisible(false)} 
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    serviceList: {
        maxHeight: 300,
    },
    serviceItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    serviceItemText: {
        fontSize: 16,
        color: 'black',
    },
    modalButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
        fontSize: 16
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
        fontSize: 16
    }
});

export default FuncionarioAgendamentoScreen;


