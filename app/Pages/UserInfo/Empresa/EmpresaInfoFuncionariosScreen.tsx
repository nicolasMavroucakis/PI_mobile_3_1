import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, Image, ScrollView, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle";
import setaImg from "../../../../assets/images/seta.png";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import funcionariosImg from "../../../../assets/images/funcionarios.png"
import EmpresaNavBar from "@/components/EmpresaNavBar";
import calendarioImg from "../../../../components/assets/Images/Calendario.png";
import ferramentaImg from "../../../../assets/images/ferramenta.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    SignFuncionario: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Funcionario {
    id: string;
    nome: string;
    email: string;
}

interface Servico {
    id: string;
    nome: string;
    preco: number;
    categoria: string;
}

const EmpresaInfoFuncionariosScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    
    // Estados para funcionário
    const [selectedFuncionario, setSelectedFuncionario] = useState<string>("");
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [modalFuncionarioVisible, setModalFuncionarioVisible] = useState(false);
    
    // Estados para serviço
    const [selectedServico, setSelectedServico] = useState<string>("");
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [modalServicoVisible, setModalServicoVisible] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [dateServicosReservados, setDateServicosReservados] = useState(new Date());
    const [dateServicosRealizados, setDateServicosRealizados] = useState(new Date());

    const [agendamentos, setAgendamentos] = useState<{ id: string; data: any; status: string | undefined }[]>([]);
    const [agendamentosFinalizadosHoje, setAgendamentosFinalizadosHoje] = useState(0);
    const [agendamentosAindaParaHoje, setAgendamentosAindaParaHoje] = useState(0);

    const [quantidadeServicosReservados, setQuantidadeServicosReservados] = useState(0);
    const [valorTotalServicosReservados, setValorTotalServicosReservados] = useState(0);

    const [quantidadeServicosRealizados, setQuantidadeServicosRealizados] = useState(0);
    const [valorTotalServicosRealizados, setValorTotalServicosRealizados] = useState(0);

    const onChangeServicosReservados = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dateServicosReservados;
        setDateServicosReservados(currentDate);
    };

    const onChangeServicosRealizados = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || dateServicosRealizados;
        setDateServicosRealizados(currentDate);
    };

    // Carregar funcionários
    useEffect(() => {
        const carregarFuncionarios = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const qEmpresas = query(empresasRef, where("userId", "==", userId));
                const empresasSnapshot = await getDocs(qEmpresas);

                if (empresasSnapshot.empty) {
                    console.log("Nenhuma empresa encontrada para o usuário.");
                    return;
                }

                const empresaDoc = empresasSnapshot.docs[0];
                const empresaData = empresaDoc.data();
                const funcionariosIds = empresaData.funcionarios || [];

                const funcionariosData: Funcionario[] = [];

                for (const funcionarioId of funcionariosIds) {
                    const funcionarioDoc = await getDocs(collection(db, "users"));
                    funcionarioDoc.forEach((doc) => {
                        if (doc.id === funcionarioId) {
                            const funcionarioData = doc.data();
                            funcionariosData.push({
                                id: doc.id,
                                nome: funcionarioData.nome || "",
                                email: funcionarioData.email || ""
                            });
                        }
                    });
                }

                setFuncionarios(funcionariosData);
                if (funcionariosData.length > 0) {
                    setSelectedFuncionario(funcionariosData[0].id);
                }
            } catch (error) {
                console.error("Erro ao carregar funcionários:", error);
            }
        };

        carregarFuncionarios();
    }, [userId]);

    // Carregar serviços
    useEffect(() => {
        const carregarServicos = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const qEmpresas = query(empresasRef, where("userId", "==", userId));
                const empresasSnapshot = await getDocs(qEmpresas);

                if (empresasSnapshot.empty) return;

                const empresaDoc = empresasSnapshot.docs[0];
                const empresaData = empresaDoc.data();
                const servicosData = empresaData.servicos || [];

                const servicosList = servicosData.map((servico: any) => ({
                    id: servico.id,
                    nome: servico.nome,
                    preco: servico.preco,
                    categoria: servico.categoria
                }));

                setServicos(servicosList);
                if (servicosList.length > 0) {
                    setSelectedServico(servicosList[0].id);
                }
            } catch (error) {
                console.error("Erro ao carregar serviços:", error);
            }
        };

        carregarServicos();
    }, [userId]);

    // Carregar agendamentos do funcionário selecionado
    useEffect(() => {
        const carregarAgendamentos = async () => {
            if (!selectedFuncionario) return;

            try {
                const agendamentosRef = collection(db, "agendamentos");
                const qAgendamentos = query(
                    agendamentosRef, 
                    where("funcionarioId", "==", selectedFuncionario)
                );
                const agendamentosSnapshot = await getDocs(qAgendamentos);

                const agendamentosList = agendamentosSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        data: data.data,
                        status: data.status || undefined,
                        ...data,
                    };
                });

                const today = new Date().toISOString().split("T")[0];

                const agendamentosHoje = agendamentosList.filter(agendamento => {
                    const agendamentoData = agendamento.data.toDate().toISOString().split("T")[0];
                    return agendamentoData === today;
                });

                const finalizadosHoje = agendamentosHoje.filter(
                    agendamento => agendamento.status === "finalizado"
                );

                setAgendamentos(agendamentosList);
                setAgendamentosFinalizadosHoje(finalizadosHoje.length);
                setAgendamentosAindaParaHoje(agendamentosHoje.length);
            } catch (error) {
                console.error("Erro ao carregar agendamentos:", error);
            }
        };

        carregarAgendamentos();
    }, [selectedFuncionario]);

    // Carregar estatísticas por serviço do funcionário
    useEffect(() => {
        const carregarEstatisticasServico = async () => {
            if (!selectedFuncionario || !selectedServico) return;

            try {
                const agendamentosRef = collection(db, "agendamentos");
                const qAgendamentos = query(
                    agendamentosRef,
                    where("funcionarioId", "==", selectedFuncionario),
                    where("servicoId", "==", selectedServico)
                );
                const agendamentosSnapshot = await getDocs(qAgendamentos);

                const agendamentosList = agendamentosSnapshot.docs.map(doc => doc.data());

                // Filtrar por data selecionada para serviços reservados
                const dataReservados = dateServicosReservados.toISOString().split("T")[0];
                const reservadosNaData = agendamentosList.filter(agendamento => {
                    const agendamentoData = agendamento.data.toDate().toISOString().split("T")[0];
                    return agendamentoData === dataReservados;
                });

                // Filtrar por data selecionada para serviços realizados
                const dataRealizados = dateServicosRealizados.toISOString().split("T")[0];
                const realizadosNaData = agendamentosList.filter(agendamento => {
                    const agendamentoData = agendamento.data.toDate().toISOString().split("T")[0];
                    return agendamentoData === dataRealizados && agendamento.status === "finalizado";
                });

                // Atualizar estatísticas
                setQuantidadeServicosReservados(reservadosNaData.length);
                setValorTotalServicosReservados(
                    reservadosNaData.reduce((total, agend) => total + (agend.servico?.preco || 0), 0)
                );

                setQuantidadeServicosRealizados(realizadosNaData.length);
                setValorTotalServicosRealizados(
                    realizadosNaData.reduce((total, agend) => total + (agend.servico?.preco || 0), 0)
                );

            } catch (error) {
                console.error("Erro ao carregar estatísticas do serviço:", error);
            }
        };

        carregarEstatisticasServico();
    }, [selectedFuncionario, selectedServico, dateServicosReservados, dateServicosRealizados]);

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Funcionarios</Text>
                <TouchableOpacity>
                    <Image source={engrenagemImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[UserScreenStyle.containerRest,{height:930}]}>
                    <View style={EmpresaInfoMoneyScreenStyle.containerInputFotoFuncionarios}>
                        <View style={EmpresaInfoMoneyScreenStyle.contianerImgFuncionarios}>
                            <Image source={funcionariosImg} style={EmpresaInfoMoneyScreenStyle.imgFuncionarios}/>
                        </View>
                        <View style={[EmpresaInfoMoneyScreenStyle.inputContainerOneInput, { backgroundColor: 'transparent' }]}>
                            <Text style={{ color: '#00C20A' }}>Funcionário</Text>
                            <TouchableOpacity
                                onPress={() => setModalFuncionarioVisible(true)}
                                style={{
                                    backgroundColor: "rgba(50, 50, 50, 0.8)",
                                    padding: 10,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                    minWidth: 200,
                                }}
                            >
                                <Text style={{ color: "white" }}>
                                    {funcionarios.find(f => f.id === selectedFuncionario)?.nome || "Selecione um funcionário"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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

                    {/* Serviços Reservados */}
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
                                    <View style={{ backgroundColor: 'white', width: 110, height: 30, position: 'relative', top: 0, left: -113, borderRadius:4}} />
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
                                        {servicos.find(s => s.id === selectedServico)?.nome || "Selecione um serviço"}
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

                    {/* Serviços Realizados */}
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
                                    <View style={{ backgroundColor: 'white', width: 110, height: 30, position: 'relative', top: 0, left: -113, borderRadius:4}} />
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
                                        {servicos.find(s => s.id === selectedServico)?.nome || "Selecione um serviço"}
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

                    <View>
                        <TouchableOpacity style={EmpresaInfoMoneyScreenStyle.touchableOpacityAdd} onPress={() => navigation.navigate("SignFuncionario")}>
                            <Text style={{color: 'white', fontWeight: 'bold',fontSize: 18}}>Adicionar Funcionário</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <EmpresaNavBar/>

            {/* Modal de Seleção de Funcionário */}
            <Modal visible={modalFuncionarioVisible} transparent animationType="slide">
                <View style={EmpresaInfoMoneyScreenStyle.modalContainer}>
                    <View style={EmpresaInfoMoneyScreenStyle.modalContent}>
                        <Text style={EmpresaInfoMoneyScreenStyle.modalTitle}>Selecione o funcionário</Text>
                        <View style={{ backgroundColor: "#f0f0f0", borderRadius: 8, width: "100%" }}>
                            {funcionarios.length > 0 ? (
                                <Picker
                                    selectedValue={selectedFuncionario}
                                    onValueChange={(itemValue) => setSelectedFuncionario(itemValue)}
                                    itemStyle={{ color: "black", fontSize: 16 }}
                                    dropdownIconColor="black"
                                >
                                    {funcionarios.map((funcionario) => (
                                        <Picker.Item 
                                            key={funcionario.id} 
                                            label={funcionario.nome} 
                                            value={funcionario.id}
                                        />
                                    ))}
                                </Picker>
                            ) : (
                                <Text style={{ padding: 10, textAlign: 'center' }}>
                                    Nenhum funcionário encontrado
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => setModalFuncionarioVisible(false)} style={EmpresaInfoMoneyScreenStyle.modalButton}>
                            <Text style={{ color: "white" }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Seleção de Serviço */}
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
        </View>
    );
};

export default EmpresaInfoFuncionariosScreen;