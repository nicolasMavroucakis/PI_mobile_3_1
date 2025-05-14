import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, Modal, StyleSheet } from "react-native";
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
import { useNavigation } from "expo-router";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";

type RootStackParamList = {
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmpresaInfoMoneyScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [dateServicosRealizados, setDateServicosRealizados] = useState(new Date());
    const [dateServicosReservados, setDateServicosReservados] = useState(new Date());
    const { db } = StartFirebase();
    const [selectedService, setSelectedService] = useState("Corte de cabelo");
    const [modalVisible, setModalVisible] = useState(false);

    const servicos = ["Corte de cabelo", "Barba", "Manicure", "Massagem"];
    const [empresaData, setEmpresaData] = useState<any>(null); 
    const { id: userId } = useUserGlobalContext();

    const onChangeServicosRealizados = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || Date;
        setDateServicosRealizados(currentDate);
    };

    const onChangeServicosReservados = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || Date;
        setDateServicosReservados(currentDate);
    };

    const [agendamentos, setAgendamentos] = useState<{ id: string; data: any; status: string | undefined }[]>([]);
    const [agendamentosFinalizadosHoje, setAgendamentosFinalizadosHoje] = useState(0); 
    const [agendamentosAindaParaHoje, setAgendamentosAindaParaHoje] = useState(0);
    const [loading, setLoading] = useState(true);

    const [quantidadeServicosReservados, setQuantidadeServicosReservados] = useState(0);
    const [valorTotalServicosReservados, setValorTotalServicosReservados] = useState(0);

    const [quantidadeServicosRealizados, setQuantidadeServicosRealizados] = useState(0);
    const [valorTotalServicosRealizados, setValorTotalServicosRealizados] = useState(0);

    useEffect(() => {
        const carregarAgendamentos = async () => {
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
    
                const finalizadosHoje = agendamentosHoje.filter(agendamento => agendamento.status && agendamento.status === "finalizado");
    
                console.log("Agendamentos para hoje:", agendamentosHoje.length);
                console.log("Agendamentos finalizados hoje:", finalizadosHoje.length);
    
                setAgendamentos(agendamentosList);
                console.log("Agendamentos:", agendamentosList);
                setAgendamentosFinalizadosHoje(finalizadosHoje.length); 
                setAgendamentosAindaParaHoje(agendamentosHoje.length); 
            } catch (error) {
                console.error("Erro ao carregar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        };
        carregarAgendamentos();
    }, [userId]);
    
    useEffect(() => {
        const carregarServicosReservados = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const qEmpresas = query(empresasRef, where("userId", "==", userId));
                const empresasSnapshot = await getDocs(qEmpresas);
    
                if (empresasSnapshot.empty) {
                    console.log("Nenhuma empresa encontrada para o usuário.");
                    return;
                }
    
                const empresaDoc = empresasSnapshot.docs[0];
                const empresaId = empresaDoc.id;
    
                const agendamentosRef = collection(db, "agendamentos");
                const qAgendamentos = query(agendamentosRef, where("empresaId", "==", empresaId));
                const agendamentosSnapshot = await getDocs(qAgendamentos);
    
                const agendamentosList = agendamentosSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        data: data.data,
                        servico: data.servico,
                        ...data,
                    };
                });
    
                const selectedDate = dateServicosReservados.toISOString().split("T")[0];
    
                const agendamentosNaData = agendamentosList.filter(agendamento => {
                    const agendamentoData = agendamento.data.toDate().toISOString().split("T")[0];
                    return agendamentoData === selectedDate;
                });
    
                const quantidade = agendamentosNaData.length;
    
                const valor = agendamentosNaData.reduce((total, agendamento) => {
                    return total + (agendamento.servico?.preco || 0);
                }, 0);
    
                console.log("Quantidade de serviços reservados:", quantidade);
                console.log("Valor total dos serviços reservados:", valor);
    
                setQuantidadeServicosReservados(quantidade);
                setValorTotalServicosReservados(valor);
            } catch (error) {
                console.error("Erro ao carregar serviços reservados:", error);
            }
        };
    
        carregarServicosReservados();
    }, [dateServicosReservados]);

    useEffect(() => {
        const carregarServicosRealizados = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const qEmpresas = query(empresasRef, where("userId", "==", userId));
                const empresasSnapshot = await getDocs(qEmpresas);
    
                if (empresasSnapshot.empty) {
                    console.log("Nenhuma empresa encontrada para o usuário.");
                    return;
                }
    
                const empresaDoc = empresasSnapshot.docs[0];
                const empresaId = empresaDoc.id;
    
                const agendamentosRef = collection(db, "agendamentos");
                const qAgendamentos = query(agendamentosRef, where("empresaId", "==", empresaId));
                const agendamentosSnapshot = await getDocs(qAgendamentos);
    
                const agendamentosList = agendamentosSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        data: data.data,
                        servico: data.servico,
                        status: data.status,
                        ...data,
                    };
                });
    
                const selectedDate = dateServicosRealizados.toISOString().split("T")[0];
    
                // Filtrar agendamentos para a data selecionada e com status "finalizado"
                const agendamentosNaData = agendamentosList.filter(agendamento => {
                    const agendamentoData = agendamento.data.toDate().toISOString().split("T")[0];
                    return agendamentoData === selectedDate && agendamento.status === "finalizado";
                });
    
                // Calcular a quantidade total de serviços realizados
                const quantidade = agendamentosNaData.length;
    
                // Somar os valores dos serviços realizados
                const valor = agendamentosNaData.reduce((total, agendamento) => {
                    return total + (agendamento.servico?.preco || 0);
                }, 0);
    
                console.log("Quantidade de serviços realizados:", quantidade);
                console.log("Valor total dos serviços realizados:", valor);
    
                // Atualizar os estados
                setQuantidadeServicosRealizados(quantidade);
                setValorTotalServicosRealizados(valor);
            } catch (error) {
                console.error("Erro ao carregar serviços realizados:", error);
            }
        };
    
        carregarServicosRealizados();
    }, [dateServicosRealizados]); 

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
                    <TouchableOpacity>
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
                                    <View style={{ backgroundColor: 'white', width: 110, height: 30, position: 'relative', top: 0, left: -113, borderRadius:4}} />
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
                                        value={dateServicosReservados}
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
                                    onPress={() => setModalVisible(true)}
                                    style={[EmpresaInfoMoneyScreenStyle.containerFilterFiltrosEsquerda, { backgroundColor: "rgba(50, 50, 50, 0.8)", padding: 10, borderRadius: 8, justifyContent: 'flex-end' }]}
                                >
                                    <Text style={{ color: "white" }}>{selectedService}</Text>
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
                                            {valorTotalServicosRealizados}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
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
                                {servicos.map((servico) => (
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

export default EmpresaInfoMoneyScreen;