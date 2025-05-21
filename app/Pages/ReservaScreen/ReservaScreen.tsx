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
import { useRouter } from "expo-router";
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

const ReservaScreen = () => {
    const router = useRouter();
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
        servicosSelecionados
    } = useAgendamentoServicos();
    const [horaAgendamento, setHoraAgendamento] = useState(new Date());

    const carregarFuncionarios = async () => {
        console.log("IDs dos funcionários recebidos:", empresa.funcionarios);
        if (!empresa.funcionarios?.length) return;
        try {
            // Buscar os detalhes de cada funcionário
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
            setFuncionarios(funcionariosDetalhados.filter((f): f is NonNullable<typeof f> => f !== null) as Funcionario[]);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar a lista de funcionários."
            );
        }
    };

    useEffect(() => {
        carregarFuncionarios();
    }, [empresa.funcionarios]);

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
        setCarregandoAgendamentos(true);
        try {
            const inicioDia = new Date(data);
            inicioDia.setHours(0, 0, 0, 0);
            const timestampInicio = Timestamp.fromDate(inicioDia);

            const fimDia = new Date(data);
            fimDia.setHours(23, 59, 59, 999);
            const timestampFim = Timestamp.fromDate(fimDia);

            const agendamentosRef = collection(db, "agendamentos");
            let q = query(
                agendamentosRef,
                where("empresaId", "==", empresa.id),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            // Se tem funcionário selecionado e não é "sem preferencia", adicionar filtro
            if (funcionarioSelecionado && funcionarioSelecionado.id !== "sem preferencia") {
                q = query(
                    agendamentosRef,
                    where("empresaId", "==", empresa.id),
                    where("data", ">=", timestampInicio),
                    where("data", "<=", timestampFim),
                    where("funcionarioId", "==", funcionarioSelecionado.id)
                );
            }

            const querySnapshot = await getDocs(q);
            const agendamentosDoDia = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agendamento[];

            setAgendamentos(agendamentosDoDia);
            console.log(`Encontrados ${agendamentosDoDia.length} agendamentos para ${format(data, 'dd/MM/yyyy')}`);
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
        if (empresa?.id) {
            buscarAgendamentosDoDia(dataAgendamento || new Date());
        }
    }, [empresa?.id]);

    // Adicionar efeito para atualizar quando o funcionário mudar
    useEffect(() => {
        if (empresa?.id && dataAgendamento) {
            buscarAgendamentosDoDia(dataAgendamento);
        }
    }, [funcionarioSelecionado]);

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
        if (!agendamentos || !agendamentos.length) return [];
        
        return agendamentos.filter(agendamento => {
            if (!agendamento || !agendamento.data) return false;

            const [horaInicioStr] = agendamento.horaInicio.split(':');
            const [horaFimStr] = agendamento.horaFim.split(':');
            
            const horaInicio = parseInt(horaInicioStr);
            const horaFim = parseInt(horaFimStr);
            
            // Mostrar agendamento se a hora atual está dentro do período
            const dentroDoIntervalo = hora >= horaInicio && hora < horaFim;
            
            // Se tem funcionário selecionado (diferente de "sem preferencia"), filtrar por ele
            if (funcionarioSelecionado && funcionarioSelecionado.id !== "sem preferencia") {
                return dentroDoIntervalo && agendamento.funcionarioId === funcionarioSelecionado.id;
            }
            
            // Se não tem funcionário selecionado ou é "sem preferencia", mostrar todos
            return dentroDoIntervalo;
        });
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

        const [horaInicioStr] = agendamento.horaInicio.split(':');
        const [horaFimStr] = agendamento.horaFim.split(':');
        
        const horaInicio = parseInt(horaInicioStr);
        const horaFim = parseInt(horaFimStr);
        
        // Se começou antes da hora atual, ajustar a posição
        const offsetTop = horaInicio < horaAtual ? (horaAtual - horaInicio) * -80 : 0;
        
        // Altura total do agendamento
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
                    {!funcionarioSelecionado && funcionarioDoAgendamento && (
                        <Text style={{fontSize: 12, color: '#fff'}}>
                            {funcionarioDoAgendamento.nome}
                        </Text>
                    )}
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

    const criarNovoAgendamento = (dados: {
        clienteId: string,
        data: Date,
        empresaId: string,
        funcionarioId: string,
        servico: Servico,
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
        // Lista de funcionários disponíveis
        const funcionariosDisponiveis = funcionarios.filter(funcionario => {
            // Verifica se o funcionário já tem agendamento neste horário
            const temAgendamento = agendamentosNoDia.some(agendamento => {
                if (agendamento.funcionarioId !== funcionario.id) return false;

                const inicioAntes = horaInicio < agendamento.horaFim;
                const fimDepois = horaFim > agendamento.horaInicio;

                return inicioAntes && fimDepois;
            });

            return !temAgendamento;
        });

        if (funcionariosDisponiveis.length === 0) return null;

        // Seleciona um funcionário aleatório entre os disponíveis
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

            // Calcula hora fim baseado no tempo total do serviço
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

            // Busca todos os agendamentos do dia para a empresa
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

            // Se um funcionário específico foi selecionado
            if (funcionarioSelecionado && funcionarioSelecionado.id !== "sem preferencia") {
                // Verifica sobreposição para o funcionário específico
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
                // Verifica número de agendamentos paralelos
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
        router.back();
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
            
            // Calcula hora fim
            const minutosTotal = horaAgendamento.getHours() * 60 + horaAgendamento.getMinutes() + duracaoTotal;
            const horaFimSelecionada = Math.floor(minutosTotal / 60).toString().padStart(2, '0') + ":" +
                                     (minutosTotal % 60).toString().padStart(2, '0');

            // Se não tem funcionário específico, encontra um disponível
            let funcionarioId = funcionarioSelecionado?.id;
            if (funcionarioId === "sem preferencia" || !funcionarioId) {
                // Busca agendamentos do dia para verificar disponibilidade
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

                const funcionarioAleatorio = encontrarFuncionarioDisponivel(
                    agendamentosNoDia,
                    horaInicioSelecionada,
                    horaFimSelecionada
                );

                if (!funcionarioAleatorio) {
                    Alert.alert("Erro", "Não foi possível encontrar um profissional disponível");
                    return;
                }

                funcionarioId = funcionarioAleatorio;
            }

            const servicosNomes = servicosSelecionados.map(s => s.nome).join(" + ");

            const novoAgendamento = criarNovoAgendamento({
                clienteId: userId,
                data: dataAgendamento,
                empresaId: empresa.id,
                funcionarioId: funcionarioId,
                servico: {
                    nome: servicosNomes,
                    duracao: duracaoTotal,
                    preco: valorTotal
                },
                horaInicio: horaInicioSelecionada
            });

            const agendamentosRef = collection(db, "agendamentos");
            const docRef = await addDoc(agendamentosRef, novoAgendamento);

            // Encontra o nome do funcionário para mostrar na mensagem
            const funcionarioEscolhido = funcionarios.find(f => f.id === funcionarioId);
            
            Alert.alert(
                "Sucesso",
                `Agendamento realizado com sucesso!\n${funcionarioEscolhido ? `Profissional: ${funcionarioEscolhido.nome}` : ''}`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.back();
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
                                <View style={{ backgroundColor: 'white', width: 110, height: 30, position: 'relative', top: 0, borderRadius:4, left: -113}} />
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
                                <View style={{ backgroundColor: 'white', width: 70, height: 30, position: 'relative', top: 0, borderRadius:4, left: -20}} />
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
                        </View>
                    </ScrollView>
                    <ScrollView style={ReservaScreenStyle.ContainerCalendario}>
                        {Array.from({length: 24}, (_, i) => renderHorario(i))}
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