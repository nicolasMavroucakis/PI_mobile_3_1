import { View, ScrollView, Image, Text, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import StartFirebase from "@/app/crud/firebaseConfig";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";

type RouteParams = {
    params: {
        agendamento: {
            id: string;
            empresaId: string;
            data: any;
            servico: {
                nome: string;
                preco: number;
            };
            horaInicio: string;
            horaFim: string;
            status: string;
        };
    };
};

interface EmpresaData {
    nome: string;
    fotoPerfil: string;
    userId: string;
}

interface Agendamento {
    id: string;
    empresaId: string;
    data: any;
    servico: {
        nome: string;
        preco: number;
    };
    horaInicio: string;
    horaFim: string;
    status: string;
}

const DetalhesAgendamentoStatusChangeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const [agendamentoState, setAgendamentoState] = useState<Agendamento | null>(route.params?.agendamento);
    const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null);
    const { db } = StartFirebase();

    useEffect(() => {
        const buscarDadosEmpresa = async () => {
            if (!agendamentoState?.empresaId) return;

            try {
                // Buscar dados da empresa
                const empresaDoc = await getDoc(doc(collection(db, "empresas"), agendamentoState.empresaId));
                
                if (empresaDoc.exists()) {
                    const dadosEmpresa = empresaDoc.data();
                    
                    // Buscar dados do usuário da empresa
                    const userDoc = await getDoc(doc(collection(db, "users"), dadosEmpresa.userId));
                    
                    if (userDoc.exists()) {
                        const dadosUser = userDoc.data();
                        setEmpresaData({
                            nome: dadosUser.nome || 'Nome não disponível',
                            fotoPerfil: dadosUser.fotoPerfil || '',
                            userId: dadosEmpresa.userId
                        });
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados da empresa:", error);
            }
        };

        buscarDadosEmpresa();
    }, [agendamentoState?.empresaId]);

    const formatarData = (data: any) => {
        if (!data) return '';
        const dataObj = data.toDate();
        return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'agendado':
                return '#B10000';
            case 'em_andamento':
                return '#00C20A';
            case 'esperando_confirmacao':
                return '#FFA500';
            case 'finalizado':
                return '#0057C2';
            default:
                return '#717171';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'agendado':
                return 'Agendado';
            case 'em_andamento':
                return 'Em Andamento';
            case 'esperando_confirmacao':
                return 'Esperando Confirmação';
            case 'finalizado':
                return 'Finalizado';
            default:
                return status;
        }
    };

    const handleConfirmarFinalizacao = async () => {
        try {
            if (!agendamentoState?.id) return;

            const agendamentoRef = doc(db, "agendamentos", agendamentoState.id);
            await updateDoc(agendamentoRef, {
                status: "finalizado"
            });
            
            // Atualizar o estado local
            setAgendamentoState(prev => ({
                ...prev!,
                status: "finalizado"
            }));
            
            Alert.alert("Sucesso", "Serviço confirmado como finalizado!");
        } catch (error) {
            console.error("Erro ao confirmar finalização:", error);
            Alert.alert("Erro", "Não foi possível confirmar a finalização do serviço.");
        }
    };

    const handleRecusarFinalizacao = async () => {
        try {
            if (!agendamentoState?.id) return;

            const agendamentoRef = doc(db, "agendamentos", agendamentoState.id);
            await updateDoc(agendamentoRef, {
                status: "em_andamento"
            });
            
            // Atualizar o estado local
            setAgendamentoState(prev => ({
                ...prev!,
                status: "em_andamento"
            }));
            
            Alert.alert("Aviso", "Serviço retornado para 'Em andamento'");
        } catch (error) {
            console.error("Erro ao recusar finalização:", error);
            Alert.alert("Erro", "Não foi possível recusar a finalização do serviço.");
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#323232' }}>
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: 15,
                marginTop: 20
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={30} color="#00C20A" />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                    Detalhes do Agendamento
                </Text>
                <View style={{ width: 30 }} />
            </View>

            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Image 
                    source={empresaData?.fotoPerfil ? { uri: empresaData.fotoPerfil } : ImgExemplo} 
                    style={{ width: 120, height: 120, borderRadius: 60 }}
                />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', marginTop: 10 }}>
                    {empresaData?.nome || 'Carregando...'}
                </Text>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                    Informações do Agendamento
                </Text>

                <View style={{ marginLeft: 10 }}>
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
                            Valor:
                        </Text>
                        <Text style={{ color: '#00C20A', fontSize: 18, fontWeight: 'bold' }}>
                            R$ {agendamentoState?.servico?.preco?.toFixed(2) || '0,00'}
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
                            Hora de Início:
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
                        <Text style={{ 
                            color: getStatusColor(agendamentoState?.status || ''), 
                            fontSize: 18, 
                            fontWeight: 'bold' 
                        }}>
                            {getStatusText(agendamentoState?.status || '')}
                        </Text>
                    </View>
                </View>
            </View>

            {agendamentoState?.status === "esperando_confirmacao" && (
                <View style={{ padding: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity 
                            onPress={handleConfirmarFinalizacao}
                            style={{
                                backgroundColor: '#00C20A',
                                padding: 10,
                                borderRadius: 5,
                                width: '45%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmar Finalização</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleRecusarFinalizacao}
                            style={{
                                backgroundColor: '#B10000',
                                padding: 10,
                                borderRadius: 5,
                                width: '45%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Recusar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default DetalhesAgendamentoStatusChangeScreen; 