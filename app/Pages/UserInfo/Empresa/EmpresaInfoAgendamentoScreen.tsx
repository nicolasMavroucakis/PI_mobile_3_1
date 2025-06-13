import { ScrollView, TouchableOpacity, View, Image, Text, Modal, Alert, StyleSheet, FlatList } from "react-native";
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
    const [selectedService, setSelectedService] = useState("Todos");
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);
    const [servicos, setServicos] = useState<Servico[]>([]);
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

            console.log('Data selecionada:', {
                dataOriginal: selectedDate.toISOString(),
                dataFormatada: format(selectedDate, 'dd/MM/yyyy HH:mm:ss'),
                inicioDia: format(inicioDia, 'dd/MM/yyyy HH:mm:ss'),
                fimDia: format(fimDia, 'dd/MM/yyyy HH:mm:ss')
            });

            const agendamentosRef = collection(db, "agendamentos");
            const q = query(
                agendamentosRef,
                where("empresaId", "==", empresaId),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            const querySnapshot = await getDocs(q);
            let agendamentosDoDia = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log('Agendamento encontrado:', {
                    id: doc.id,
                    data: data.data?.toDate(),
                    dataFormatada: data.data ? format(data.data.toDate(), 'dd/MM/yyyy HH:mm:ss') : 'sem data',
                    horaInicio: data.horaInicio,
                    horaFim: data.horaFim,
                    servico: data.servico?.nome
                });
                return {
                    id: doc.id,
                    ...data
                };
            }) as Agendamento[];

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
        if (empresaId) {
            buscarAgendamentosDoDia(date);
        }
    }, [selectedService, date, empresaId]);

    useEffect(() => {
        const inicializar = async () => {
            const empresaDoc = await carregarEmpresa();
            if (empresaDoc) {
                await carregarFuncionarios(empresaDoc);
                await carregarServicos(empresaDoc);
            }
        };
        inicializar();
    }, [userId]);

    const carregarServicos = async (empresaDoc: any) => {
        if (!empresaDoc) return;
        try {
            const servicosData = empresaDoc.data().servicos || [];
            const servicosList: Servico[] = servicosData.map((servico: any) => ({
                id: servico.id,
                nome: servico.nome,
                preco: servico.preco,
                duracao: servico.duracao,
                categoria: servico.categoria
            }));
            setServicos(servicosList);
            if (servicosList.length > 0) {
                setSelectedService(servicosList[0].nome);
            }
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        }
    };

    const onChange = async (event: any, selectedDate: any) => {
        if (selectedDate) {
            console.log('Data selecionada no picker:', {
                dataOriginal: selectedDate.toISOString(),
                dataFormatada: format(selectedDate, 'dd/MM/yyyy HH:mm:ss')
            });
            setDate(selectedDate);
            await buscarAgendamentosDoDia(selectedDate);
        }
    };

    const getAgendamentosHora = (hora: number) => {
        if (!agendamentos || !agendamentos.length) {
            console.log(`Nenhum agendamento para hora ${hora}`);
            return [];
        }
        
        const agendamentosFiltrados = agendamentos.filter(agendamento => {
            if (!agendamento || !agendamento.data) {
                console.log(`Agendamento inválido para hora ${hora}`);
                return false;
            }

            const [horaInicioStr, minutoInicioStr] = agendamento.horaInicio.split(':');
            const [horaFimStr, minutoFimStr] = agendamento.horaFim.split(':');
            
            const horaInicio = parseInt(horaInicioStr);
            const minutoInicio = parseInt(minutoInicioStr || '0');
            const horaFim = parseInt(horaFimStr);
            const minutoFim = parseInt(minutoFimStr || '0');

            // Convertendo para minutos para comparação mais precisa
            const inicioEmMinutos = horaInicio * 60 + minutoInicio;
            const fimEmMinutos = horaFim * 60 + minutoFim;
            const horaAtualEmMinutos = hora * 60;

            const estaNaHora = horaAtualEmMinutos >= inicioEmMinutos && horaAtualEmMinutos < fimEmMinutos;
            
            if (estaNaHora) {
                console.log(`Agendamento encontrado para hora ${hora}:`, {
                    id: agendamento.id,
                    horaInicio: agendamento.horaInicio,
                    horaFim: agendamento.horaFim,
                    servico: agendamento.servico.nome
                });
            }

            return estaNaHora;
        });

        console.log(`Hora ${hora}: ${agendamentosFiltrados.length} agendamentos encontrados`);
        return agendamentosFiltrados;
    };

    const calcularAlturaAgendamento = (agendamento: Agendamento, horaAtual: number): { altura: number; offsetTop: number } => {
        if (!agendamento || !agendamento.horaInicio || !agendamento.horaFim) {
            return { altura: 40, offsetTop: 0 };
        }
        const [horaInicioStr, minutoInicioStr] = agendamento.horaInicio.split(':');
        const [horaFimStr, minutoFimStr] = agendamento.horaFim.split(':');
        const horaInicio = parseInt(horaInicioStr);
        const minutoInicio = parseInt(minutoInicioStr || '0');
        const horaFim = parseInt(horaFimStr);
        const minutoFim = parseInt(minutoFimStr || '0');
        // Altura proporcional à duração
        const inicioEmMinutos = horaInicio * 60 + minutoInicio;
        const fimEmMinutos = horaFim * 60 + minutoFim;
        const alturaEmMinutos = fimEmMinutos - inicioEmMinutos;
        const altura = Math.max(Math.round(alturaEmMinutos * (80 / 60)), 20);
        // Offset proporcional ao minuto de início dentro do bloco da hora
        const offsetTop = (minutoInicio) * (80 / 60);
        return { altura, offsetTop };
    };

    const renderAgendamento = (agendamento: Agendamento, horaAtual: number) => {
        console.log('Renderizando agendamento:', {
            id: agendamento.id,
            horaInicio: agendamento.horaInicio,
            horaFim: agendamento.horaFim,
            servico: agendamento.servico.nome
        });

        const funcionarioDoAgendamento = funcionarios.find(f => f.id === agendamento.funcionarioId);
        const { altura, offsetTop } = calcularAlturaAgendamento(agendamento, horaAtual);
        
        // Garantir que altura e offsetTop são valores válidos
        const alturaFinal = Math.max(altura, 80); // Altura mínima de 80
        const offsetTopFinal = Math.max(offsetTop, 0); // Offset mínimo de 0
        
        console.log('Dimensões do agendamento:', {
            alturaOriginal: altura,
            alturaFinal,
            offsetTopOriginal: offsetTop,
            offsetTopFinal
        });

        return (
            <TouchableOpacity 
                key={agendamento.id} 
                style={[
                    ReservaScreenStyle.boxAgendamento,
                    { 
                        height: alturaFinal,
                        marginTop: offsetTopFinal,
                        backgroundColor: '#4CAF50', // Verde
                        borderWidth: 1,
                        borderColor: '#388E3C', // Verde mais escuro para a borda
                        borderRadius: 8,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }
                ]}
                onPress={() => navigation.navigate('IniciarAgendamentoScreen', { agendamento })}
            >
                <View style={[ReservaScreenStyle.containerTextAgendamento, { padding: 5 }]}>
                    <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF', fontWeight: 'bold' }]}>
                        {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                    </Text>
                    <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF' }]}>
                        {funcionarioDoAgendamento?.nome || "Profissional"}
                    </Text>
                    <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF' }]}>
                        {agendamento.servico.nome}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHorario = (hora: number) => {
        // Filtra apenas agendamentos que começam dentro deste bloco de hora
        const agendamentosHora = agendamentos.filter(agendamento => {
            if (!agendamento || !agendamento.horaInicio) return false;
            const [horaInicioStr, minutoInicioStr] = agendamento.horaInicio.split(":");
            const horaInicio = parseInt(horaInicioStr);
            const minutoInicio = parseInt(minutoInicioStr || '0');
            const minutosTotais = horaInicio * 60 + minutoInicio;
            return minutosTotais >= hora * 60 && minutosTotais < (hora + 1) * 60;
        });
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

    // NOVO: Renderização absoluta dos agendamentos
    const MINUTOS_POR_DIA = 24 * 60;
    const PIXELS_POR_MINUTO = 80 / 60; // 80px por hora

    const renderLinhasHora = () => (
        Array.from({ length: 24 }, (_, i) => (
            <View key={i} style={{
                position: 'absolute',
                top: i * 80,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: '#e0e0e0',
                zIndex: 1
            }} />
        ))
    );

    const renderLabelsHora = () => (
        Array.from({ length: 24 }, (_, i) => (
            <Text key={i} style={{
                position: 'absolute',
                top: i * 80,
                left: 5,
                fontSize: 10,
                fontWeight: 'bold',
                color: '#000',
                zIndex: 2
            }}>{i.toString().padStart(2, '0')}</Text>
        ))
    );

    // Função utilitária para agrupar agendamentos por faixa de tempo sobreposta
    function agruparAgendamentosSobrepostos(agendamentos: Agendamento[]): Agendamento[][] {
        // Ordena por início
        const ordenados = [...agendamentos].sort((a, b) => {
            const [ha, ma] = a.horaInicio.split(':').map(Number);
            const [hb, mb] = b.horaInicio.split(':').map(Number);
            return (ha * 60 + ma) - (hb * 60 + mb);
        });
        const grupos = [];
        let grupoAtual: Agendamento[] = [];
        let fimAtual = null;
        for (const ag of ordenados) {
            const [hIni, mIni] = ag.horaInicio.split(':').map(Number);
            const [hFim, mFim] = ag.horaFim.split(':').map(Number);
            const ini = hIni * 60 + mIni;
            const fim = hFim * 60 + mFim;
            if (!fimAtual || ini >= fimAtual) {
                if (grupoAtual.length) grupos.push(grupoAtual);
                grupoAtual = [ag];
                fimAtual = fim;
            } else {
                grupoAtual.push(ag);
                fimAtual = Math.max(fimAtual, fim);
            }
        }
        if (grupoAtual.length) grupos.push(grupoAtual);
        return grupos;
    }

    const renderAgendamentosAbsolutos = () => {
        const grupos = agruparAgendamentosSobrepostos(agendamentos);
        return grupos.map((grupo, idx) => {
            // Calcula faixa vertical do grupo
            const [hIni, mIni] = grupo[0].horaInicio.split(':').map(Number);
            const ini = hIni * 60 + mIni;
            const fim = Math.max(...grupo.map(ag => {
                const [hFim, mFim] = ag.horaFim.split(':').map(Number);
                return hFim * 60 + mFim;
            }));
            const top = ini * PIXELS_POR_MINUTO;
            const height = Math.max((fim - ini) * PIXELS_POR_MINUTO, 20);
            return (
                <View
                    key={idx}
                    style={{
                        position: 'absolute',
                        left: 40,
                        right: 10,
                        top,
                        height,
                        zIndex: 3,
                        flexDirection: 'row',
                    }}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexDirection: 'row', alignItems: 'stretch', gap: 10 }}
                    >
                        {grupo.map(agendamento => {
                            const [hA, mA] = agendamento.horaInicio.split(':').map(Number);
                            const [hF, mF] = agendamento.horaFim.split(':').map(Number);
                            const iniA = hA * 60 + mA;
                            const fimA = hF * 60 + mF;
                            const alturaA = Math.max((fimA - iniA) * PIXELS_POR_MINUTO, 20);
                            const funcionarioDoAgendamento = funcionarios.find(f => f.id === agendamento.funcionarioId);
                            return (
                                <View
                                    key={agendamento.id}
                                    style={{
                                        width: 220,
                                        height: alturaA,
                                        backgroundColor: '#4CAF50',
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#388E3C',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5,
                                        marginRight: 10,
                                        marginBottom: 0,
                                        marginTop: (iniA - ini) * PIXELS_POR_MINUTO,
                                        zIndex: 4
                                    }}
                                >
                                    <View style={[ReservaScreenStyle.containerTextAgendamento, { padding: 5 }]}> 
                                        <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF', fontWeight: 'bold' }]}> 
                                            {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                                        </Text>
                                        <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF' }]}> 
                                            {funcionarioDoAgendamento?.nome || "Profissional"}
                                        </Text>
                                        <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF' }]}> 
                                            {agendamento.servico.nome}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            );
        });
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
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={[UserScreenStyle.containerRest, { minHeight: 750, flexGrow: 1 }]}> 
                    <View style={EmpresaInfoMoneyScreenStyle.containerServicoReservadosfiltros}>
                        <View style={[EmpresaInfoMoneyScreenStyle.containerFilterEsquerda, { alignItems: 'flex-start', justifyContent: 'center' }]}> 
                            <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>Linha Temporal</Text>
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
                            </View>
                        </View>
                        <View style={[EmpresaInfoMoneyScreenStyle.containerFilterDireita, { alignItems: 'flex-end', justifyContent: 'center' }]}> 
                            <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>Serviços</Text>
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
                    {/* NOVO: Container absoluto para linhas e agendamentos */}
                    <View style={{ height: MINUTOS_POR_DIA * PIXELS_POR_MINUTO, position: 'relative', backgroundColor: '#f5f5f0', marginTop: 20, borderRadius: 10, overflow: 'visible' }}>
                        {renderLinhasHora()}
                        {renderLabelsHora()}
                        {renderAgendamentosAbsolutos()}
                    </View>
                </View>
            </ScrollView>
            <EmpresaNavBar />
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione o serviço</Text>
                        <FlatList
                            data={[{ id: "todos", nome: "Todos" }, ...servicos]}
                            renderItem={renderServiceItem}
                            keyExtractor={(item) => item.id}
                            style={styles.serviceList}
                        />
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
});

export default EmpresaInfoAgendamentoScreen;


