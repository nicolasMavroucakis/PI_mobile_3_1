import { ScrollView, TouchableOpacity, View, Image, Text, Modal, Alert } from "react-native";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import EmpresaNavBar from "@/components/EmpresaNavBar";
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle";
import setaImg from "../../../../assets/images/seta.png";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ferramentaImg from "../../../../assets/images/ferramenta.png";
import calendarioImg from "../../../../components/assets/Images/Calendario.png";
import { useState, useEffect } from "react";
import AgendamentoScreenStyle from "../../PrincipalApp/AgendamentosScreen/AgendamentoScreenStyle";
import CheckImg from "../../../../assets/images/check.png";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { format } from 'date-fns';
import ReservaScreenStyle from "../../ReservaScreen/ReservascreenStyle";

type RootStackParamList = {
    UserScreen: undefined;
    ConfigEmpresaInfo: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Funcionario {
    id: string;
    nome: string;
    fotoPerfil: string;
    especialidade?: string;
}

interface Servico {
    duracao: number;
    nome: string;
    preco: number;
}

type StatusAgendamento = 'agendado' | 'confirmado' | 'em_andamento' | 'finalizado' | 'cancelado';

interface Agendamento {
    id: string;
    clienteId: string;
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

const EmpresaInfoAgendamentoScreen = () => {
    const [selectedService, setSelectedService] = useState("Corte de cabelo");
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [empresaId, setEmpresaId] = useState<string | null>(null);

    const carregarEmpresa = async () => {
        if (!userId) return;
        try {
            const empresasRef = collection(db, "empresas");
            const empresaQuery = await getDocs(query(empresasRef, where("userId", "==", userId)));
            
            if (!empresaQuery.empty) {
                const empresaDoc = empresaQuery.docs[0];
                setEmpresaId(empresaDoc.id);
                return empresaDoc;
            }
            return null;
        } catch (error) {
            console.error("Erro ao carregar empresa:", error);
            return null;
        }
    };

    const carregarFuncionarios = async (empresaDoc: any) => {
        if (!empresaDoc) return;
        try {
            const funcionariosIds = empresaDoc.data().funcionarios || [];
            const funcionariosData: Funcionario[] = [];

            for (const id of funcionariosIds) {
                const funcDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", id)));
                if (!funcDoc.empty) {
                    const funcionarioData = funcDoc.docs[0].data();
                    funcionariosData.push({
                        id: funcDoc.docs[0].id,
                        nome: funcionarioData.nome || "Nome não disponível",
                        fotoPerfil: funcionarioData.fotoPerfil || "",
                        especialidade: funcionarioData.especialidade
                    });
                }
            }

            setFuncionarios(funcionariosData);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
        }
    };

    useEffect(() => {
        const inicializar = async () => {
            const empresaDoc = await carregarEmpresa();
            if (empresaDoc) {
                await carregarFuncionarios(empresaDoc);
                await buscarAgendamentosDoDia(date);
            }
        };
        inicializar();
    }, [userId]);

    const buscarAgendamentosDoDia = async (selectedDate: Date) => {
        if (!empresaId) return;
        
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
                where("empresaId", "==", empresaId),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            const querySnapshot = await getDocs(q);
            const agendamentosDoDia = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agendamento[];

            setAgendamentos(agendamentosDoDia);
            console.log(`Encontrados ${agendamentosDoDia.length} agendamentos para ${format(selectedDate, 'dd/MM/yyyy')}`);
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

    const onChange = async (event: any, selectedDate: any) => {
        if (selectedDate) {
            setDate(selectedDate);
            await buscarAgendamentosDoDia(selectedDate);
        }
    };

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
        const funcionarioDoAgendamento = funcionarios.find(f => f.id === agendamento.funcionarioId);
        const { altura, offsetTop } = calcularAlturaAgendamento(agendamento, horaAtual);
        
        return (
            <View 
                key={agendamento.id} 
                style={[
                    ReservaScreenStyle.boxAgendamento,
                    { 
                        height: altura,
                        marginTop: offsetTop,
                    }
                ]}
            >
                <View style={ReservaScreenStyle.containerTextAgendamento}>
                    <Text style={ReservaScreenStyle.textAgendamento}>
                        {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                    </Text>
                    <Text style={ReservaScreenStyle.textAgendamento}>
                        {funcionarioDoAgendamento?.nome || "Profissional"}
                    </Text>
                    <Text style={ReservaScreenStyle.textAgendamento}>
                        {agendamento.servico.nome}
                    </Text>
                    {carregandoAgendamentos && (
                        <Text style={{color: '#717171', fontSize: 12}}>Carregando...</Text>
                    )}
                </View>
            </View>
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

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Agendamentos</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ConfigEmpresaInfo")}>
                    <Image source={engrenagemImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
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
                                    onChange={onChange}
                                    textColor="red"
                                    style={{ zIndex: 1000 }}
                                />
                                <View style={{ backgroundColor: 'white', width: 120, height: 30, position: 'relative', top: 0, left: -120, borderRadius: 4 }} />
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
                                <Text style={{ color: "white" }}>{selectedService}</Text>
                                <Image source={ferramentaImg} style={[EmpresaInfoMoneyScreenStyle.imgFiltros, { marginLeft: 10 }]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={ReservaScreenStyle.ContainerCalendario}>
                        {Array.from({length: 24}, (_, i) => renderHorario(i))}
                    </ScrollView>
                </View>
            </ScrollView>
            <EmpresaNavBar />
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={EmpresaInfoMoneyScreenStyle.modalContainer}>
                    <View style={EmpresaInfoMoneyScreenStyle.modalContent}>
                        <Text style={EmpresaInfoMoneyScreenStyle.modalTitle}>Selecione o serviço</Text>
                        <View style={{ backgroundColor: "#f0f0f0", borderRadius: 8, width: "100%" }}>
                            <Picker
                                selectedValue={selectedService}
                                onValueChange={(itemValue) => setSelectedService(itemValue)}
                                itemStyle={{ color: "black", fontSize: 16 }}
                                dropdownIconColor="black"
                            >
                                {["Corte de cabelo", "Barba", "Manicure", "Massagem"].map((servico) => (
                                    <Picker.Item key={servico} label={servico} value={servico} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={EmpresaInfoMoneyScreenStyle.modalButton}>
                            <Text style={{ color: "white" }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default EmpresaInfoAgendamentoScreen;


