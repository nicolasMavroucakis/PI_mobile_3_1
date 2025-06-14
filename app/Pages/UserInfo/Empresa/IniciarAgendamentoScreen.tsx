import { View, ScrollView, Image, Text, TouchableOpacity, Alert } from "react-native";
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
import MapView, { Marker } from 'react-native-maps';

type RouteParams = {
    IniciarAgendamento: {
        agendamento: {
            id: string;
            clienteId: string;
            data: any;
            servico: {
                id: string;
                nome: string;
                tipoAtendimento?: string;
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
    endereco?: string;
    latitude?: number;
    longitude?: number;
}

interface ServicoEmpresa {
    id: string;
    nome: string;
    tipoAtendimento?: string;
    // outros campos se necessário
}

// Adicionar função de geocodificação
const geocodeAddress = async (endereco: any): Promise<{ latitude: number; longitude: number } | null> => {
    try {
        if (!endereco) {
            console.log('Endereço vazio, não é possível geocodificar');
            return null;
        }
        
        // Formatar o endereço para a API
        let enderecoFormatado = '';
        if (typeof endereco === 'object') {
            enderecoFormatado = `${endereco.rua}, ${endereco.numero}, ${endereco.cidade}, ${endereco.cep}`.trim();
            console.log('Endereço formatado para geocodificação:', enderecoFormatado);
        } else {
            enderecoFormatado = endereco.trim();
        }
            
        const apiKey = 'AIzaSyCOjn1dwkLjCeHQcdjj26IoY-rWQYjqo3M';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enderecoFormatado)}&key=${apiKey}`;
        
        console.log('Iniciando geocodificação para:', enderecoFormatado);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Resposta da API de geocodificação:', data.status);
        
        if (data.status === 'OK' && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            console.log('Coordenadas obtidas:', { lat, lng });
            return { latitude: lat, longitude: lng };
        } else {
            console.log('Erro na geocodificação:', data.status, data.error_message);
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao geocodificar endereço:', error);
        return null;
    }
};

const IniciarAgendamentoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteParams, 'IniciarAgendamento'>>();
    const [agendamentoState, setAgendamentoState] = useState(route.params?.agendamento);
    const [clienteData, setClienteData] = useState<ClienteData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { db } = StartFirebase();
    const [tipoAtendimentoServico, setTipoAtendimentoServico] = useState<string | undefined>(undefined);

    useEffect(() => {
        const buscarDadosCliente = async () => {
            if (!agendamentoState?.clienteId) return;

            try {
                console.log('Buscando dados do cliente:', agendamentoState.clienteId);
                const clienteDoc = await getDoc(doc(collection(db, "users"), agendamentoState.clienteId));
                
                if (clienteDoc.exists()) {
                    const dados = clienteDoc.data();
                    console.log('Dados do cliente encontrados:', dados);
                    let coordenadas = null;
                    
                    // Se não tiver coordenadas, tenta geocodificar o endereço
                    if (!dados.latitude || !dados.longitude) {
                        console.log('Coordenadas não encontradas, iniciando geocodificação');
                        coordenadas = await geocodeAddress(dados.endereco);
                        console.log('Resultado da geocodificação:', coordenadas);
                    }
                    
                    const clienteDataAtualizado = {
                        nome: dados.nome || 'Nome não disponível',
                        fotoPerfil: dados.fotoPerfil || '',
                        endereco: dados.endereco || '',
                        latitude: dados.latitude || coordenadas?.latitude,
                        longitude: dados.longitude || coordenadas?.longitude
                    };
                    
                    console.log('Dados do cliente atualizados:', clienteDataAtualizado);
                    setClienteData(clienteDataAtualizado);
                    
                    // Se conseguiu geocodificar e não tinha coordenadas salvas, atualiza no banco
                    if (coordenadas && (!dados.latitude || !dados.longitude)) {
                        console.log('Salvando coordenadas no banco:', coordenadas);
                        const userRef = doc(collection(db, "users"), agendamentoState.clienteId);
                        await updateDoc(userRef, {
                            latitude: coordenadas.latitude,
                            longitude: coordenadas.longitude
                        });
                        console.log('Coordenadas salvas com sucesso');
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do cliente:", error);
            }
        };

        const buscarTipoAtendimentoServico = async () => {
            if (!agendamentoState?.empresaId || !agendamentoState?.servico) return;
            try {
                const empresaDoc = await getDoc(doc(collection(db, "empresas"), agendamentoState.empresaId));
                if (empresaDoc.exists()) {
                    const empresaData = empresaDoc.data();
                    const servicos: ServicoEmpresa[] = empresaData.servicos || [];
                    console.log('empresaData.servicos:', servicos);
                    let servico: ServicoEmpresa | undefined = undefined;
                    if (agendamentoState.servico.id) {
                        console.log('agendamentoState.servico.id:', agendamentoState.servico.id);
                        servico = servicos.find(s => s.id === agendamentoState.servico.id);
                    }
                    if (!servico) {
                        // Busca por nome se não houver id
                        const nomeAgendamento = agendamentoState.servico.nome.trim().toLowerCase();
                        servico = servicos.find(s => s.nome && s.nome.trim().toLowerCase() === nomeAgendamento);
                        console.log('Busca por nome:', nomeAgendamento, 'servico encontrado:', servico);
                    } else {
                        console.log('servico encontrado:', servico);
                    }
                    setTipoAtendimentoServico(servico?.tipoAtendimento);
                }
            } catch (error) {
                console.error("Erro ao buscar tipoAtendimento do serviço:", error);
            }
        };

        buscarDadosCliente();
        buscarTipoAtendimentoServico();
    }, [agendamentoState?.clienteId, agendamentoState?.empresaId, agendamentoState?.servico]);

    const formatarData = (data: any) => {
        if (!data) return '';
        const dataObj = data.toDate();
        return format(dataObj, "dd/MM/yyyy", { locale: ptBR });
    };

    const atualizarStatusAgendamento = async () => {
        if (!agendamentoState?.id || isLoading || agendamentoState.status !== "agendado") return;

        setIsLoading(true);
        try {
            console.log("Iniciando agendamento:", {
                agendamentoId: agendamentoState.id,
                statusAtual: agendamentoState.status
            });

            const agendamentoRef = doc(collection(db, "agendamentos"), agendamentoState.id);
            await updateDoc(agendamentoRef, {
                status: "em_andamento"
            });

            console.log("Agendamento iniciado com sucesso");

            setAgendamentoState(prev => ({
                ...prev!,
                status: "em_andamento"
            }));

            setTimeout(() => {
                navigation.goBack();
            }, 500);

        } catch (error) {
            console.error("Erro ao iniciar agendamento:", error);
            Alert.alert(
                "Erro",
                "Não foi possível iniciar o agendamento. Tente novamente."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonStyle = () => {
        return {
            backgroundColor: '#00C20A',
            width: '94%' as any,
            padding: 15,
            borderRadius: 8,
            alignSelf: 'center' as const,
            marginTop: 30,
            marginBottom: 20,
            opacity: isLoading ? 0.7 : 1
        };
    };

    const getButtonText = () => {
        if (isLoading) return "Iniciando...";
        return "Iniciar Agendamento";
    };

    const shouldShowButton = agendamentoState?.status === "agendado";

    // Componente para exibir o mapa do cliente
    const MapaCliente: React.FC<{ nome: string; latitude?: number | string; longitude?: number | string; endereco?: any }> = ({ nome, latitude, longitude, endereco }) => {
        // Converte para número se vier como string
        const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
        const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
        const coordenadasValidas = lat && lng && !isNaN(lat) && !isNaN(lng);
        // Formata endereço se vier como objeto
        let enderecoFormatado = '';
        if (endereco && typeof endereco === 'object') {
            enderecoFormatado = `${endereco.rua || ''}${endereco.numero ? ', ' + endereco.numero : ''}${endereco.complemento ? ' - ' + endereco.complemento : ''}${endereco.cidade ? ' - ' + endereco.cidade : ''}${endereco.cep ? ' - CEP: ' + endereco.cep : ''}`.replace(/^[,\s-]+|[,\s-]+$/g, '');
        } else if (typeof endereco === 'string') {
            enderecoFormatado = endereco;
        }
        return (
            <View style={{  marginTop: 10, marginBottom: 20, marginRight: 20 }}>
                <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>Localização do Cliente:</Text>
                {coordenadasValidas ? (
                    <MapView
                        style={{ width: '100%', height: 180, borderRadius: 10, marginTop: 10 }}
                        initialRegion={{
                            latitude: lat!,
                            longitude: lng!,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker
                            coordinate={{ latitude: lat!, longitude: lng! }}
                            title={nome}
                        />
                    </MapView>
                ) : (
                    <View style={{ backgroundColor: '#222', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
                        <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>
                            Endereço não possui localização cadastrada para o mapa.
                        </Text>
                    </View>
                )}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginBottom: 2 }}>Endereço:</Text>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{enderecoFormatado && enderecoFormatado.trim() ? enderecoFormatado : 'Não informado'}</Text>
                </View>
            </View>
        );
    };

    // LOGS DE DEPURAÇÃO
    console.log('servico:', agendamentoState?.servico);
    console.log('clienteData:', clienteData);
    console.log('tipoAtendimentoServico:', tipoAtendimentoServico);

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
                    Iniciar Agendamento
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
                    Detalhes do Agendamento
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
                        Horário:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                        {`${agendamentoState?.horaInicio || '--:--'} - ${agendamentoState?.horaFim || '--:--'}`}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginRight: 8 }}>
                        Status:
                    </Text>
                    <Text style={{ 
                        color: agendamentoState?.status === "agendado" ? '#00C20A' : '#717171', 
                        fontSize: 18, 
                        fontWeight: 'bold' 
                    }}>
                        {agendamentoState?.status === "agendado" ? "Aguardando Início" : agendamentoState?.status || 'Não definido'}
                    </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ color: '#717171', fontSize: 16, marginBottom: 2 }}>
                        Tipo de Atendimento:
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                        {tipoAtendimentoServico && tipoAtendimentoServico.trim().toLowerCase() === 'residencia'
                            ? 'Atendimento a Residência'
                            : 'Atendimento no Estabelecimento'}
                    </Text>
                </View>
                {/* Exibe endereço e mapa se for residência */}
                {tipoAtendimentoServico && tipoAtendimentoServico.trim().toLowerCase() === 'residencia' && clienteData && (
                    <MapaCliente 
                        nome={clienteData.nome}
                        latitude={clienteData.latitude}
                        longitude={clienteData.longitude}
                        endereco={clienteData.endereco}
                    />
                )}
                {/* Se não for residência, mas tem endereço, mostra o endereço */}
                {tipoAtendimentoServico && tipoAtendimentoServico.trim().toLowerCase() !== 'residencia' && clienteData?.endereco && clienteData.endereco.trim() && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: '#717171', fontSize: 16, marginBottom: 2 }}>Endereço:</Text>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{clienteData.endereco}</Text>
                    </View>
                )}
            </View>
            {shouldShowButton && (
                <TouchableOpacity 
                    style={getButtonStyle()}
                    onPress={atualizarStatusAgendamento}
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