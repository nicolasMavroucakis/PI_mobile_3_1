import { AntDesign } from "@expo/vector-icons";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import ReservaScreenStyle from "./ReservascreenStyle";
import CalendarioImg from '../../../assets/images/Calendario.png'
import RelogioImg from '../../../assets/images/relogio.png'
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAgendamentoServicos } from "@/app/GlobalContext/AgendamentoServicosGlobalContext";

const ReservaScreen = () => {
    const { 
        dataAgendamento,
        definirData,
        funcionarioSelecionado,
        selecionarFuncionario,
        calcularValorTotal,
        calcularTempoTotal
    } = useAgendamentoServicos();

    const onChange = (event: any, selectedDate: any) => {
        if (selectedDate) {
            definirData(selectedDate);
        }
    };

    const handleSelecionarFuncionario = (funcionario: any) => {
        selecionarFuncionario(funcionario);
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
                            Fazer uma Reserva
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
                            style={ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto}
                            onPress={() => handleSelecionarFuncionario(null)}
                        >
                            <Image source={require('../../../assets/images/user.jpeg')} style={{width: 50, height: 50, borderRadius: 50}}/>
                            <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                Sem Preferencia
                            </Text>
                        </TouchableOpacity>
                        <View style={ReservaScreenStyle.linha}/>
                        <TouchableOpacity 
                            style={ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto}
                            onPress={() => handleSelecionarFuncionario({
                                id: '1',
                                nome: 'Zeca',
                                foto: '../../../assets/images/user.jpeg'
                            })}
                        >
                            <Image source={require('../../../assets/images/user.jpeg')} style={{width: 50, height: 50, borderRadius: 50}}/>
                            <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                Zeca
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto}
                            onPress={() => handleSelecionarFuncionario({
                                id: '2',
                                nome: 'Jose',
                                foto: '../../../assets/images/user.jpeg'
                            })}
                        >
                            <Image source={require('../../../assets/images/user.jpeg')} style={{width: 50, height: 50, borderRadius: 50}}/>
                            <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                Jose
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={ReservaScreenStyle.containerSelecionarFuncionarioImagemTexto}
                            onPress={() => handleSelecionarFuncionario({
                                id: '3',
                                nome: 'Pricles',
                                foto: '../../../assets/images/user.jpeg'
                            })}
                        >
                            <Image source={require('../../../assets/images/user.jpeg')} style={{width: 50, height: 50, borderRadius: 50}}/>
                            <Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>
                                Pricles
                            </Text>
                        </TouchableOpacity>
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