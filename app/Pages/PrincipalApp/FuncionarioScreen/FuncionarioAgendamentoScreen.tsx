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
        console.log(`=== VERIFICANDO AGENDAMENTOS PARA HORA ${hora} ===`);
        console.log('Estado atual:', {
            totalAgendamentos: agendamentos?.length || 0,
            hora: hora
        });

        if (!agendamentos || !agendamentos.length) {
            console.log(`Nenhum agendamento disponível para hora ${hora}`);
            return [];
        }
        
        const agendamentosFiltrados = agendamentos.filter(agendamento => {
            if (!agendamento || !agendamento.data) {
                console.log(`Agendamento inválido para hora ${hora}:`, agendamento);
                return false;
            }

            const [horaInicioStr, minutoInicioStr] = agendamento.horaInicio.split(':');
            const [horaFimStr, minutoFimStr] = agendamento.horaFim.split(':');
            
            const horaInicio = parseInt(horaInicioStr);
            const minutoInicio = parseInt(minutoInicioStr || '0');
            const horaFim = parseInt(horaFimStr);
            const minutoFim = parseInt(minutoFimStr || '0');

            // Converter tudo para minutos para comparação precisa
            const inicioEmMinutos = horaInicio * 60 + minutoInicio;
            const fimEmMinutos = horaFim * 60 + minutoFim;
            const horaAtualEmMinutos = hora * 60;
            
            console.log(`Verificando agendamento ${agendamento.id}:`, {
                horaInicio: `${horaInicio}:${minutoInicio}`,
                horaFim: `${horaFim}:${minutoFim}`,
                horaAtual: hora,
                inicioEmMinutos,
                fimEmMinutos,
                horaAtualEmMinutos,
                dentroDoIntervalo: horaAtualEmMinutos >= inicioEmMinutos && horaAtualEmMinutos < fimEmMinutos
            });
            
            const dentroDoIntervalo = horaAtualEmMinutos >= inicioEmMinutos && horaAtualEmMinutos < fimEmMinutos;
            return dentroDoIntervalo;
        });

        console.log(`Resultado para hora ${hora}:`, {
            totalFiltrados: agendamentosFiltrados.length,
            agendamentos: agendamentosFiltrados.map(ag => ({
                id: ag.id,
                horaInicio: ag.horaInicio,
                horaFim: ag.horaFim,
                clienteNome: ag.clienteNome
            }))
        });

        return agendamentosFiltrados;
    };

    const calcularAlturaAgendamento = (agendamento: Agendamento, horaAtual: number): { altura: number; offsetTop: number } => {
        if (!agendamento || !agendamento.horaInicio || !agendamento.horaFim) {
            return { altura: 80, offsetTop: 0 };
        }

        const [horaInicioStr, minutoInicioStr] = agendamento.horaInicio.split(':');
        const [horaFimStr, minutoFimStr] = agendamento.horaFim.split(':');
        
        const horaInicio = parseInt(horaInicioStr);
        const minutoInicio = parseInt(minutoInicioStr || '0');
        const horaFim = parseInt(horaFimStr);
        const minutoFim = parseInt(minutoFimStr || '0');

        // Converter tudo para minutos para cálculo preciso
        const inicioEmMinutos = horaInicio * 60 + minutoInicio;
        const fimEmMinutos = horaFim * 60 + minutoFim;
        const horaAtualEmMinutos = horaAtual * 60;
        
        // Calcular altura baseada em minutos (80px por hora = 1.33px por minuto)
        const alturaEmMinutos = fimEmMinutos - inicioEmMinutos;
        const altura = Math.round(alturaEmMinutos * (80 / 60)); // 80px por hora, convertendo para minutos
        
        // Calcular offset baseado na diferença entre hora atual e início
        const offsetTop = horaAtualEmMinutos > inicioEmMinutos ? 
            Math.round((horaAtualEmMinutos - inicioEmMinutos) * (80 / 60)) : 0;
        
        return { 
            altura: Math.max(altura, 80), // Altura mínima de 80px
            offsetTop: Math.max(offsetTop, 0) // Offset mínimo de 0
        };
    };

    const renderAgendamento = (agendamento: Agendamento, horaAtual: number) => {
        console.log('Renderizando agendamento:', {
            id: agendamento.id,
            horaInicio: agendamento.horaInicio,
            horaFim: agendamento.horaFim,
            clienteNome: agendamento.clienteNome,
            servico: agendamento.servico.nome
        });

        const { altura, offsetTop } = calcularAlturaAgendamento(agendamento, horaAtual);
        
        return (
            <TouchableOpacity 
                key={agendamento.id} 
                style={[
                    ReservaScreenStyle.boxAgendamento,
                    { 
                        height: altura,
                        marginTop: offsetTop,
                        backgroundColor: '#4CAF50',
                        borderWidth: 1,
                        borderColor: '#388E3C',
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
                <View style={{ padding: 5, alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}> 
                        {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                    </Text>
                    <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 10, marginTop: 2 }}> 
                        {agendamento.servico.nome}
                    </Text>
                    <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 10, marginTop: 2 }}> 
                        {agendamento.clienteNome || "Cliente"}
                    </Text>
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

    useEffect(() => {
        console.log('Estado dos agendamentos atualizado:', {
            totalAgendamentos: agendamentos?.length || 0,
            agendamentos: agendamentos?.map(ag => ({
                id: ag.id,
                data: ag.data?.toDate(),
                horaInicio: ag.horaInicio,
                horaFim: ag.horaFim,
                clienteNome: ag.clienteNome,
                servico: ag.servico.nome
            }))
        });
    }, [agendamentos]);

    // Função utilitária para agrupar agendamentos por faixa de tempo sobreposta
    function agruparAgendamentosSobrepostos(agendamentos: Agendamento[]): Agendamento[][] {
        const ordenados = [...agendamentos].sort((a, b) => {
            const [ha, ma] = a.horaInicio.split(':').map(Number);
            const [hb, mb] = b.horaInicio.split(':').map(Number);
            return (ha * 60 + ma) - (hb * 60 + mb);
        });
        const grupos: Agendamento[][] = [];
        let grupoAtual: Agendamento[] = [];
        let fimAtual: number | null = null;
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

    // NOVO: Renderização agrupada com scroll horizontal
    const PIXELS_POR_MINUTO = 80 / 60;
    const renderAgendamentosAgrupados = () => {
        const grupos = agruparAgendamentosSobrepostos(agendamentos);
        return grupos.map((grupo, idx) => {
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
                            return (
                                <TouchableOpacity
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
                                        zIndex: 4,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => navigation.navigate('IniciarAgendamentoScreen', { agendamento })}
                                >
                                    <View style={{ padding: 5, alignItems: 'center' }}>
                                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}> 
                                            {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                                        </Text>
                                        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 10, marginTop: 2 }}> 
                                            {agendamento.servico.nome}
                                        </Text>
                                        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 10, marginTop: 2 }}> 
                                            {agendamento.clienteNome || "Cliente"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            );
        });
    };

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
                    {/* NOVO: Container absoluto para linhas e agendamentos agrupados */}
                    <View style={{ height: 24 * 80, position: 'relative', backgroundColor: '#f5f5f0', marginTop: 20, borderRadius: 10, overflow: 'visible' }}>
                        {/* Renderizar linhas de hora e labels */}
                        {Array.from({length: 24}, (_, i) => (
                            <View key={i} style={{
                                position: 'absolute',
                                top: i * 80,
                                left: 0,
                                right: 0,
                                height: 1,
                                backgroundColor: '#e0e0e0',
                                zIndex: 1
                            }} />
                        ))}
                        {Array.from({length: 24}, (_, i) => (
                            <Text key={i} style={{
                                position: 'absolute',
                                top: i * 80,
                                left: 5,
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: '#000',
                                zIndex: 2
                            }}>{i.toString().padStart(2, '0')}</Text>
                        ))}
                        {/* Renderizar agendamentos agrupados com scroll horizontal */}
                        {renderAgendamentosAgrupados()}
                    </View>
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


