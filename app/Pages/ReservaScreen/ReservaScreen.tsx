import { AntDesign } from "@expo/vector-icons";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import ReservaScreenStyle from "./ReservascreenStyle";
import CalendarioImg from '../../../assets/images/Calendario.png'
import RelogioImg from '../../../assets/images/relogio.png'
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAgendamentoServicos } from "@/app/GlobalContext/AgendamentoServicosGlobalContext";
import { collection, query, where, getDocs, Timestamp, doc, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";

const { db } = StartFirebase();

interface Funcionario {
    id: string;
    nome: string;
    fotoPerfil: string;
    especialidade?: string;
}

const ReservaScreen = () => {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const empresa = useEmpresaContext();
    const { 
        dataAgendamento,
        definirData,
        funcionarioSelecionado,
        selecionarFuncionario,
        calcularValorTotal,
        calcularTempoTotal
    } = useAgendamentoServicos();

    const carregarFuncionarios = async () => {
        console.log("IDs dos funcionários recebidos:", empresa.funcionarios);
        if (!empresa.funcionarios?.length) return;
        try {
            // Buscar os detalhes de cada funcionário
            const funcionariosPromises = empresa.funcionarios.map(async (funcionarioId) => {
                try {
                    console.log("Buscando funcionário com ID:", funcionarioId);
                    const funcionarioDoc = await getDoc(doc(db, "users", funcionarioId));
                    if (funcionarioDoc.exists()) {
                        const funcionarioData = funcionarioDoc.data();
                        console.log("Dados do funcionário encontrado:", funcionarioData);
                        return {
                            id: funcionarioId,
                            nome: funcionarioData.nome || "Nome não disponível",
                            fotoPerfil: funcionarioData.fotoPerfil || "",
                            especialidade: funcionarioData.especialidade
                        };
                    }
                    console.log("Funcionário não encontrado para o ID:", funcionarioId);
                    return null;
                } catch (error) {
                    console.error(`Erro ao buscar funcionário ${funcionarioId}:`, error);
                    return null;
                }
            });

            const funcionariosDetalhados = await Promise.all(funcionariosPromises);
            setFuncionarios(funcionariosDetalhados.filter((f): f is NonNullable<typeof f> => f !== null) as Funcionario[]);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar a lista de funcionários."
            );
        }
    };

    useEffect(() => {
        carregarFuncionarios();
    }, [empresa.funcionarios]);

    const verificarDisponibilidade = async (data: Date, funcionarioId: string | null) => {
        try {
            const inicioDia = new Date(data);
            inicioDia.setHours(0, 0, 0, 0);
            const timestampInicio = Timestamp.fromDate(inicioDia);

            const fimDia = new Date(data);
            fimDia.setHours(23, 59, 59, 999);
            const timestampFim = Timestamp.fromDate(fimDia);

            let q = query(
                collection(db, "agendamentos"),
                where("data", ">=", timestampInicio),
                where("data", "<=", timestampFim)
            );

            if (funcionarioId) {
                q = query(
                    collection(db, "agendamentos"),
                    where("data", ">=", timestampInicio),
                    where("data", "<=", timestampFim),
                    where("funcionarioId", "==", funcionarioId)
                );
            }

            const querySnapshot = await getDocs(q);
            const agendamentosNoDia = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (agendamentosNoDia.length > 0) {
                const dataFormatada = format(data, 'dd/MM/yyyy');
                if (funcionarioId) {
                    Alert.alert(
                        "Atenção",
                        `O funcionário selecionado já possui ${agendamentosNoDia.length} agendamento(s) para o dia ${dataFormatada}. Verifique outros horários disponíveis.`
                    );
                } else {
                    Alert.alert(
                        "Informação",
                        `Existem ${agendamentosNoDia.length} agendamento(s) para o dia ${dataFormatada}.`
                    );
                }
            }

            return agendamentosNoDia;
        } catch (error) {
            console.error("Erro ao verificar disponibilidade:", error);
            Alert.alert(
                "Erro",
                "Não foi possível verificar a disponibilidade. Tente novamente."
            );
            return [];
        }
    };

    const onChange = async (event: any, selectedDate: any) => {
        if (selectedDate) {
            definirData(selectedDate);
            await verificarDisponibilidade(
                selectedDate,
                funcionarioSelecionado?.id || null
            );
        }
    };

    const handleSelecionarFuncionario = async (funcionario: any) => {
        selecionarFuncionario(funcionario);
        if (dataAgendamento) {
            await verificarDisponibilidade(
                dataAgendamento,
                funcionario?.id || null
            );
        }
    };

    const valorTotal = calcularValorTotal();
    const tempoTotal = calcularTempoTotal();
    const tempoFormatado = tempoTotal.horas > 0 
        ? `${tempoTotal.horas}h${tempoTotal.minutos > 0 ? ` ${tempoTotal.minutos}min` : ''}`
        : `${tempoTotal.minutos}min`;

    return (
        <View style={{flex:1, backgroundColor: '#717171'}}>
            <ScrollView>
                <View style={ReservaScreenStyle.containerTituloPagina}>
                    <View>
                        <TouchableOpacity>
                            <AntDesign 
                                name={"left"} 
                                size={30} 
                                color={"#00C20A"} 
                                style={{ marginLeft: 10 }}         
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{fontSize: 25, fontWeight: 'bold', color: '#00C20A'}}>
                            {empresa.nome} - Reserva
                        </Text>
                    </View>
                </View>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                    <View>
                        <Text style={[ReservaScreenStyle.textDataeHora, ReservaScreenStyle.textDataeHoraEsquerda]}>
                            Data
                        </Text>
                        <View style={ReservaScreenStyle.containerSelecionaDataEHoraEsquerda}>
                            <View>
                                <Image source={CalendarioImg} style={{width: 40, height: 40}}/>
                            </View>
                            <DateTimePicker
                                value={dataAgendamento || new Date()}
                                mode="date"
                                display="default"
                                onChange={onChange}
                                textColor="red"
                                style={{zIndex: 1000}}
                                minimumDate={new Date()}
                            />
                            <View style={{ backgroundColor: 'white', width: 110, height: 30, position: 'relative', top: 0, borderRadius:4, left: -113}} />
                        </View>
                    </View>
                    <View>
                        <Text style={[ReservaScreenStyle.textDataeHora, ReservaScreenStyle.textDataeHoraDireita]}>
                            Horario
                        </Text>
                        <View style={ReservaScreenStyle.containerSelecionaDataEHoraDireita}>
                            <View>
                                <Image source={RelogioImg} style={{width: 40, height: 40}}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20, marginLeft: 20}}>Profissional</Text>
                </View>
                <ScrollView 
                    style={ReservaScreenStyle.ScrollViewFuncionarios} 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <View style={ReservaScreenStyle.containerFuncionarios}>
                        <TouchableOpacity 
                            style={[
                                ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto,
                                !funcionarioSelecionado && ReservaScreenStyle.funcionarioSelecionado
                            ]}
                            onPress={() => handleSelecionarFuncionario(null)}
                        >
                            <Image source={require('../../../assets/images/user.jpeg')} style={{width: 50, height: 50, borderRadius: 50}}/>
                            <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                Sem Preferencia
                            </Text>
                        </TouchableOpacity>
                        <View style={ReservaScreenStyle.linha}/>
                        {funcionarios.map((funcionario) => (
                            <TouchableOpacity 
                                key={funcionario.id}
                                style={[
                                    ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto,
                                    funcionarioSelecionado?.id === funcionario.id && ReservaScreenStyle.funcionarioSelecionado
                                ]}
                                onPress={() => handleSelecionarFuncionario(funcionario)}
                            >
                                <Image 
                                    source={
                                        funcionario.fotoPerfil 
                                            ? { uri: funcionario.fotoPerfil } 
                                            : require('../../../assets/images/user.jpeg')
                                    } 
                                    style={{width: 50, height: 50, borderRadius: 50}}
                                />
                                <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                    {funcionario.nome}
                                </Text>
                                {funcionario.especialidade && (
                                    <Text style={{fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center'}}>
                                        {funcionario.especialidade}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </ScrollView>
            <View style={ReservaScreenStyle.containerReservaValoresTempo}>
                <View>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
                        R$ {valorTotal.toFixed(2)}
                    </Text>
                    <Text style={{fontSize: 15, color: 'rgba(255, 255, 255, 0.6)'}}>
                        {tempoFormatado}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity style={ReservaScreenStyle.TocuhbleContinuar}>
                        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                            Continuar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ReservaScreen;