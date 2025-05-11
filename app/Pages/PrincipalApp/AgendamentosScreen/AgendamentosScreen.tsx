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
import { useEffect, useState } from "react"
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore"
import StartFirebase from "@/app/crud/firebaseConfig"
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext"

type RootStackParamList = {
    DetalhesAgendamento: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Agendamento {
    id: string;
    data: Timestamp;
    servico?: {
        nome: string;
        duracao?: number;
        preco?: number;
        status?: string;
    };
    empresa?: {
        nome: string;
    };
    clienteId: string;
    status?: string;
}

const AgendamentoScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    const [agendamentosAtivos, setAgendamentosAtivos] = useState<Agendamento[]>([]);
    const [agendamentosHistorico, setAgendamentosHistorico] = useState<Agendamento[]>([]);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            if (!userId) return;
            
            try {
                const agendamentosRef = collection(db, "agendamentos");
                const q = query(
                    agendamentosRef, 
                    where("clienteId", "==", userId)
                );
                
                const querySnapshot = await getDocs(q);
                const agendamentos = querySnapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                })) as Agendamento[];

                // Ordenar por data (mais recente primeiro)
                agendamentos.sort((a, b) => b.data.seconds - a.data.seconds);

                // Separar agendamentos ativos e histórico
                const hoje = new Date();
                const ativos = agendamentos.filter(agendamento => {
                    const dataAgendamento = new Date(agendamento.data.seconds * 1000);
                    return dataAgendamento >= hoje;
                });
                
                console.log("Todos agendamentos:", agendamentos);
                console.log("Data agora:", hoje);
                const historico = agendamentos.filter(agendamento => {
                    const dataAgendamento = new Date(agendamento.data.seconds * 1000);
                    return (
                        dataAgendamento < hoje &&
                        agendamento.status === "finalizado"
                    );
                });
                console.log("Historico:", historico);

                setAgendamentosAtivos(ativos);
                setAgendamentosHistorico(historico);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            }
        };

        fetchAgendamentos();
    }, [userId]);

    return (
        <View style={{ flex: 1, height: 1000, backgroundColor: "#000" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={AgendamentoScreenStyle.containerTitle}>
                    <Text style={AgendamentoScreenStyle.textTitle}>
                        Meus Agendamentos
                    </Text>
                </View>
                <View style={AgendamentoScreenStyle.containerRest}>
                    <View>
                        <Text style={[AgendamentoScreenStyle.textTitleInside, { marginTop: 10 }]}>
                            Agendamdos
                        </Text>
                        <ScrollView style={AgendamentoScreenStyle.agendamentosAtivosContainer}>
                            {agendamentosAtivos.length === 0 ? (
                                <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhum agendamento ativo encontrado.</Text>
                            ) : (
                                agendamentosAtivos.map((agendamento) => (
                                    <TouchableOpacity key={agendamento.id} style={HomeScreenStyle.MeusAgendamentosInput}>
                                        <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                                            <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-start' }]}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#B10000' }}>
                                                    {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }) : ''}
                                                </Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#B10000' }}>
                                                    {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).getDate() : ''}
                                                </Text>
                                            </View>
                                            <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'center' }]}>
                                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                    <Image source={ClockImg} />
                                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                                        {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
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
                                                    {agendamento.servico?.nome || "Serviço"}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                    <Text style={AgendamentoScreenStyle.textTitleInside}>
                        Histórico
                    </Text>
                    <View style={{ flex: 1, maxHeight: 400 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            <View style={AgendamentoScreenStyle.AgendamentoContainerBoxes}>
                                {agendamentosHistorico.length === 0 ? (
                                    <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhum agendamento no histórico.</Text>
                                ) : (
                                    agendamentosHistorico.map((agendamento, idx) => (
                                        <View
                                            key={agendamento.id}
                                            style={[
                                                AgendamentoScreenStyle.AgendamentoContainerInside,
                                                idx === agendamentosHistorico.length - 1 && { paddingBottom: 100 }
                                            ]}
                                        >
                                            <Text style={AgendamentoScreenStyle.textTitleInsideHistorico}>
                                                {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', { 
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                }) : ''}
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
                                                        {agendamento.empresa?.nome || "Empresa"}
                                                    </Text>
                                                </View>

                                                <View style={[AgendamentoScreenStyle.line, { marginTop: 15 }]} />

                                                <View style={AgendamentoScreenStyle.servicosBox}>
                                                    <View style={AgendamentoScreenStyle.servicosBoxInside}>
                                                        <Image source={CheckImg} style={{ width: 15, height: 15 }} />
                                                        <Text style={{ color: 'white' }}>Pedido concluído - N {agendamento.id.slice(-4)}</Text>
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
                                                <TouchableOpacity 
                                                    style={AgendamentoScreenStyle.TouchableOpacity} 
                                                    onPress={() => navigation.navigate('DetalhesAgendamento')}
                                                >
                                                    <Text style={AgendamentoScreenStyle.TouchableOpacityText}>
                                                        Adicionar à sacola
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                )}
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