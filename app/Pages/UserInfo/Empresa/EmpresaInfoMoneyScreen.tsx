import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Modal, StyleSheet, Alert, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import EmpresaNavBar from "@/components/EmpresaNavBar";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import setaImg from "../../../../assets/images/seta.png";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle";
import calendarioImg from "../../../../components/assets/Images/Calendario.png";
import ferramentaImg from "../../../../assets/images/ferramenta.png";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "expo-router";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useCallback } from "react";

type RootStackParamList = {
    UserScreen: undefined;
    ConfigEmpresaInfo: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Servico {
    id: string; 
    nome: string;
    preco: number;
    categoria: string;
    ValorFinalMuda?: boolean;
}

interface AgendamentoDoc {
    id: string; 
    data: any; 
    status?: string;
    servico: { 
        nome: string;
        preco: number;
        duracao: number;
        ValorFinalMuda?: boolean;
    };
}

const EmpresaInfoMoneyScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [dateServicosRealizados, setDateServicosRealizados] = useState(new Date());
    const [dateServicosReservados, setDateServicosReservados] = useState(new Date());
    const { db } = StartFirebase();
    const [selectedServico, setSelectedServico] = useState<string>(""); 
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [modalServicoVisible, setModalServicoVisible] = useState(false);
    const { id: userId } = useUserGlobalContext();

    const [agendamentos, setAgendamentos] = useState<AgendamentoDoc[]>([]);
    const [agendamentosFinalizadosHoje, setAgendamentosFinalizadosHoje] = useState(0);
    const [agendamentosAindaParaHoje, setAgendamentosAindaParaHoje] = useState(0);
    const [agendamentosEmAndamento, setAgendamentosEmAndamento] = useState<AgendamentoDoc[]>([]);
    const [loading, setLoading] = useState(true);

    const [quantidadeServicosReservados, setQuantidadeServicosReservados] = useState(0);
    const [valorTotalServicosReservados, setValorTotalServicosReservados] = useState(0);

    const [quantidadeServicosRealizados, setQuantidadeServicosRealizados] = useState(0);
    const [valorTotalServicosRealizados, setValorTotalServicosRealizados] = useState(0);

    const [modalValorFinalVisible, setModalValorFinalVisible] = useState(false);
    const [valorFinal, setValorFinal] = useState("");
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<string | null>(null);

    const onChangeServicosRealizados = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dateServicosRealizados;
        setDateServicosRealizados(currentDate);
    };

    const onChangeServicosReservados = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dateServicosReservados;
        setDateServicosReservados(currentDate);
    };

    const carregarAgendamentos = async () => {
        console.log("Iniciando carregamento de agendamentos...");
        try {
            const empresasRef = collection(db, "empresas");
            const qEmpresas = query(empresasRef, where("userId", "==", userId));
            const empresasSnapshot = await getDocs(qEmpresas);

            if (empresasSnapshot.empty) {
                console.log("Nenhuma empresa encontrada para o usuário.");
                setLoading(false);
                return;
            }

            const empresaDoc = empresasSnapshot.docs[0];
            const empresaId = empresaDoc.id;

            const agendamentosRef = collection(db, "agendamentos");
            const qAgendamentos = query(agendamentosRef, where("empresaId", "==", empresaId));
            const agendamentosSnapshot = await getDocs(qAgendamentos);

            const agendamentosList: AgendamentoDoc[] = agendamentosSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    data: data.data,
                    status: data.status || undefined,
                    servico: data.servico || { nome: "Desconhecido", preco: 0, duracao: 0 },
                    ...data,
                };
            });

            const todosAgendamentosEmAndamento = agendamentosList.filter(
                agendamento => agendamento.status === "em_andamento"
            );

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayISO = today.toISOString().split("T")[0];

            const agendamentosHoje = agendamentosList.filter(agendamento => {
                if (agendamento.data && typeof agendamento.data.toDate === 'function') {
                    const agendamentoDate = agendamento.data.toDate();
                    agendamentoDate.setHours(0, 0, 0, 0);
                    return agendamentoDate.toISOString().split("T")[0] === todayISO;
                }
                return false;
            });

            const finalizadosHoje = agendamentosHoje.filter(agendamento => agendamento.status === "finalizado");

            console.log("Todos os agendamentos em andamento:", todosAgendamentosEmAndamento.map(a => ({
                id: a.id,
                status: a.status,
                nome: a.servico?.nome,
                data: a.data?.toDate?.().toISOString()
            })));

            setAgendamentosEmAndamento(todosAgendamentosEmAndamento);
            setAgendamentos(agendamentosList);
            setAgendamentosFinalizadosHoje(finalizadosHoje.length);
            setAgendamentosAindaParaHoje(agendamentosHoje.length);

        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarAgendamentos();
        }, [userId, db])
    );

    useEffect(() => {
        const calcularServicosReservados = () => {
            const selectedDateISO = dateServicosReservados.toISOString().split("T")[0];
            const selectedServicoName = servicos.find(s => s.id === selectedServico)?.nome;

            const agendamentosFiltrados = agendamentos.filter(agendamento => {
                if (agendamento.data && typeof agendamento.data.toDate === 'function') {
                    const agendamentoDataISO = agendamento.data.toDate().toISOString().split("T")[0];

                    const isDateMatch = agendamentoDataISO === selectedDateISO;
                    const isServiceMatch = selectedServico === "" || (agendamento.servico && agendamento.servico.nome === selectedServicoName);
                    const isStatusAgendado = agendamento.status === "agendado"; 

                    return isDateMatch && isServiceMatch && isStatusAgendado;
                }
                return false;
            });

            const quantidade = agendamentosFiltrados.length;
            const valor = agendamentosFiltrados.reduce((total, agendamento) => {
                return total + (agendamento.servico?.preco || 0);
            }, 0);

            console.log(`[Reservados - AGENDADO] Data: ${selectedDateISO}, Serviço: ${selectedServicoName || 'Todos'}`);
            console.log("Quantidade de serviços reservados:", quantidade);
            console.log("Valor total dos serviços reservados:", valor);

            setQuantidadeServicosReservados(quantidade);
            setValorTotalServicosReservados(valor);
        };

        if (agendamentos.length > 0 && servicos.length > 0) {
            calcularServicosReservados();
        } else if (!loading) {
             setQuantidadeServicosReservados(0);
             setValorTotalServicosReservados(0);
        }
    }, [dateServicosReservados, selectedServico, agendamentos, servicos, loading]);

    useEffect(() => {
        const calcularServicosRealizados = () => {
            const selectedDateISO = dateServicosRealizados.toISOString().split("T")[0];
            const selectedServicoName = servicos.find(s => s.id === selectedServico)?.nome;

            const agendamentosFiltrados = agendamentos.filter(agendamento => {
                if (agendamento.data && typeof agendamento.data.toDate === 'function') {
                    const agendamentoDataISO = agendamento.data.toDate().toISOString().split("T")[0];

                    const isDateMatch = agendamentoDataISO === selectedDateISO;
                    const isServiceMatch = selectedServico === "" || (agendamento.servico && agendamento.servico.nome === selectedServicoName);
                    const isStatusFinalizado = agendamento.status === "finalizado"; 

                    return isDateMatch && isServiceMatch && isStatusFinalizado;
                }
                return false;
            });

            const quantidade = agendamentosFiltrados.length;
            const valor = agendamentosFiltrados.reduce((total, agendamento) => {
                return total + (agendamento.servico?.preco || 0);
            }, 0);

            console.log(`[Realizados - FINALIZADO] Data: ${selectedDateISO}, Serviço: ${selectedServicoName || 'Todos'}`);
            console.log("Quantidade de serviços realizados:", quantidade);
            console.log("Valor total dos serviços realizados:", valor);

            setQuantidadeServicosRealizados(quantidade);
            setValorTotalServicosRealizados(valor);
        };

        if (agendamentos.length > 0 && servicos.length > 0) {
            calcularServicosRealizados();
        } else if (!loading) {
            setQuantidadeServicosRealizados(0);
            setValorTotalServicosRealizados(0);
        }
    }, [dateServicosRealizados, selectedServico, agendamentos, servicos, loading]);

    useEffect(() => {
        const carregarServicos = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const qEmpresas = query(empresasRef, where("userId", "==", userId));
                const empresasSnapshot = await getDocs(qEmpresas);

                if (empresasSnapshot.empty) {
                    setServicos([]);
                    setSelectedServico("");
                    return;
                }

                const empresaDoc = empresasSnapshot.docs[0];
                const empresaData = empresaDoc.data();
                const servicosData = empresaData.servicos || [];

                const servicosList: Servico[] = servicosData.map((servico: any) => ({
                    id: servico.id,
                    nome: servico.nome,
                    preco: servico.preco,
                    categoria: servico.categoria
                }));

                setServicos(servicosList);
                if (servicosList.length > 0) {
                    setSelectedServico(servicosList[0].id);
                } else {
                    setSelectedServico("");
                }
            } catch (error) {
                console.error("Erro ao carregar serviços da empresa:", error);
            }
        };

        carregarServicos();
    }, [userId, db]);

    const handleFinalizarServico = async (agendamentoId: string) => {
        try {
            const agendamento = agendamentosEmAndamento.find(a => a.id === agendamentoId);
            if (!agendamento) return;

            if (agendamento.servico.ValorFinalMuda) {
                setAgendamentoSelecionado(agendamentoId);
                setValorFinal(agendamento.servico.preco.toString());
                setModalValorFinalVisible(true);
                return;
            }

            await finalizarAgendamento(agendamentoId);
        } catch (error) {
            console.error("Erro ao finalizar serviço:", error);
            Alert.alert("Erro", "Não foi possível finalizar o serviço.");
        }
    };

    const finalizarAgendamento = async (agendamentoId: string, valorFinalServico?: number) => {
        try {
            const agendamentoRef = doc(db, "agendamentos", agendamentoId);
            const updateData: any = {
                status: "esperando_confirmacao"
            };

            if (valorFinalServico !== undefined) {
                updateData["servico.preco"] = valorFinalServico;
            }

            await updateDoc(agendamentoRef, updateData);
            carregarAgendamentos();
            Alert.alert("Sucesso", "Aguardando confirmação do cliente!");
        } catch (error) {
            console.error("Erro ao finalizar serviço:", error);
            Alert.alert("Erro", "Não foi possível finalizar o serviço.");
        }
    };

    const handleConfirmarValorFinal = () => {
        if (!agendamentoSelecionado) return;

        const valor = parseFloat(valorFinal);
        if (isNaN(valor) || valor <= 0) {
            Alert.alert("Erro", "Por favor, insira um valor válido.");
            return;
        }

        finalizarAgendamento(agendamentoSelecionado, valor);
        setModalValorFinalVisible(false);
        setAgendamentoSelecionado(null);
        setValorFinal("");
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={EmpresaInfoMoneyScreenStyle.containerTitle}>
                <View>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                        <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={UserScreenStyle.textTitle}>Perfil</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate("ConfigEmpresaInfo")}>
                        <Image source={engrenagemImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={UserScreenStyle.containerRest}>
                    <View style={EmpresaInfoMoneyScreenStyle.continerAgendamentos}>
                        <View style={EmpresaInfoMoneyScreenStyle.continerAgendamentosMetade}>
                            <Text style={EmpresaInfoMoneyScreenStyle.textAgendamentos}>
                                Total de agendamentos para hoje
                            </Text>
                            <Text style={[EmpresaInfoMoneyScreenStyle.textAgendamentos, { color: '#0057C2' }]}>
                                {agendamentosAindaParaHoje}
                            </Text>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.continerAgendamentosMetade}>
                            <Text style={EmpresaInfoMoneyScreenStyle.textAgendamentos}>
                                Agendamentos realizados no dia de hoje
                            </Text>
                            <Text style={[EmpresaInfoMoneyScreenStyle.textAgendamentos, { color: '#00C20A' }]}>
                                {agendamentosFinalizadosHoje}
                            </Text>
                        </View>
                    </View>

                    <View style={EmpresaInfoMoneyScreenStyle.containerServicoReservado}>
                        <View>
                            <Text style={EmpresaInfoMoneyScreenStyle.titleSecundarios}>
                                Serviços Reservados
                            </Text>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.containerServicoReservadosfiltros}>
                            <View style={[EmpresaInfoMoneyScreenStyle.containerFilterEsquerda, { alignItems: 'flex-start', justifyContent: 'center' }]}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>
                                    Linha Temporal
                                </Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda}>
                                    <Image source={calendarioImg} style={EmpresaInfoMoneyScreenStyle.imgFiltros} />
                                    <DateTimePicker
                                        value={dateServicosReservados}
                                        mode="date"
                                        display="default"
                                        onChange={onChangeServicosReservados}
                                        textColor="red"
                                        style={{zIndex: 1000}}
                                    />
                                </View>
                            </View>
                            <View style={[EmpresaInfoMoneyScreenStyle.containerFilterDireita, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>
                                    Serviços
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalServicoVisible(true)}
                                    style={[EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda, { backgroundColor: "rgba(50, 50, 50, 0.8)", padding: 10, borderRadius: 8, justifyContent: 'flex-end', }]}
                                >
                                    <Text style={{ color: "white" }}>
                                        {servicos.find(s => s.id === selectedServico)?.nome || "Selec. um serviço"}
                                    </Text>
                                    <Image source={ferramentaImg} style={[EmpresaInfoMoneyScreenStyle.imgFiltros, { marginLeft: 10 }]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <View style={EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltros}>
                                <View style={EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenor}>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderTopLeftRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            Quantidade
                                        </Text>
                                    </View>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderTopRightRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            Valor
                                        </Text>
                                    </View>
                                </View>
                                <View style={EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenor}>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderBottomLeftRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            {quantidadeServicosReservados}
                                        </Text>
                                    </View>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderBottomRightRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            R$ {valorTotalServicosReservados.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={EmpresaInfoMoneyScreenStyle.containerServicoReservado}>
                        <View>
                            <Text style={EmpresaInfoMoneyScreenStyle.titleSecundarios}>
                                Serviços Realizados
                            </Text>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.containerServicoReservadosfiltros}>
                            <View style={[EmpresaInfoMoneyScreenStyle.containerFilterEsquerda, { alignItems: 'flex-start', justifyContent: 'center' }]}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>
                                    Linha Temporal
                                </Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda}>
                                    <Image source={calendarioImg} style={EmpresaInfoMoneyScreenStyle.imgFiltros} />
                                    <DateTimePicker
                                        value={dateServicosRealizados}
                                        mode="date"
                                        display="default"
                                        onChange={onChangeServicosRealizados}
                                        textColor="red"
                                        style={{zIndex: 1000}}
                                    />
                                </View>
                            </View>
                            <View style={[EmpresaInfoMoneyScreenStyle.containerFilterDireita, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textFiltros}>
                                    Serviços
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalServicoVisible(true)}
                                    style={[EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda, { backgroundColor: "rgba(50, 50, 50, 0.8)", padding: 10, borderRadius: 8, justifyContent: 'flex-end' }]}
                                >
                                    <Text style={{ color: "white" }}>
                                        {servicos.find(s => s.id === selectedServico)?.nome || "Selec. um serviço"}
                                    </Text>
                                    <Image source={ferramentaImg} style={[EmpresaInfoMoneyScreenStyle.imgFiltros, { marginLeft: 10 }]} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <View style={EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltros}>
                                <View style={EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenor}>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderTopLeftRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            Quantidade
                                        </Text>
                                    </View>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderTopRightRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            Valor
                                        </Text>
                                    </View>
                                </View>
                                <View style={EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenor}>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderBottomLeftRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            {quantidadeServicosRealizados}
                                        </Text>
                                    </View>
                                    <View style={[EmpresaInfoMoneyScreenStyle.tabelaValorResultadoFiltrosMenorMenor, { borderBottomRightRadius: 10}]}>
                                        <Text style={[EmpresaInfoMoneyScreenStyle.textFiltros, {fontWeight: 'bold'}]}>
                                            R$ {valorTotalServicosRealizados.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {agendamentosEmAndamento.length > 0 && (
                        <View style={[EmpresaInfoMoneyScreenStyle.containerServicoReservado, { marginBottom: 80 }]}>
                            <View>
                                <Text style={[EmpresaInfoMoneyScreenStyle.titleSecundarios, { color: '#00C20A' }]}>
                                    Em Andamento
                                </Text>
                            </View>
                            {agendamentosEmAndamento.map((agendamento) => (
                                <View 
                                    key={agendamento.id}
                                    style={{
                                        backgroundColor: 'rgba(50, 50, 50, 0.8)',
                                        padding: 15,
                                        borderRadius: 8,
                                        marginTop: 10
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                                            {agendamento.servico.nome}
                                        </Text>
                                        <Text style={{ color: '#00C20A', fontSize: 16 }}>
                                            R$ {agendamento.servico.preco.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: '#717171', fontSize: 14 }}>
                                            {agendamento.data?.toDate().toLocaleDateString('pt-BR')}
                                        </Text>
                                        <Text style={{ color: '#717171', fontSize: 14 }}>
                                            {agendamento.data?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleFinalizarServico(agendamento.id)}
                                        style={{
                                            backgroundColor: '#00C20A',
                                            padding: 10,
                                            borderRadius: 5,
                                            marginTop: 10,
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                            Finalizar Serviço
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
            <EmpresaNavBar />
            <Modal visible={modalServicoVisible} transparent animationType="slide">
                <View style={EmpresaInfoMoneyScreenStyle.modalContainer}>
                    <View style={EmpresaInfoMoneyScreenStyle.modalContent}>
                        <Text style={EmpresaInfoMoneyScreenStyle.modalTitle}>Selecione o serviço</Text>
                        <View style={{ backgroundColor: "#f0f0f0", borderRadius: 8, width: "100%" }}>
                            {servicos.length > 0 ? (
                                <Picker
                                    selectedValue={selectedServico}
                                    onValueChange={(itemValue) => setSelectedServico(itemValue)}
                                    itemStyle={{ color: "black", fontSize: 16 }}
                                    dropdownIconColor="black"
                                >
                                    {servicos.map((servico) => (
                                        <Picker.Item
                                            key={servico.id}
                                            label={`${servico.nome} - R$ ${servico.preco.toFixed(2)}`}
                                            value={servico.id}
                                        />
                                    ))}
                                </Picker>
                            ) : (
                                <Text style={{ padding: 10, textAlign: 'center' }}>
                                    Nenhum serviço encontrado
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => setModalServicoVisible(false)} style={EmpresaInfoMoneyScreenStyle.modalButton}>
                            <Text style={{ color: "white" }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={modalValorFinalVisible} transparent animationType="slide">
                <View style={EmpresaInfoMoneyScreenStyle.modalContainer}>
                    <View style={EmpresaInfoMoneyScreenStyle.modalContent}>
                        <Text style={EmpresaInfoMoneyScreenStyle.modalTitle}>Valor Final do Serviço</Text>
                        <TextInput
                            style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 8,
                                padding: 10,
                                width: "100%",
                                marginVertical: 10,
                                color: "black"
                            }}
                            value={valorFinal}
                            onChangeText={setValorFinal}
                            keyboardType="decimal-pad"
                            placeholder="Digite o valor final"
                            placeholderTextColor="#666"
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity 
                                onPress={() => {
                                    setModalValorFinalVisible(false);
                                    setAgendamentoSelecionado(null);
                                    setValorFinal("");
                                }} 
                                style={[EmpresaInfoMoneyScreenStyle.modalButton, { backgroundColor: '#ff4444', marginRight: 5 }]}
                            >
                                <Text style={{ color: "white" }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={handleConfirmarValorFinal} 
                                style={[EmpresaInfoMoneyScreenStyle.modalButton, { backgroundColor: '#00C20A', marginLeft: 5 }]}
                            >
                                <Text style={{ color: "white" }}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default EmpresaInfoMoneyScreen;