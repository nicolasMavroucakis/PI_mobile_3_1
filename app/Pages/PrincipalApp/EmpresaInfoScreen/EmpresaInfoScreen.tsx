import HomeNavBar from "@/components/HomeNavBar";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";
import ImgComp from "../../../../assets/images/compartilhar.png";
import ImgCoracaoVermelho from "../../../../assets/images/coracaoVermelho.png"; // talvez não vai precisar
import EmpresaInfoScreenStyle from "./EmpresaInfoScreenStyle";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useState } from "react";
import EmpresaServicos from "@/components/EmpresaInfoComponents/EmpresaServicos";
import EmpresaCartaoPresente from "@/components/EmpresaInfoComponents/EmpresaCartaoPresente";
import EmpresaDetalhes from "@/components/EmpresaInfoComponents/EmpresaDetalhes";

const EmpresaInfoScreen = () => {
    const [favoritado, setFavoritado] = useState(false); // Corrigido aqui
    const [servico, setServico] = useState(true)
    const [avaliacao, setAvaliacao] = useState(false)
    const [cartaoPresente, setCartaoPresente] = useState(false)
    const [detalhes, setDetalhes] = useState(false)

    const toggleFavorito = () => {
        setFavoritado(!favoritado);
    };

    const handleTrocaTipoPagina = (tipo: any) => {
        if (tipo == 'servico') {
            setServico(true)
            setAvaliacao(false)
            setCartaoPresente(false)
            setDetalhes(false)
        } else if (tipo == 'avaliacao') {
            setServico(false)
            setAvaliacao(true)
            setCartaoPresente(false)
            setDetalhes(false)
        } else if ( tipo == 'cartPresente') {
            setServico(false)
            setAvaliacao(false)
            setCartaoPresente(true)
            setDetalhes(false)
        } else {
            setServico(false)
            setAvaliacao(false)
            setCartaoPresente(false)
            setDetalhes(true)
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: "#323232" }}>
            <ScrollView>
                <View style={{ position: 'relative' }}>
                    <Image
                        source={ImgExemplo}
                        style={EmpresaInfoScreenStyle.principalImage}
                        resizeMode="cover"
                    />
                    <View style={EmpresaInfoScreenStyle.containerAvaliacao}>
                        <Text style={EmpresaInfoScreenStyle.avaliacaoNota}>
                            4.9
                        </Text>
                        <Text style={EmpresaInfoScreenStyle.avaliacaoTexto}>
                            56 Avaliações
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={EmpresaInfoScreenStyle.containerFavoritoCompText}>
                        <View>
                            <Text style={EmpresaInfoScreenStyle.empresa}>
                                Mecanico do seu Zé
                            </Text>
                            <Text style={EmpresaInfoScreenStyle.empresaMenor}>
                                Rua das Bananas, 107, São Paulo
                            </Text>
                        </View>
                        <View style={EmpresaInfoScreenStyle.containerFavoritoComp}>
                            <TouchableOpacity>
                                <Image source={ImgComp} style={EmpresaInfoScreenStyle.imgComp}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleFavorito}>
                                <AntDesign 
                                    name={favoritado ? "heart" : "hearto"} 
                                    size={30} 
                                    color={favoritado ? "red" : "#fff"} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={EmpresaInfoScreenStyle.tipoPagEmpresa}>
                        <TouchableOpacity style={servico == true ? [EmpresaInfoScreenStyle.tipoPagEmpresaButton, EmpresaInfoScreenStyle.buttonPagSelecionada] : EmpresaInfoScreenStyle.tipoPagEmpresaButton} onPress={() => handleTrocaTipoPagina('servico')}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Serviços
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={avaliacao == true ? [EmpresaInfoScreenStyle.tipoPagEmpresaButton, EmpresaInfoScreenStyle.buttonPagSelecionada] : EmpresaInfoScreenStyle.tipoPagEmpresaButton} onPress={() => handleTrocaTipoPagina('avaliacao')}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Avaliação
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={cartaoPresente == true ? [EmpresaInfoScreenStyle.tipoPagEmpresaButton, EmpresaInfoScreenStyle.buttonPagSelecionada] : EmpresaInfoScreenStyle.tipoPagEmpresaButton} onPress={() => handleTrocaTipoPagina('cartPresente')}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Cart. Pres
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={detalhes == true ? [EmpresaInfoScreenStyle.tipoPagEmpresaButton, EmpresaInfoScreenStyle.buttonPagSelecionada] : EmpresaInfoScreenStyle.tipoPagEmpresaButton} onPress={() => handleTrocaTipoPagina('Detalhes')}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Detalhes
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {servico === true && <EmpresaServicos />}
                    {cartaoPresente === true && <EmpresaCartaoPresente />}
                    {detalhes === true && <EmpresaDetalhes/>}
                </View>
            </ScrollView>
            <HomeNavBar/>
        </View>
    );
};

export default EmpresaInfoScreen;