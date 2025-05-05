import { View, ScrollView, Text, TouchableOpacity, Image } from "react-native"
import HomeScreenStyle from "../HomeScreen/HomeScreenStyle"
import AgendamentoScreenStyle from "./AgendamentoScreenStyle"
import HomeNavBar from "@/components/HomeNavBar"
import ClockImg from "../../../../assets/images/clock.png"
import Location from "../../../../assets/images/location.png"
import ImgExemplo from "../../../../assets/images/imageExemplo.png"
import CheckImg from "../../../../assets/images/check.png"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import DetalhesAgendamento from "./DetalhesAgendamento"

type RootStackParamList = {
    DetalhesAgendamento: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AgendamentoScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={{ flex: 1,height: 1000, backgroundColor: "#000" }}>
            <ScrollView  showsVerticalScrollIndicator={false}>
                <View style={AgendamentoScreenStyle.containerTitle}>
                    <Text style={AgendamentoScreenStyle.textTitle}>
                        Meus Agendamentos
                    </Text>
                </View>
                <View style={AgendamentoScreenStyle.containerRest}>
                    <View>
                        <Text style={[AgendamentoScreenStyle.textTitleInside, { marginTop: 10 }]}>
                            Ativos
                        </Text>
                        <ScrollView style={AgendamentoScreenStyle.agendamentosAtivosContainer}>
                            {[1, 2,3,4].map((_, index) => (
                                <TouchableOpacity key={index} style={HomeScreenStyle.MeusAgendamentosInput}>
                                    <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-start' }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#B10000' }}>
                                                Qua
                                            </Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#B10000' }}>
                                                19
                                            </Text>
                                        </View>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'center' }]}>
                                            <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                <Image source={ClockImg} />
                                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                                    10:00 - 12:00
                                                </Text>
                                            </View>
                                            <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                <Image source={Location} />
                                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                                    Atendimento a Residência
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-end' }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 15, paddingRight: 10 }}>
                                                Encanador
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <Text style={AgendamentoScreenStyle.textTitleInside}>
                        Histórico
                    </Text>
                    <View style={{ flex: 1, maxHeight: 400 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <View style={AgendamentoScreenStyle.AgendamentoContainerBoxes}>
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <View key={index} style={AgendamentoScreenStyle.AgendamentoContainerInside}>
                                        <Text style={AgendamentoScreenStyle.textTitleInsideHistorico}>
                                            Dom, 23 fevereiro 2025
                                        </Text>
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
                                            <TouchableOpacity style={AgendamentoScreenStyle.TouchableOpacity} onPress={() => navigation.navigate('DetalhesAgendamento')}>
                                                <Text style={AgendamentoScreenStyle.TouchableOpacityText}>
                                                    Adicionar à sacola
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
            <HomeNavBar />
        </View>
    )
}

export default AgendamentoScreen