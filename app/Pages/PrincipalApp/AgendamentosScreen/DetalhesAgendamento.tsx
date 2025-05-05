import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { ScrollView, View, Image, Text, TouchableOpacity, Platform, Linking } from "react-native";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";
import EmpresaInfoScreenStyle from "../EmpresaInfoScreen/EmpresaInfoScreenStyle";
import UserScreenStyle from "../UserScreen/UserScreenStyle";
import AgendamentoScreenStyle from "./AgendamentoScreenStyle";
import HomeNavBar from "@/components/HomeNavBar";
import MapsImg from "../../../../assets/images/maps.png";

const DetalhesAgendamento = () => {
    // Coordenadas do local
    const latitude = -23.55052;
    const longitude = -46.633308;

    // Função para abrir o app de mapas
    const abrirMaps = () => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
            android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
        });

        if (url) {
            Linking.openURL(url).catch((err) => {
                console.error("Erro ao abrir o Maps:", err);
            });
        }
    };

    return (
        <View style={{ flex: 1, height: 1000, backgroundColor: "#000" }}>
            <ScrollView>
                <View style={UserScreenStyle.containerTitle}>
                    <Text style={UserScreenStyle.textTitle}>
                        Agendamento
                    </Text>
                </View>
                <View style={AgendamentoScreenStyle.MaisInformacoesAgendamento}>
                    <Image
                        source={ImgExemplo}
                        style={EmpresaInfoScreenStyle.principalImage}
                        resizeMode="cover"
                    />
                    <View style={AgendamentoScreenStyle.MaisInformacoesAgendamentoText}>
                        <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>
                            Mecanico do seu Zé
                        </Text>
                        <View style={AgendamentoScreenStyle.continerTextCamposInfo}>
                            <Text style={AgendamentoScreenStyle.informacoesText}>
                                Serviço:
                            </Text>
                            <Text style={AgendamentoScreenStyle.informacoesTextBranco}>
                                Troca de Pneu
                            </Text>
                        </View>
                        <View style={AgendamentoScreenStyle.continerTextCamposInfo}>
                            <Text style={AgendamentoScreenStyle.informacoesText}>
                                Funcionario:
                            </Text>
                            <Text style={AgendamentoScreenStyle.informacoesTextBranco}>
                                Joca
                            </Text>
                        </View>
                        <View style={AgendamentoScreenStyle.continerTextCamposInfo}>
                            <Text style={AgendamentoScreenStyle.informacoesText}>
                                Data e Hora:
                            </Text>
                            <Text style={AgendamentoScreenStyle.informacoesTextBranco}>
                                09:00 do dia 9 de fevereiro de 2025
                            </Text>
                        </View>
                        <View style={AgendamentoScreenStyle.continerTextCamposInfo}>
                            <Text style={AgendamentoScreenStyle.informacoesText}>
                                Local:
                            </Text>
                            <Text style={AgendamentoScreenStyle.informacoesTextBranco}>
                                Rua das bananas, 137, São Paulo
                            </Text>
                        </View>
                    </View>
                    <View style={AgendamentoScreenStyle.containerTouchbleOpacityMaps}>
                        <TouchableOpacity
                            style={AgendamentoScreenStyle.TouchbleOpacityMaps}
                            onPress={abrirMaps}
                        >
                            <Image source={MapsImg} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <HomeNavBar />
        </View>
    );
};

export default DetalhesAgendamento;