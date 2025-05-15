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
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { format } from 'date-fns';

type RootStackParamList = {
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmpresaInfoAgendamentoScreen = () => {
    const [selectedService, setSelectedService] = useState("Corte de cabelo");
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [agendamentos, setAgendamentos] = useState<any[]>([]);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState<any[]>([]);
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        filterAgendamentosByDate(currentDate);
    };

    const fetchAgendamentos = async () => {
        try {
            if (!userId) {
                Alert.alert("Erro", "Usuário não autenticado.");
                return;
            }

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

            // Create a list to store all promised fetch operations
            const agendamentosPromises = agendamentosSnapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                console.log("Agendamento Date:", data.data.toDate().toISOString());
                
                // Fetch cliente (user) information
                const clienteId = data.clienteId;
                let clienteNome = "Cliente";
                let clienteFotoPerfil = "";
                
                if (clienteId) {
                    try {
                        const clienteDoc = await getDoc(doc(db, "users", clienteId));
                        if (clienteDoc.exists()) {
                            const clienteData = clienteDoc.data();
                            clienteNome = clienteData.nome || "Cliente";
                            clienteFotoPerfil = clienteData.fotoPerfil || "";
                        }
                    } catch (error) {
                        console.error("Erro ao buscar dados do cliente:", error);
                    }
                }
                
                return {
                    id: docSnapshot.id,
                    data: data.data,
                    servico: data.servico,
                    clienteId: clienteId,
                    clienteNome: clienteNome,
                    clienteFotoPerfil: clienteFotoPerfil,
                    ...data,
                };
            });
            
            // Wait for all promises to resolve
            const agendamentosList = await Promise.all(agendamentosPromises);
            console.log(agendamentosList);

            setAgendamentos(agendamentosList);
            filterAgendamentosByDate(date, agendamentosList); // Initial filter with the new list
        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
            Alert.alert("Erro", "Não foi possível carregar os agendamentos.");
        }
    };

    const filterAgendamentosByDate = (selectedDate: Date, agendamentosList = agendamentos) => {
        const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
        console.log("Selected Date:", selectedDateString);
        const filtered = agendamentosList.filter(agendamento => {
            const agendamentoDate = format(agendamento.data.toDate(), 'yyyy-MM-dd');
            console.log("Agendamento Date:", agendamentoDate);
            return agendamentoDate === selectedDateString;
        });
        setFilteredAgendamentos(filtered); // Set filtered results to the filtered state
        console.log("Filtered Agendamentos:", filtered);
    };

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Agendamentos</Text>
                <TouchableOpacity>
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
                                <View style={{ backgroundColor: 'white', width: 110, height: 30, position: 'relative', top: 0, left: -113, borderRadius: 4 }} />
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
                    {filteredAgendamentos.length === 0 ? (
                        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
                            Nenhum agendamento encontrado.
                        </Text>
                    ) : (
                        filteredAgendamentos.map((agendamento) => (
                            <View key={agendamento.id} style={AgendamentoScreenStyle.AgendamentoHistoricoBox}>
                                <View style={AgendamentoScreenStyle.imgHisotricoBoxOutside}>
                                    {agendamento.clienteFotoPerfil ? (
                                        <Image 
                                            source={{ uri: agendamento.clienteFotoPerfil }} 
                                            style={AgendamentoScreenStyle.imgHisotricoBox} 
                                        />
                                    ) : (
                                        <Image 
                                            source={ImgExemplo} 
                                            style={AgendamentoScreenStyle.imgHisotricoBox} 
                                        />
                                    )}
                                    <Text style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 18
                                    }}>
                                        {agendamento.clienteNome || "Cliente"}
                                    </Text>
                                </View>
                                <View style={[AgendamentoScreenStyle.line, { marginTop: 15 }]} />
                                <View style={AgendamentoScreenStyle.servicosBox}>
                                    <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                        <Image source={CheckImg} style={{ width: 15, height: 15 }} />
                                        <Text style={{ color: 'white' }}>Pedido - {agendamento.id}</Text>
                                    </View>
                                    <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                        <View style={AgendamentoScreenStyle.ballService}>
                                            <Text>1</Text>
                                        </View>
                                        <Text style={{ color: 'white' }}>
                                            {agendamento.servico?.nome || "Serviço"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={AgendamentoScreenStyle.line} />
                                <TouchableOpacity style={AgendamentoScreenStyle.TouchableOpacity}>
                                    <Text style={[AgendamentoScreenStyle.TouchableOpacityText, { color: '#00C20A' }]}>
                                        Iniciar Atendimento
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
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


