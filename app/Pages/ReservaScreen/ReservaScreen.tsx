import React from 'react';
import { AntDesign } from "@expo/vector-icons";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import ReservaScreenStyle from "./ReservascreenStyle";
import CalendarioImg from '../../../assets/images/Calendario.png'
import RelogioImg from '../../../assets/images/relogio.png'
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAgendamentoServicos } from "@/app/GlobalContext/AgendamentoServicosGlobalContext";
import { collection, query, where, getDocs, Timestamp, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { db } = StartFirebase();
type RootStackParamList = { 
    HomeApp: undefined;
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
    valorFinalMuda?: boolean;
    funcionariosIds: string[];
    categoria?: string;
    descricao?: string;
    imagensUrl?: string[];
    tipoServico?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
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

interface EmpresaContextData {
    id: string;
    nome: string;
    email: string;
    endereco: any;
    funcionarios: string[];
    servicos: Servico[];
    telefone: string;
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
    userId: string;
    fotoPerfil: string;
}

const ReservaScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { empresaId } = (route.params || {}) as { empresaId?: string };
    const { setAll } = useEmpresaContext();
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [carregandoAgendamentos, setCarregandoAgendamentos] = useState(false);
    const empresa = useEmpresaContext();
    const { id: userId } = useUserGlobalContext();
    const { 
        dataAgendamento,
        definirData,
        funcionarioSelecionado,
        selecionarFuncionario,
        calcularValorTotal,
        calcularTempoTotal,
        servicosSelecionados,
        adicionarServico
    } = useAgendamentoServicos();
    const [horaAgendamento, setHoraAgendamento] = useState(new Date());

    const carregarFuncionarios = async () => {
        console.log("IDs dos funcionários recebidos:", empresa.funcionarios);
        if (!empresa.funcionarios?.length) return;
        try {
            const funcionariosPromises = empresa.funcionarios.map(async (funcionarioId) => {
                try {
                    console.log("Buscando funcionário com ID:", funcionarioId);
                    const funcionarioDoc = await getDoc(doc(db, "users", funcionarioId));
                    if (funcionarioDoc.exists()) {
                        const funcionarioData = funcionarioDoc.data();
                        console.log("Dados do funcionário encontrado:", funcionarioData);
                        return {
                            id: funcionarioId,
                            nome: funcionarioData.nome || "Nome não disponível",
                            fotoPerfil: funcionarioData.fotoPerfil || "",
                            especialidade: funcionarioData.especialidade
                        };
                    }
                    console.log("Funcionário não encontrado para o ID:", funcionarioId);
                    return null;
                } catch (error) {
                    console.error(`Erro ao buscar funcionário ${funcionarioId}:`, error);
                    return null;
                }
            });

            const funcionariosDetalhados = await Promise.all(funcionariosPromises);
            const funcionariosFiltrados = funcionariosDetalhados.filter((f): f is NonNullable<typeof f> => f !== null);

            if (servicosSelecionados.length > 0) {
                const servicoEmpresa = (empresa.servicos.find(s => s.nome === servicosSelecionados[0].nome) as any);
                if (servicoEmpresa?.funcionariosIds?.length) {
                    const funcionariosAutorizados = funcionariosFiltrados.filter(f => 
                        servicoEmpresa.funcionariosIds.includes(f.id)
                    );
                    setFuncionarios(funcionariosAutorizados);
                    
                    if (funcionarioSelecionado && !servicoEmpresa.funcionariosIds.includes(funcionarioSelecionado.id)) {
                        selecionarFuncionario(null);
                    }
                } else {
                    setFuncionarios(funcionariosFiltrados);
                }
            } else {
                setFuncionarios(funcionariosFiltrados);
            }
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar a lista de funcionários."
            );
        }
    };

    useEffect(() => {
        if (servicosSelecionados.length > 0) {
            carregarFuncionarios();
        }
    }, [servicosSelecionados]);

    useEffect(() => {
        if (empresaId && (!empresa.id || empresa.id !== empresaId)) {
            const buscarEmpresa = async () => {
                const empresaDoc = await getDoc(doc(db, 'empresas', empresaId));
                if (empresaDoc.exists()) {
                    const empresaData = empresaDoc.data();
                    setAll({
                        id: empresaDoc.id,
                        nome: empresaData.nome || '',
                        email: empresaData.email || '',
                        endereco: empresaData.endereco || {},
                        funcionarios: empresaData.funcionarios || [],
                        servicos: (empresaData.servicos || []) as Servico[],
                        telefone: empresaData.telefone || '',
                        createdAt: empresaData.createdAt || null,
                        updatedAt: empresaData.updatedAt || null,
                        userId: empresaData.userId || '',
                        fotoPerfil: empresaData.fotoPerfil || ''
                    });
                }
            };
            buscarEmpresa();
        }
    }, [empresaId]);

    const verificarDisponibilidade = async (data: Date, funcionarioId: string | null) => {
        try {
            const inicioDia = new Date(data);
            inicioDia.setHours(0, 0, 0, 0);
            const timestampInicio = Timestamp.fromDate(inicioDia);

            const fimDia = new Date(data);
            fimDia.setHours(23, 59, 59, 999);
            const timestampFim = Timestamp.fromDate(fimDia);

            let q = query(
                collection(db, "agendamentos"),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            if (funcionarioId) {
                q = query(
                    collection(db, "agendamentos"),
                    where("data", ">=", timestampInicio),
                    where("data", "<=", timestampFim),
                    where("funcionarioId", "==", funcionarioId)
                );
            }

            const querySnapshot = await getDocs(q);
            const agendamentosNoDia = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return agendamentosNoDia;
        } catch (error) {
            console.error("Erro ao verificar disponibilidade:", error);
            Alert.alert(
                "Erro",
                "Não foi possível verificar a disponibilidade. Tente novamente."
            );
            return [];
        }
    };

    const buscarAgendamentosDoDia = async (data: Date) => {
        console.log('=== INÍCIO DA BUSCA DE AGENDAMENTOS ===');
        console.log('Parâmetros da busca:', {
            data: format(data, 'dd/MM/yyyy HH:mm:ss'),
            empresaId: empresa?.id,
            funcionarioSelecionado: funcionarioSelecionado?.id
        });

        if (!empresa?.id) {
            console.error('Empresa ID não definido');
            return;
        }

        setCarregandoAgendamentos(true);
        try {
            const inicioDia = new Date(data);
            inicioDia.setHours(0, 0, 0, 0);
            const timestampInicio = Timestamp.fromDate(inicioDia);

            const fimDia = new Date(data);
            fimDia.setHours(23, 59, 59, 999);
            const timestampFim = Timestamp.fromDate(fimDia);

            console.log('Período de busca:', {
                inicio: format(inicioDia, 'dd/MM/yyyy HH:mm:ss'),
                fim: format(fimDia, 'dd/MM/yyyy HH:mm:ss')
            });

            const agendamentosRef = collection(db, "agendamentos");
            let q = query(
                agendamentosRef,
                where("empresaId", "==", empresa.id),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            if (funcionarioSelecionado && funcionarioSelecionado.id !== "sem preferencia") {
                console.log('Adicionando filtro de funcionário:', funcionarioSelecionado.id);
                q = query(
                    agendamentosRef,
                    where("empresaId", "==", empresa.id),
                    where("data", ">=", timestampInicio),
                    where("data", "<=", timestampFim),
                    where("funcionarioId", "==", funcionarioSelecionado.id)
                );
            }

            console.log('Executando query no Firebase...');
            const querySnapshot = await getDocs(q);
            console.log('Query executada:', {
                totalDocumentos: querySnapshot.size,
                documentosVazios: querySnapshot.empty
            });

            const agendamentosDoDia = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log('Documento encontrado:', {
                    id: doc.id,
                    data: data.data?.toDate(),
                    horaInicio: data.horaInicio,
                    horaFim: data.horaFim,
                    funcionarioId: data.funcionarioId,
                    servico: data.servico?.nome
                });
                return {
                    id: doc.id,
                    ...data
                };
            }) as Agendamento[];

            console.log('Resumo da busca:', {
                totalAgendamentos: agendamentosDoDia.length,
                agendamentos: agendamentosDoDia.map(ag => ({
                    id: ag.id,
                    data: ag.data?.toDate(),
                    horaInicio: ag.horaInicio,
                    horaFim: ag.horaFim,
                    funcionarioId: ag.funcionarioId,
                    servico: ag.servico?.nome
                }))
            });

            setAgendamentos(agendamentosDoDia);
        } catch (error) {
            console.error("Erro detalhado ao buscar agendamentos:", {
                erro: error,
                mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
                stack: error instanceof Error ? error.stack : undefined
            });
            Alert.alert(
                "Erro",
                "Não foi possível carregar os agendamentos. Tente novamente."
            );
        } finally {
            setCarregandoAgendamentos(false);
            console.log('=== FIM DA BUSCA DE AGENDAMENTOS ===');
        }
    };

    useEffect(() => {
        if (empresa?.id) {
            buscarAgendamentosDoDia(dataAgendamento || new Date());
        }
    }, [empresa?.id]);

    useEffect(() => {
        if (empresa?.id && dataAgendamento) {
            buscarAgendamentosDoDia(dataAgendamento);
        }
    }, [funcionarioSelecionado]);

    useEffect(() => {
        if (servicosSelecionados.length === 1) {
            return;
        }
        if (servicosSelecionados.length === 0) return;
        if (servicosSelecionados.length > 1) {
            adicionarServico(servicosSelecionados[0]);
        }
    }, []);

    const onChange = async (event: any, selectedDate: any) => {
        if (selectedDate) {
            definirData(selectedDate);
            await buscarAgendamentosDoDia(selectedDate);
            await verificarDisponibilidade(
                selectedDate,
                funcionarioSelecionado?.id || null
            );
        }
    };

    const onChangeHora = (event: any, selectedTime: any) => {
        if (selectedTime) {
            const minutes = selectedTime.getMinutes();
            const roundedMinutes = Math.round(minutes / 10) * 10;
            selectedTime.setMinutes(roundedMinutes);
            setHoraAgendamento(selectedTime);
        }
    };

    const handleSelecionarFuncionario = async (funcionario: any) => {
        if (servicosSelecionados.length > 0) {
            const servicoEmpresa = (empresa.servicos.find(s => s.nome === servicosSelecionados[0].nome) as any);
            if (funcionario && servicoEmpresa?.funcionariosIds?.length && !servicoEmpresa.funcionariosIds.includes(funcionario.id)) {
                Alert.alert(
                    "Funcionário não autorizado",
                    "Este funcionário não está autorizado a realizar este serviço."
                );
                return;
            }
        }
        
        selecionarFuncionario(funcionario);
        if (dataAgendamento) {
            await verificarDisponibilidadeHorarioSelecionado();
        }
    };

    const valorTotal = calcularValorTotal();
    const tempoTotal = calcularTempoTotal();
    const tempoFormatado = tempoTotal.horas > 0 
        ? `${tempoTotal.horas}h${tempoTotal.minutos > 0 ? ` ${tempoTotal.minutos}min` : ''}`
        : `${tempoTotal.minutos}min`;

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
            
            if (funcionarioSelecionado && funcionarioSelecionado.id !== "sem preferencia") {
                const correspondeAoFuncionario = dentroDoIntervalo && agendamento.funcionarioId === funcionarioSelecionado.id;
                console.log(`Verificação de funcionário para ${agendamento.id}:`, {
                    correspondeAoFuncionario,
                    funcionarioAgendamento: agendamento.funcionarioId,
                    funcionarioSelecionado: funcionarioSelecionado.id
                });
                return correspondeAoFuncionario;
            }
            
            return dentroDoIntervalo;
        });

        console.log(`Resultado para hora ${hora}:`, {
            totalFiltrados: agendamentosFiltrados.length,
            agendamentos: agendamentosFiltrados.map(ag => ({
                id: ag.id,
                horaInicio: ag.horaInicio,
                horaFim: ag.horaFim,
                funcionarioId: ag.funcionarioId
            }))
        });

        return agendamentosFiltrados;
    };

    const verificarDisponibilidadeHorario = (hora: number) => {
        const agendamentosHora = getAgendamentosHora(hora);
        
        if (funcionarioSelecionado) {
            return agendamentosHora.length === 0;
        } else {
            const funcionariosOcupados = new Set(agendamentosHora.map(a => a.funcionarioId));
            return funcionariosOcupados.size < funcionarios.length;
        }
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
            servico: agendamento.servico?.nome,
            funcionarioId: agendamento.funcionarioId
        });

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
            >
                <View style={[ReservaScreenStyle.containerTextAgendamento, { padding: 5 }]}>
                    <Text style={[ReservaScreenStyle.textAgendamento, { color: '#FFFFFF', fontWeight: 'bold' }]}>
                        {`${agendamento.horaInicio} - ${agendamento.horaFim}`}
                    </Text>
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

    const criarNovoAgendamento = (dados: {
        clienteId: string,
        data: Date,
        empresaId: string,
        funcionarioId: string,
        servico: Servico & { valorFinalMuda?: boolean },
        horaInicio: string
    }) => {
        const agora = Timestamp.now();
        
        const [horasInicio, minutosInicio] = dados.horaInicio.split(':').map(Number);
        const minutosTotal = horasInicio * 60 + minutosInicio + dados.servico.duracao;
        const horasFim = Math.floor(minutosTotal / 60);
        const minutosFim = minutosTotal % 60;
        const horaFim = `${String(horasFim).padStart(2, '0')}:${String(minutosFim).padStart(2, '0')}`;

        const novoAgendamento: Omit<Agendamento, 'id'> = {
            clienteId: dados.clienteId,
            createdAt: agora,
            updatedAt: agora,
            data: Timestamp.fromDate(dados.data),
            empresaId: dados.empresaId,
            funcionarioId: dados.funcionarioId,
            servico: dados.servico,
            status: 'agendado',
            horaInicio: dados.horaInicio,
            horaFim: horaFim
        };

        return novoAgendamento;
    };

    const encontrarFuncionarioDisponivel = (
        agendamentosNoDia: Agendamento[], 
        horaInicio: string, 
        horaFim: string
    ): string | null => {
        const funcionariosDisponiveis = funcionarios.filter(funcionario => {
            const temAgendamento = agendamentosNoDia.some(agendamento => {
                if (agendamento.funcionarioId !== funcionario.id) return false;

                const inicioAntes = horaInicio < agendamento.horaFim;
                const fimDepois = horaFim > agendamento.horaInicio;

                return inicioAntes && fimDepois;
            });

            return !temAgendamento;
        });

        if (funcionariosDisponiveis.length === 0) return null;

        const indiceAleatorio = Math.floor(Math.random() * funcionariosDisponiveis.length);
        return funcionariosDisponiveis[indiceAleatorio].id;
    };

    const verificarDisponibilidadeHorarioSelecionado = async () => {
        if (!dataAgendamento) {
            Alert.alert("Atenção", "Por favor, selecione uma data para o agendamento.");
            return false;
        }

        try {
            const horaInicioSelecionada = horaAgendamento.getHours().toString().padStart(2, '0') + ":" + 
                                        horaAgendamento.getMinutes().toString().padStart(2, '0');

            const tempoTotal = calcularTempoTotal();
            const duracaoTotal = tempoTotal.horas * 60 + tempoTotal.minutos;
            const minutosTotal = horaAgendamento.getHours() * 60 + horaAgendamento.getMinutes() + duracaoTotal;
            const horaFimSelecionada = Math.floor(minutosTotal / 60).toString().padStart(2, '0') + ":" +
                                     (minutosTotal % 60).toString().padStart(2, '0');

            const inicioDia = new Date(dataAgendamento);
            inicioDia.setHours(0, 0, 0, 0);
            const timestampInicio = Timestamp.fromDate(inicioDia);

            const fimDia = new Date(dataAgendamento);
            fimDia.setHours(23, 59, 59, 999);
            const timestampFim = Timestamp.fromDate(fimDia);

            const agendamentosRef = collection(db, "agendamentos");
            const q = query(
                agendamentosRef,
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim),
                where("empresaId", "==", empresa.id)
            );

            const querySnapshot = await getDocs(q);
            const agendamentosNoDia = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agendamento[];

            if (funcionarioSelecionado && funcionarioSelecionado.id !== "sem preferencia") {
                const temSobreposicao = agendamentosNoDia.some(agendamento => {
                    if (agendamento.funcionarioId !== funcionarioSelecionado.id) return false;

                    const horaInicioAgendamento = agendamento.horaInicio;
                    const horaFimAgendamento = agendamento.horaFim;

                    const inicioAntes = horaInicioSelecionada < horaFimAgendamento;
                    const fimDepois = horaFimSelecionada > horaInicioAgendamento;

                    return inicioAntes && fimDepois;
                });

                if (temSobreposicao) {
                    Alert.alert(
                        "Horário Indisponível",
                        "O profissional já possui um agendamento neste horário."
                    );
                    return false;
                }
            } else {
                const agendamentosParalelos = agendamentosNoDia.filter(agendamento => {
                    const horaInicioAgendamento = agendamento.horaInicio;
                    const horaFimAgendamento = agendamento.horaFim;

                    const inicioAntes = horaInicioSelecionada < horaFimAgendamento;
                    const fimDepois = horaFimSelecionada > horaInicioAgendamento;

                    return inicioAntes && fimDepois;
                });

                if (agendamentosParalelos.length >= funcionarios.length) {
                    Alert.alert(
                        "Horário Indisponível",
                        "Todos os profissionais já estão ocupados neste horário."
                    );
                    return false;
                }
            }

            setAgendamentos(agendamentosNoDia);
            console.log(`Encontrados ${agendamentosNoDia.length} agendamentos para ${format(dataAgendamento, 'dd/MM/yyyy')}`);

            return true;
        } catch (error) {
            console.error("Erro ao verificar disponibilidade:", error);
            Alert.alert(
                "Erro",
                "Não foi possível verificar a disponibilidade. Tente novamente."
            );
            return false;
        }
    };

    const handleVoltar = () => {
        navigation.goBack();
    };

    const handleContinuar = async () => {
        if (!userId) {
            Alert.alert("Erro", "Usuário não está logado");
            return;
        }

        if (!dataAgendamento) {
            Alert.alert("Atenção", "Selecione uma data para o agendamento");
            return;
        }

        if (!empresa?.id) {
            Alert.alert("Erro", "Dados da empresa não encontrados");
            return;
        }

        if (!funcionarioSelecionado && funcionarios.length === 0) {
            Alert.alert("Erro", "Não há funcionários disponíveis");
            return;
        }

        if (servicosSelecionados.length === 0) {
            Alert.alert("Atenção", "Selecione pelo menos um serviço");
            return;
        }

        const servicoEmpresa = (empresa.servicos.find(s => s.nome === servicosSelecionados[0].nome) as any);
        if (servicoEmpresa?.funcionariosIds?.length && funcionarioSelecionado && 
            !servicoEmpresa.funcionariosIds.includes(funcionarioSelecionado.id)) {
            Alert.alert(
                "Funcionário não autorizado",
                "O funcionário selecionado não está autorizado a realizar este serviço."
            );
            return;
        }

        const disponivel = await verificarDisponibilidadeHorarioSelecionado();
        if (!disponivel) return;

        try {
            const horaInicioSelecionada = horaAgendamento.getHours().toString().padStart(2, '0') + ":" + 
                                        horaAgendamento.getMinutes().toString().padStart(2, '0');

            const valorTotal = calcularValorTotal();
            if (valorTotal === 0) {
                Alert.alert("Atenção", "Erro ao calcular o valor total");
                return;
            }

            const tempoTotal = calcularTempoTotal();
            const duracaoTotal = tempoTotal.horas * 60 + tempoTotal.minutos;
            
            const minutosTotal = horaAgendamento.getHours() * 60 + horaAgendamento.getMinutes() + duracaoTotal;
            const horaFimSelecionada = Math.floor(minutosTotal / 60).toString().padStart(2, '0') + ":" +
                                     (minutosTotal % 60).toString().padStart(2, '0');

            let funcionarioId = funcionarioSelecionado?.id;
            if (funcionarioId === "sem preferencia" || !funcionarioId) {
                const inicioDia = new Date(dataAgendamento);
                inicioDia.setHours(0, 0, 0, 0);
                const timestampInicio = Timestamp.fromDate(inicioDia);

                const fimDia = new Date(dataAgendamento);
                fimDia.setHours(23, 59, 59, 999);
                const timestampFim = Timestamp.fromDate(fimDia);

                const q = query(
                    collection(db, "agendamentos"),
                    where("data", ">=", timestampInicio),
                    where("data", "<=", timestampFim),
                    where("empresaId", "==", empresa.id)
                );

                const querySnapshot = await getDocs(q);
                const agendamentosNoDia = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Agendamento[];

                if (servicoEmpresa?.funcionariosIds?.length) {
                    const funcionariosAutorizados = funcionarios.filter(f => 
                        servicoEmpresa.funcionariosIds.includes(f.id)
                    );
                    
                    if (funcionariosAutorizados.length === 0) {
                        Alert.alert(
                            "Erro",
                            "Não há funcionários autorizados disponíveis para este serviço."
                        );
                        return;
                    }

                    const funcionarioAleatorio = encontrarFuncionarioDisponivel(
                        agendamentosNoDia,
                        horaInicioSelecionada,
                        horaFimSelecionada
                    );

                    if (!funcionarioAleatorio || !servicoEmpresa.funcionariosIds.includes(funcionarioAleatorio)) {
                        Alert.alert(
                            "Erro",
                            "Não foi possível encontrar um profissional autorizado disponível."
                        );
                        return;
                    }

                    funcionarioId = funcionarioAleatorio;
                }
            }

            const servicosNomes = servicosSelecionados.map(s => s.nome).join(" + ");

            let valorFinalMuda = false;
            if (empresa?.servicos && servicosSelecionados.length === 1) {
                const servicoEmpresa = empresa.servicos.find((s: any) => s.nome === servicosSelecionados[0].nome) as Servico;
                valorFinalMuda = !!servicoEmpresa?.valorFinalMuda;
            }

            const servicoAgendamento: Servico = {
                nome: servicosNomes,
                duracao: duracaoTotal,
                preco: valorTotal,
                valorFinalMuda: valorFinalMuda,
                funcionariosIds: servicoEmpresa?.funcionariosIds || []
            };

            const novoAgendamento = criarNovoAgendamento({
                clienteId: userId,
                data: dataAgendamento,
                empresaId: empresa.id,
                funcionarioId: funcionarioId as string,
                servico: servicoAgendamento,
                horaInicio: horaInicioSelecionada
            });

            const agendamentosRef = collection(db, "agendamentos");
            const docRef = await addDoc(agendamentosRef, novoAgendamento);

            const funcionarioEscolhido = funcionarios.find(f => f.id === funcionarioId);
            
            Alert.alert(
                "Sucesso",
                `Agendamento realizado com sucesso!\n${funcionarioEscolhido ? `Profissional: ${funcionarioEscolhido.nome}` : ''}`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]
            );

        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            Alert.alert(
                "Erro",
                "Não foi possível criar o agendamento. Tente novamente."
            );
        }
    };

    // Adicionar useEffect para monitorar mudanças nos agendamentos
    useEffect(() => {
        console.log('Estado dos agendamentos atualizado:', {
            totalAgendamentos: agendamentos?.length || 0,
            agendamentos: agendamentos?.map(ag => ({
                id: ag.id,
                data: ag.data?.toDate(),
                horaInicio: ag.horaInicio,
                horaFim: ag.horaFim,
                funcionarioId: ag.funcionarioId,
                servico: ag.servico?.nome
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
        <View style={{flex:1, backgroundColor: '#717171'}}>
            <View style={{flex: 1}}>
                <ScrollView>
                    <View style={ReservaScreenStyle.containerTituloPagina}>
                        <View>
                            <TouchableOpacity onPress={handleVoltar}>
                                <AntDesign 
                                    name={"left"} 
                                    size={30} 
                                    color={"#00C20A"} 
                                    style={{ marginLeft: 10 }}         
                                />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#00C20A'}}>
                                {empresa.nome} - Reserva
                            </Text>
                        </View>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        <View>
                            <Text style={[ReservaScreenStyle.textDataeHora, ReservaScreenStyle.textDataeHoraEsquerda]}>
                                Data
                            </Text>
                            <View style={ReservaScreenStyle.containerSelecionaDataEHoraEsquerda}>
                                <View>
                                    <Image source={CalendarioImg} style={{width: 40, height: 40}}/>
                                </View>
                                <DateTimePicker
                                    value={dataAgendamento || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onChange}
                                    textColor="red"
                                    style={{zIndex: 1000}}
                                    minimumDate={new Date()}
                                />
                            
                            </View>
                        </View>
                        <View>
                            <Text style={[ReservaScreenStyle.textDataeHora, ReservaScreenStyle.textDataeHoraDireita]}>
                                Horario
                            </Text>
                            <View style={ReservaScreenStyle.containerSelecionaDataEHoraDireita}>
                                <DateTimePicker
                                    value={horaAgendamento}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChangeHora}
                                    minuteInterval={10}
                                    style={{zIndex: 1000, position: 'relative', right: -50}}
                                />
                                <View style={{  width: 70, height: 30, position: 'relative', top: 0, borderRadius:4, left: -20}} />
                                <View>
                                    <Image source={RelogioImg} style={{width: 40, height: 40}}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginLeft: 20}}>Profissional</Text>
                    </View>
                    <ScrollView 
                        style={ReservaScreenStyle.ScrollViewFuncionarios} 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={ReservaScreenStyle.containerFuncionarios}>
                            {funcionarios.length === 0 ? (
                                <View style={[ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto, { opacity: 0.7 }]}>
                                    <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                        Nenhum profissional disponível para este serviço
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    <TouchableOpacity 
                                        style={[
                                            ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto,
                                            !funcionarioSelecionado && ReservaScreenStyle.funcionarioSelecionado
                                        ]}
                                        onPress={() => handleSelecionarFuncionario(null)}
                                    >
                                        <Image source={require('../../../assets/images/user.jpeg')} style={{width: 50, height: 50, borderRadius: 50}}/>
                                        <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                            Sem Preferencia
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={ReservaScreenStyle.linha}/>
                                    {funcionarios.map((funcionario) => (
                                        <TouchableOpacity 
                                            key={funcionario.id}
                                            style={[
                                                ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto,
                                                funcionarioSelecionado?.id === funcionario.id && ReservaScreenStyle.funcionarioSelecionado
                                            ]}
                                            onPress={() => handleSelecionarFuncionario(funcionario)}
                                        >
                                            <Image 
                                                source={
                                                    funcionario.fotoPerfil 
                                                        ? { uri: funcionario.fotoPerfil } 
                                                        : require('../../../assets/images/user.jpeg')
                                                } 
                                                style={{width: 50, height: 50, borderRadius: 50}}
                                            />
                                            <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                                {funcionario.nome}
                                            </Text>
                                            {funcionario.especialidade && (
                                                <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center'}}>
                                                    {funcionario.especialidade}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    </ScrollView>
                    <ScrollView style={ReservaScreenStyle.ContainerCalendario} contentContainerStyle={{ position: 'relative', minHeight: 24 * 80 }}>
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
                    </ScrollView>
                </ScrollView>
                <View style={ReservaScreenStyle.containerReservaValoresTempo}>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
                            R$ {valorTotal.toFixed(2)}
                        </Text>
                        <Text style={{fontSize: 15, color: 'rgba(255, 255, 255, 0.6)'}}>
                            {tempoFormatado}
                        </Text>
                    </View>
                    <View>
                        <TouchableOpacity 
                            style={ReservaScreenStyle.TocuhbleContinuar}
                            onPress={handleContinuar}
                        >
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                                Continuar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ReservaScreen;