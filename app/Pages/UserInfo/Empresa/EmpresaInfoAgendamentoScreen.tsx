import { ScrollView, TouchableOpacity, View, Image, Text, Modal } from "react-native";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import EmpresaNavBar from "@/components/EmpresaNavBar";
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle";
import setaImg from "../../../../assets/images/seta.png";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import ferramentaImg from "../../../../assets/images/ferramenta.png";
import calendarioImg from "../../../../components/assets/Images/Calendario.png";
import { useState } from "react";
import AgendamentoScreenStyle from "../../PrincipalApp/AgendamentosScreen/AgendamentoScreenStyle";
import CheckImg from "../../../../assets/images/check.png"
import ImgExemplo from "../../../../assets/images/imageExemplo.png"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";

type RootStackParamList = {
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmpresaInfoAgendamentoScreen = () => {
const [selectedService, setSelectedService] = useState("Corte de cabelo");
    const [modalVisible, setModalVisible] = useState(false);
    const funcionarios = ["Corte de cabelo", "Barba", "Manicure", "Massagem"];
    const [date, setDate] = useState(new Date());
    const navigation = useNavigation<NavigationProp>();

    const servicos = ["Corte de cabelo", "Barba", "Manicure", "Massagem"];
    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

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
                <View style={[UserScreenStyle.containerRest,{minHeight:750, flexGrow:1}]}>
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
                                />
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
                    <View style={EmpresaInfoMoneyScreenStyle.containerboxAgendamentos}>
                        <View style={AgendamentoScreenStyle.AgendamentoHistoricoBox}>
                            <View style={AgendamentoScreenStyle.imgHisotricoBoxOutside}>
                                <Image source={ImgExemplo} style={AgendamentoScreenStyle.imgHisotricoBox} />
                                <Text style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 18
                                }}>
                                    Oficina do seu Zé
                                </Text>
                            </View>
                            <View style={[AgendamentoScreenStyle.line, { marginTop: 15 }]} />
                            <View style={AgendamentoScreenStyle.servicosBox}>
                                <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                    <Image source={CheckImg} style={{ width: 15, height: 15 }} />
                                    <Text style={{ color: 'white' }}>Pedido concluído - N 7491</Text>
                                </View>
                                <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                    <View style={AgendamentoScreenStyle.ballService}>
                                        <Text>1</Text>
                                    </View>
                                    <Text style={{ color: 'white' }}>
                                        Troca de Óleo
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
                        <View style={AgendamentoScreenStyle.AgendamentoHistoricoBox}>
                            <View style={AgendamentoScreenStyle.imgHisotricoBoxOutside}>
                                <Image source={ImgExemplo} style={AgendamentoScreenStyle.imgHisotricoBox} />
                                <Text style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 18
                                }}>
                                    Oficina do seu Zé
                                </Text>
                            </View>
                            <View style={[AgendamentoScreenStyle.line, { marginTop: 15 }]} />
                            <View style={AgendamentoScreenStyle.servicosBox}>
                                <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                    <Image source={CheckImg} style={{ width: 15, height: 15 }} />
                                    <Text style={{ color: 'white' }}>Pedido concluído - N 7491</Text>
                                </View>
                                <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                    <View style={AgendamentoScreenStyle.ballService}>
                                        <Text>1</Text>
                                    </View>
                                    <Text style={{ color: 'white' }}>
                                        Troca de Óleo
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
                    </View>
                </View>
            </ScrollView>
            <EmpresaNavBar/>
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
                                {funcionarios.map((servico) => (
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
    )
}

export default EmpresaInfoAgendamentoScreen;