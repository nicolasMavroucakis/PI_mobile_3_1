import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image, ScrollView, Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle";
import setaImg from "../../../../assets/images/seta.png";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import funcionariosImg from "../../../../assets/images/funcionarios.png"

const EmpresaInfoFuncionariosScreen = () => {
    const [selectedService, setSelectedService] = useState("Corte de cabelo");
    const [modalVisible, setModalVisible] = useState(false);
    const funcionarios = ["Corte de cabelo", "Barba", "Manicure", "Massagem"];

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={EmpresaInfoMoneyScreenStyle.containerTitle}>
                <TouchableOpacity>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Funcionarios</Text>
                <TouchableOpacity>
                    <Image source={engrenagemImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={UserScreenStyle.containerRest}>
                    <View style={EmpresaInfoMoneyScreenStyle.containerInputFotoFuncionarios}>
                        <View style={EmpresaInfoMoneyScreenStyle.contianerImgFuncionarios}>
                            <Image source={funcionariosImg} style={EmpresaInfoMoneyScreenStyle.imgFuncionarios}/>
                        </View>
                        <View style={[EmpresaInfoMoneyScreenStyle.inputContainerOneInput, { backgroundColor: 'transparent' }]}>
                            <Text style={{ color: '#00C20A' }}>Funcionario</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={{
                                    backgroundColor: "rgba(50, 50, 50, 0.8)",
                                    padding: 10,
                                    borderRadius: 8,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ color: "white" }}>{selectedService}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    );
};

export default EmpresaInfoFuncionariosScreen;