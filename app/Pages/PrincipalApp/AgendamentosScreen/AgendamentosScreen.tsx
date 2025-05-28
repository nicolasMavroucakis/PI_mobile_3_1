import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert, Modal, TextInput } from "react-native"
import HomeScreenStyle from "../HomeScreen/HomeScreenStyle"
import AgendamentoScreenStyle from "./AgendamentoScreenStyle"
import HomeNavBar from "@/components/HomeNavBar"
import ClockImg from "../../../../assets/images/clock.png"
import Location from "../../../../assets/images/location.png"
import CheckImg from "../../../../assets/images/check.png"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs, orderBy, Timestamp, doc, getDoc, updateDoc, addDoc } from "firebase/firestore"
import StartFirebase from "@/app/crud/firebaseConfig"
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext"
import { useAgendamentoServicos } from "@/app/GlobalContext/AgendamentoServicosGlobalContext"

type RootStackParamList = {
    DetalhesAgendamentoStatusChangeScreen: {
        agendamento: Agendamento;
    };
    ReservaScreen: {
        servico?: {
            nome: string;
            duracao?: number;
            preco?: number;
            status?: string;
        };
        empresaId: string;
    };
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
    empresaId: string;
    clienteId: string;
    status?: string;
    empresaInfo?: {
        nome: string;
        fotoPerfil?: string;
    };
}

const AgendamentoScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    const { adicionarServico, limparSelecao } = useAgendamentoServicos();
    const [agendamentosAtivos, setAgendamentosAtivos] = useState<Agendamento[]>([]);
    const [agendamentosHistorico, setAgendamentosHistorico] = useState<Agendamento[]>([]);
    const [agendamentosEmAndamento, setAgendamentosEmAndamento] = useState<Agendamento[]>([]);
    const [agendamentosEsperandoConfirmacao, setAgendamentosEsperandoConfirmacao] = useState<Agendamento[]>([]);
    const [avaliarModalVisible, setAvaliarModalVisible] = useState(false);
    const [avaliacaoNota, setAvaliacaoNota] = useState(0);
    const [avaliacaoComentario, setAvaliacaoComentario] = useState("");
    const [agendamentoParaAvaliar, setAgendamentoParaAvaliar] = useState<Agendamento | null>(null);

    const handleConfirmarFinalizacao = async (agendamentoId: string) => {
        const agendamento = agendamentosEsperandoConfirmacao.find(a => a.id === agendamentoId);
        if (agendamento) {
            setAgendamentoParaAvaliar(agendamento);
            setAvaliarModalVisible(true);
        }
    };

    const enviarAvaliacao = async () => {
        if (!agendamentoParaAvaliar) return;
        try {
            // Salvar avaliação no Firestore
            const avaliacao = {
                empresaId: agendamentoParaAvaliar.empresaId,
                agendamentoId: agendamentoParaAvaliar.id,
                clienteId: agendamentoParaAvaliar.clienteId,
                nota: avaliacaoNota,
                comentario: avaliacaoComentario,
                data: new Date()
            };
            await addDoc(collection(db, "avaliacao"), avaliacao);
            // Atualizar média/total na empresa
            const avaliacoesSnap = await getDocs(query(collection(db, "avaliacoes"), where("empresaId", "==", agendamentoParaAvaliar.empresaId)));
            const avaliacoes = avaliacoesSnap.docs.map(doc => doc.data());
            const total = avaliacoes.length;
            const media = avaliacoes.reduce((sum, a) => sum + (a.nota || 0), 0) / total;
            await updateDoc(doc(db, "empresas", agendamentoParaAvaliar.empresaId), {
                mediaAvaliacoes: media,
                totalAvaliacoes: total
            });
            // Finalizar agendamento
            await updateDoc(doc(db, "agendamentos", agendamentoParaAvaliar.id), {
                status: "finalizado"
            });
            setAvaliarModalVisible(false);
            setAvaliacaoNota(0);
            setAvaliacaoComentario("");
            setAgendamentoParaAvaliar(null);
            fetchAgendamentos();
            Alert.alert("Sucesso", "Avaliação enviada e serviço finalizado!");
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            Alert.alert("Erro", "Não foi possível enviar a avaliação.");
        }
    };

    const handleRecusarFinalizacao = async (agendamentoId: string) => {
        try {
            const agendamentoRef = doc(db, "agendamentos", agendamentoId);
            await updateDoc(agendamentoRef, {
                status: "em_andamento"
            });
            
            // Atualizar a lista localmente
            fetchAgendamentos();
            
            Alert.alert("Aviso", "Serviço retornado para 'Em andamento'");
        } catch (error) {
            console.error("Erro ao recusar finalização:", error);
            Alert.alert("Erro", "Não foi possível recusar a finalização do serviço.");
        }
    };

    const fetchAgendamentos = async () => {
        if (!userId) return;

        try {
            const agendamentosRef = collection(db, "agendamentos");
            const q = query(agendamentosRef, where("clienteId", "==", userId));
            const querySnapshot = await getDocs(q);

            const agendamentos = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agendamento[];

            console.log("Todos os agendamentos:", agendamentos);

            agendamentos.sort((a, b) => b.data.seconds - a.data.seconds);
            const hoje = new Date();
            console.log("Data atual (hoje):", hoje);

            // Separar agendamentos por status
            const emAndamento = agendamentos.filter(agendamento => 
                agendamento.status === "em_andamento"
            );

            const esperandoConfirmacao = agendamentos.filter(agendamento =>
                agendamento.status === "esperando_confirmacao"
            );

            const ativos = agendamentos.filter(agendamento => {
                const dataAgendamento = new Date(agendamento.data.seconds * 1000);
                console.log("Verificando agendamento:", {
                    id: agendamento.id,
                    data: dataAgendamento,
                    status: agendamento.status,
                    ehFuturo: dataAgendamento >= hoje
                });
                return (
                    agendamento.status === "agendado" || 
                    (agendamento.status !== "em_andamento" && 
                     agendamento.status !== "esperando_confirmacao" && 
                     agendamento.status !== "finalizado")
                );
            });

            console.log("Agendamentos ativos filtrados:", ativos);

            const historico = agendamentos.filter(agendamento => {
                const dataAgendamento = new Date(agendamento.data.seconds * 1000);
                return dataAgendamento < hoje && agendamento.status === "finalizado";
            });

            setAgendamentosEmAndamento(emAndamento);
            setAgendamentosEsperandoConfirmacao(esperandoConfirmacao);
            setAgendamentosAtivos(ativos);

            const enrichedHistorico = await enrichHistoricoWithUserInfo(historico);
            setAgendamentosHistorico(enrichedHistorico);

        } catch (error) {
            console.error("Erro ao buscar agendamentos:", error);
        }
    };

    useEffect(() => {
        fetchAgendamentos();
    }, [userId]);

    const enrichHistoricoWithUserInfo = async (historico: Agendamento[]) => {
        const enriched = await Promise.all(historico.map(async (item) => {
            try {
                const empresaRef = doc(db, "empresas", item.empresaId);
                const empresaSnap = await getDoc(empresaRef);
                if (!empresaSnap.exists()) return item;

                const empresaData = empresaSnap.data();
                const userRef = doc(db, "users", empresaData.userId);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) return item;

                const userData = userSnap.data();
                return {
                    ...item,
                    empresaInfo: {
                        nome: userData.nome,
                        fotoPerfil: userData.fotoPerfil
                    }
                };
            } catch (error) {
                console.error("Erro ao enriquecer histórico:", error);
                return item;
            }
        }));

        return enriched;
    };

    const handleAgendamentoPress = (agendamento: Agendamento) => {
        navigation.navigate('DetalhesAgendamentoStatusChangeScreen', { agendamento });
    };

    const handleAdicionarASacola = (agendamento: Agendamento) => {
        limparSelecao();
        if (agendamento.servico) {
            adicionarServico({
                nome: agendamento.servico.nome,
                preco: agendamento.servico.preco || 0,
                duracao: agendamento.servico.duracao || 0
            });
        }
        navigation.navigate('ReservaScreen', { empresaId: agendamento.empresaId });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={AgendamentoScreenStyle.containerTitle}>
                    <Text style={AgendamentoScreenStyle.textTitle}>Meus Agendamentos</Text>
                </View>
                <View style={[AgendamentoScreenStyle.containerRest, { height: 1000 }]}>
                    <Text style={[AgendamentoScreenStyle.textTitleInside, { marginTop: 10 }]}>Agendados</Text>
                    <ScrollView style={AgendamentoScreenStyle.agendamentosAtivosContainer}>
                        {agendamentosAtivos.length === 0 ? (
                            <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhum agendamento ativo encontrado.</Text>
                        ) : (
                            agendamentosAtivos.map((agendamento) => (
                                <TouchableOpacity 
                                    key={agendamento.id} 
                                    style={HomeScreenStyle.MeusAgendamentosInput}
                                    onPress={() => handleAgendamentoPress(agendamento)}
                                >
                                    <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-start' }]}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#B10000' }}>
                                                {new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                            </Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#B10000' }}>
                                                {new Date(agendamento.data.seconds * 1000).getDate()}
                                            </Text>
                                        </View>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'center' }]}>
                                            <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                <Image source={ClockImg} />
                                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                                    {new Date(agendamento.data.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </View>
                                            <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                <Image source={Location} />
                                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Atendimento a Residência</Text>
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

                    <Text style={AgendamentoScreenStyle.textTitleInside}>Histórico</Text>
                    <View style={{ flex: 1, maxHeight: 400 }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                            <View style={AgendamentoScreenStyle.AgendamentoContainerBoxes}>
                                {agendamentosHistorico.length === 0 ? (
                                    <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhum agendamento no histórico.</Text>
                                ) : (
                                    (() => {
                                        const grupos: { [data: string]: Agendamento[] } = {};
                                        agendamentosHistorico.forEach(agendamento => {
                                            const data = new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            });
                                            if (!grupos[data]) grupos[data] = [];
                                            grupos[data].push(agendamento);
                                        });
                                        return Object.entries(grupos).map(([data, agendamentos], groupIdx) => (
                                            <React.Fragment key={data}>
                                                <Text style={AgendamentoScreenStyle.textTitleInsideHistorico}>{data}</Text>
                                                {agendamentos.map((agendamento, idx) => (
                                                    <View
                                                        key={agendamento.id}
                                                        style={[
                                                            AgendamentoScreenStyle.AgendamentoContainerInside,
                                                            groupIdx === Object.entries(grupos).length - 1 && idx === agendamentos.length - 1 && { paddingBottom: 20 }
                                                        ]}
                                                    >
                                                        <View style={AgendamentoScreenStyle.AgendamentoHistoricoBox}>
                                                            <View style={AgendamentoScreenStyle.imgHisotricoBoxOutside}>
                                                                <Image
                                                                    source={
                                                                        agendamento.empresaInfo?.fotoPerfil
                                                                            ? { uri: agendamento.empresaInfo.fotoPerfil }
                                                                            : require("../../../../assets/images/imageExemplo.png")
                                                                    }
                                                                    style={AgendamentoScreenStyle.imgHisotricoBox}
                                                                />
                                                                <Text style={{
                                                                    flex: 1,
                                                                    textAlign: 'center',
                                                                    color: '#fff',
                                                                    fontWeight: 'bold',
                                                                    fontSize: 18
                                                                }}>
                                                                    {agendamento.empresaInfo?.nome || "Empresa"}
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
                                                                onPress={() => handleAdicionarASacola(agendamento)}
                                                            >
                                                                <Text style={AgendamentoScreenStyle.TouchableOpacityText}>
                                                                    Adicionar à sacola
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))}
                                            </React.Fragment>
                                        ));
                                    })()
                                )}
                            </View>
                        </ScrollView>
                    </View>

                    {agendamentosEmAndamento.length > 0 && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={AgendamentoScreenStyle.textTitleInside}>Em Andamento</Text>
                            <ScrollView style={AgendamentoScreenStyle.agendamentosAtivosContainer}>
                                {agendamentosEmAndamento.map((agendamento) => (
                                    <TouchableOpacity 
                                        key={agendamento.id} 
                                        style={HomeScreenStyle.MeusAgendamentosInput}
                                        onPress={() => handleAgendamentoPress(agendamento)}
                                    >
                                        <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                                            <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-start' }]}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#B10000' }}>
                                                    {new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                                </Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#B10000' }}>
                                                    {new Date(agendamento.data.seconds * 1000).getDate()}
                                                </Text>
                                            </View>
                                            <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'center' }]}>
                                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                    <Image source={ClockImg} />
                                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                                        {new Date(agendamento.data.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </Text>
                                                </View>
                                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                    <Image source={Location} />
                                                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Atendimento a Residência</Text>
                                                </View>
                                            </View>
                                            <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-end' }]}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 15, paddingRight: 10 }}>
                                                    {agendamento.servico?.nome || "Serviço"}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {agendamentosEsperandoConfirmacao.length > 0 && (
                        <View style={{ marginTop: 20, marginBottom: 80 }}>
                            <Text style={[AgendamentoScreenStyle.textTitleInside, { color: '#FFA500' }]}>
                                Esperando Confirmação
                            </Text>
                            <ScrollView style={[AgendamentoScreenStyle.agendamentosAtivosContainer, { height: 200 }]}>
                                {agendamentosEsperandoConfirmacao.map((agendamento) => (
                                    <View key={agendamento.id}>
                                        <TouchableOpacity 
                                            style={HomeScreenStyle.MeusAgendamentosInput}
                                            onPress={() => handleAgendamentoPress(agendamento)}
                                        >
                                            <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                                                <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-start' }]}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#FFA500' }}>
                                                        {new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                                    </Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#FFA500' }}>
                                                        {new Date(agendamento.data.seconds * 1000).getDate()}
                                                    </Text>
                                                </View>
                                                <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'center' }]}>
                                                    <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                        <Image source={ClockImg} />
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                                            {new Date(agendamento.data.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </Text>
                                                    </View>
                                                    <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                        <Image source={Location} />
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Atendimento a Residência</Text>
                                                    </View>
                                                </View>
                                                <View style={[HomeScreenStyle.containersDentroAgendamento, { alignItems: 'flex-end' }]}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 15, paddingRight: 10 }}>
                                                        {agendamento.servico?.nome || "Serviço"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 20 }}>
                                            <TouchableOpacity 
                                                onPress={() => handleConfirmarFinalizacao(agendamento.id)}
                                                style={{
                                                    backgroundColor: '#00C20A',
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    width: '45%',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmar Finalização</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => handleRecusarFinalizacao(agendamento.id)}
                                                style={{
                                                    backgroundColor: '#B10000',
                                                    padding: 10,
                                                    borderRadius: 5,
                                                    width: '45%',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Recusar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>
            <HomeNavBar />
            {/* Modal de Avaliação */}
            <Modal
                visible={avaliarModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setAvaliarModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: 300 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Avalie o serviço</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                            {[1,2,3,4,5].map(n => (
                                <TouchableOpacity key={n} onPress={() => setAvaliacaoNota(n)}>
                                    <Text style={{ fontSize: 30, color: n <= avaliacaoNota ? '#FFD700' : '#ccc' }}>★</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            placeholder="Deixe um comentário (opcional)"
                            value={avaliacaoComentario}
                            onChangeText={setAvaliacaoComentario}
                            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 }}
                            multiline
                        />
                        <TouchableOpacity
                            style={{ backgroundColor: '#00C20A', padding: 10, borderRadius: 5, alignItems: 'center' }}
                            onPress={enviarAvaliacao}
                            disabled={avaliacaoNota === 0}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar Avaliação</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginTop: 10, alignItems: 'center' }}
                            onPress={() => setAvaliarModalVisible(false)}
                        >
                            <Text style={{ color: '#B10000' }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AgendamentoScreen;