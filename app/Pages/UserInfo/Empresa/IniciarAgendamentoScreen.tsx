import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle";
import ImgExemplo from "../../../../assets/images/user.jpeg";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useRoute, RouteProp } from "@react-navigation/native";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import StartFirebase from "@/app/crud/firebaseConfig";

type RouteParams = {
    IniciarAgendamento: {
        agendamento: {
            id: string;
            clienteId: string;
            data: any;
            servico: {
                nome: string;
            };
            horaInicio: string;
            horaFim: string;
            status: string;
            empresaId: string;
        };
    };
};

interface ClienteData {
    nome: string;
    fotoPerfil: string;
}

const IniciarAgendamentoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteParams, 'IniciarAgendamento'>>();
    const [agendamentoState, setAgendamentoState] = useState(route.params?.agendamento);
    const [clienteData, setClienteData] = useState<ClienteData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { db } = StartFirebase();

    useEffect(() => {
        const buscarDadosCliente = async () => {
            if (!agendamentoState?.clienteId) return;

            try {
                const clienteDoc = await getDoc(doc(collection(db, "users"), agendamentoState.clienteId));
                
                if (clienteDoc.exists()) {
                    const dados = clienteDoc.data();
                    setClienteData({
                        nome: dados.nome || 'Nome não disponível',
                        fotoPerfil: dados.fotoPerfil || ''
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar dados do cliente:", error);
            }
        };

        buscarDadosCliente();
    }, [agendamentoState?.clienteId]);

    const formatarData = (data: any) => {
        if (!data) return '';
        const dataObj = data.toDate();
        return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
    };

    const atualizarStatusAgendamento = async (novoStatus: string) => {
        if (!agendamentoState?.id || isLoading) return;

        setIsLoading(true);
        try {
            console.log("Iniciando atualização de status:", {
                agendamentoId: agendamentoState.id,
                statusAtual: agendamentoState.status,
                novoStatus: novoStatus
            });

            const agendamentoRef = doc(collection(db, "agendamentos"), agendamentoState.id);
            await updateDoc(agendamentoRef, {
                status: novoStatus
            });

            console.log("Status atualizado com sucesso no Firebase");

            setAgendamentoState(prev => ({
                ...prev!,
                status: novoStatus
            }));

            console.log("Estado local atualizado");

            setTimeout(() => {
                console.log("Navegando de volta para a tela anterior");
                navigation.goBack();
            }, 500);

        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleButtonPress = () => {
        console.log("Botão pressionado. Status atual:", agendamentoState?.status);
        if (agendamentoState?.status === "agendado") {
            console.log("Iniciando agendamento...");
            atualizarStatusAgendamento("em_andamento");
        } else if (agendamentoState?.status === "em_andamento") {
            console.log("Finalizando agendamento...");
            atualizarStatusAgendamento("finalizado");
        }
    };

    const getButtonStyle = () => {
        const baseStyle = {
            backgroundColor: agendamentoState?.status === "em_andamento" ? '#FF0000' : '#00C20A',
            width: '94%' as any,
            padding: 15,
            borderRadius: 8,
            alignSelf: 'center' as const,
            marginTop: 30,
            marginBottom: 20,
            opacity: isLoading ? 0.7 : 1
        };
        return baseStyle;
    };

    const getButtonText = () => {
        if (isLoading) return "Processando...";
        if (agendamentoState?.status === "em_andamento") return "Finalizar Agendamento";
        return "Iniciar Agendamento";
    };

    const shouldShowButton = agendamentoState?.status !== "finalizado";

    return (
        <ScrollView style={EmpresaInfoMoneyScreenStyle.containerIniciarAgendamento}>
            <View style={EmpresaInfoMoneyScreenStyle.containerIniciarAgendamentoTop}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign 
                        name={"left"} 
                        size={30} 
                        color={"#00C20A"} 
                        style={{ marginLeft: 10 }}         
                    />
                </TouchableOpacity>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
                    Detalhes do Agendamento
                </Text>
                <TouchableOpacity style={{width: 30, height: 30}}/>
            </View>
            <View style={EmpresaInfoMoneyScreenStyle.containerIniciarAgendamentoTopImage}>
                <Image 
                    source={clienteData?.fotoPerfil ? { uri: clienteData.fotoPerfil } : ImgExemplo} 
                    style={[
                        EmpresaInfoMoneyScreenStyle.imgPerfilIniciarAgendamento,
                        { width: 120, height: 120, borderRadius: 60 }
                    ]}
                />
                <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 10}}>
                    {clienteData?.nome || 'Carregando...'}
                </Text>
            </View>
            <View style={EmpresaInfoMoneyScreenStyle.containerInformacoesdoAgendamentoTitulo}>
                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10}}>
                    Informações do Agendamento
                </Text>
            </View>
            <View style={{ marginLeft: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>
                        Serviço:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        {agendamentoState?.servico?.nome || 'Não especificado'}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>
                        Data:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        {formatarData(agendamentoState?.data)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>
                        Hora de Inicio:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        {agendamentoState?.horaInicio || '--:--'}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>
                        Hora de Fim:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        {agendamentoState?.horaFim || '--:--'}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>
                        Status:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        {agendamentoState?.status || 'Não definido'}
                    </Text>
                </View>
            </View>
            {shouldShowButton && (
                <TouchableOpacity 
                    style={getButtonStyle()}
                    onPress={handleButtonPress}
                    disabled={isLoading}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {getButtonText()}
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    )
}

export default IniciarAgendamentoScreen;