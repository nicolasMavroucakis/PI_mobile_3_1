import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native"
import { AntDesign, Ionicons } from '@expo/vector-icons'; // <- Ícone certo para React Native
import HomeScreenStyle from "./HomeScreenStyle";
import AulasImg from "../../../../assets/images/aulas.png"
import EletricistaImg from "../../../../assets/images/eletricista.png"
import CabelereiroImg from "../../../../assets/images/cabelereiro.png"
import DiaristaImg from "../../../../assets/images/diarista.png"
import TecImg from "../../../../assets/images/TecTI.png"
import MassagemImg from "../../../../assets/images/massagem.png"
import EncanadorImg from "../../../../assets/images/encanador.png"
import MecanicoImg from "../../../../assets/images/mecanico.png"
import ClockImg from "../../../../assets/images/clock.png"
import Location from "../../../../assets/images/location.png"
import ImgExemplo from "../../../../assets/images/imageExemplo.png"
import DescontoImg from "../../../../assets/images/descontoImg.png"
import HomeNavBar from "@/components/HomeNavBar";

const HomeScreen = () => {
    return(
        <ScrollView contentContainerStyle={HomeScreenStyle.container}>
            <View style={HomeScreenStyle.topNav}>
                <View style={[HomeScreenStyle.itensTop, {alignItems: 'flex-start'}]}>
                    <Text style={[HomeScreenStyle.text, {fontSize: 15, marginLeft: 10}]}>Ola Nicolas</Text>
                </View>
                <View style={[HomeScreenStyle.itensTop, {alignItems: 'center'}]}>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={[HomeScreenStyle.text]}>R. Santo Egídio, 137</Text>
                        <AntDesign name="down" size={20} color="white" style={{marginLeft: 5, fontWeight: 'bold'}} />
                    </TouchableOpacity>
                </View>
                <View style={[HomeScreenStyle.itensTop, {alignItems: 'flex-end', paddingRight: 10}]}>
                    <TouchableOpacity style={{marginRight: 10}}>
                        <Ionicons name="notifications" size={20} color="white" style={{marginLeft: 5, fontWeight: 'bold'}} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={HomeScreenStyle.topPageCategorias}>
                <View style={HomeScreenStyle.topPageCategoriasContainer}>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={AulasImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Aulas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={EletricistaImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Eletricista
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={CabelereiroImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Cabelereiro
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={DiaristaImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Diarista
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={HomeScreenStyle.topPageCategoriasContainer}>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={TecImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Tec.Ti
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={EncanadorImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Encanador
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={MassagemImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Massagem
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton}>
                        <Image source={MecanicoImg} />
                        <Text style={[HomeScreenStyle.text, {fontSize: 12}]}>
                            Mecanico
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginLeft: 10}}>
                    Meus Agendamentos
                </Text>
                <ScrollView style={HomeScreenStyle.containerMeusAgendamentos}>
                    <TouchableOpacity style={HomeScreenStyle.MeusAgendamentosInput}>
                        <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-start'}]}>
                                <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#B10000'}}>
                                    Qua
                                </Text>
                                <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#B10000'}}>
                                    19
                                </Text>
                            </View>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'center'}]}>
                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                    <Image source={ClockImg}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                        10:00 - 12:00
                                    </Text>
                                </View>
                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                    <Image source={Location}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                        Atendimento a Residencia
                                    </Text>
                                </View>
                            </View>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-end'}]}>
                                <Text style={{fontWeight: 'bold', fontSize: 15, paddingRight: 10}}>
                                    Encanador
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.MeusAgendamentosInput}>
                        <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-start'}]}>
                                <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 10}}>
                                    Qua
                                </Text>
                                <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 20}}>
                                    19
                                </Text>
                            </View>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'center'}]}>
                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                    <Image source={ClockImg}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                        10:00 - 12:00
                                    </Text>
                                </View>
                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                    <Image source={Location}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                        Atendimento a Residencia
                                    </Text>
                                </View>
                            </View>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-end'}]}>
                                <Text style={{fontWeight: 'bold', fontSize: 15, paddingRight: 10}}>
                                    Encanador
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.MeusAgendamentosInput}>
                        <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-start'}]}>
                                <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 10}}>
                                    Qua
                                </Text>
                                <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 20}}>
                                    19
                                </Text>
                            </View>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'center'}]}>
                                <View style={[HomeScreenStyle.containersDentroAgendamentoLocHora]}>
                                    <Image source={ClockImg}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                        10:00 - 12:00
                                    </Text>
                                </View>
                                <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                    <Image source={Location}/>
                                    <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                        Atendimento a Residencia
                                    </Text>
                                </View>
                            </View>
                            <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-end'}]}>
                                <Text style={{fontWeight: 'bold', fontSize: 15, paddingRight: 10}}>
                                    Encanador
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 20, marginLeft: 10}}>
                    Ultimos Serviços
                </Text>
                <ScrollView style={HomeScreenStyle.containerUltimosServicos} horizontal={true}>
                    <TouchableOpacity style={HomeScreenStyle.containerUltimosServicosDentro}>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Image source={ImgExemplo} style={HomeScreenStyle.ImgUltServi}/>
                        </View>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#fff'}}>
                                Mecanico
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerUltimosServicosDentro}>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Image source={ImgExemplo} style={HomeScreenStyle.ImgUltServi}/>
                        </View>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#fff'}}>
                                Mecanico
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerUltimosServicosDentro}>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Image source={ImgExemplo} style={HomeScreenStyle.ImgUltServi}/>
                        </View>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#fff'}}>
                                Mecanico
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerUltimosServicosDentro}>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Image source={ImgExemplo} style={HomeScreenStyle.ImgUltServi}/>
                        </View>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#fff'}}>
                                Mecanico
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerUltimosServicosDentro}>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Image source={ImgExemplo} style={HomeScreenStyle.ImgUltServi}/>
                        </View>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#fff'}}>
                                Mecanico
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerUltimosServicosDentro}>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Image source={ImgExemplo} style={HomeScreenStyle.ImgUltServi}/>
                        </View>
                        <View style={HomeScreenStyle.ImgUltServiView}>
                            <Text style={{fontSize: 13, fontWeight: 'bold', color: '#fff'}}>
                                Mecanico
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <View>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 20, marginLeft: 10}}>
                    Descontos
                </Text>
                <View style={HomeScreenStyle.containerDesconto}>
                    <TouchableOpacity style={HomeScreenStyle.containerDescontoDentro}>
                        <Image
                            source={ImgExemplo}
                            style={HomeScreenStyle.containerDescontoDentroImg}
                            resizeMode="cover"
                        />
                        <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 10, marginLeft: 0}}>
                            Mecanico do seu Zé
                        </Text>
                        <Text  style={{color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 1, marginLeft: 0}}>
                            Rua das bananeiras 320, São Paulo, São Paulo
                        </Text>
                        <View style={HomeScreenStyle.descontoContainer}>
                            <Image source={DescontoImg}/>
                            <Text>
                                Economia de até 10%
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerDescontoDentro}>
                        <Image
                            source={ImgExemplo}
                            style={HomeScreenStyle.containerDescontoDentroImg}
                            resizeMode="cover"
                        />
                        <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 10, marginLeft: 0}}>
                            Mecanico do seu Zé
                        </Text>
                        <Text  style={{color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 1, marginLeft: 0}}>
                            Rua das bananeiras 320, São Paulo, São Paulo
                        </Text>
                        <View style={HomeScreenStyle.descontoContainer}>
                            <Image source={DescontoImg}/>
                            <Text>
                                Economia de até 10%
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerDescontoDentro}>
                        <Image
                            source={ImgExemplo}
                            style={HomeScreenStyle.containerDescontoDentroImg}
                            resizeMode="cover"
                        />
                        <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 10, marginLeft: 0}}>
                            Mecanico do seu Zé
                        </Text>
                        <Text  style={{color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 1, marginLeft: 0}}>
                            Rua das bananeiras 320, São Paulo, São Paulo
                        </Text>
                        <View style={HomeScreenStyle.descontoContainer}>
                            <Image source={DescontoImg}/>
                            <Text>
                                Economia de até 10%
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={HomeScreenStyle.containerDescontoDentro}>
                        <Image
                            source={ImgExemplo}
                            style={HomeScreenStyle.containerDescontoDentroImg}
                            resizeMode="cover"
                        />
                        <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 10, marginLeft: 0}}>
                            Mecanico do seu Zé
                        </Text>
                        <Text  style={{color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 1, marginLeft: 0}}>
                            Rua das bananeiras 320, São Paulo, São Paulo
                        </Text>
                        <View style={HomeScreenStyle.descontoContainer}>
                            <Image source={DescontoImg}/>
                            <Text>
                                Economia de até 10%
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <HomeNavBar/>
        </ScrollView>
    )
}

export default HomeScreen;