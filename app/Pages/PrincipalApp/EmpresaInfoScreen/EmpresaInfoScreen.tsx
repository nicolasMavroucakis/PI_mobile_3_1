import HomeNavBar from "@/components/HomeNavBar";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";
import ImgComp from "../../../../assets/images/compartilhar.png";
import ImgCoracaoVermelho from "../../../../assets/images/coracaoVermelho.png"; // talvez não vai precisar
import EmpresaInfoScreenStyle from "./EmpresaInfoScreenStyle";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useState } from "react";
import EmpresaServicos from "@/components/EmpresaInfoComponents/EmpresaServicos";

const EmpresaInfoScreen = () => {
    const [favoritado, setFavoritado] = useState(false); // Corrigido aqui

    const toggleFavorito = () => {
        setFavoritado(!favoritado);
    };

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
                        <TouchableOpacity style={EmpresaInfoScreenStyle.tipoPagEmpresaButton}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Serviços
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={EmpresaInfoScreenStyle.tipoPagEmpresaButton}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Avaliação
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={EmpresaInfoScreenStyle.tipoPagEmpresaButton}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Cart. Pres
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={EmpresaInfoScreenStyle.tipoPagEmpresaButton}>
                            <Text style={EmpresaInfoScreenStyle.textPag}>
                                Detalhes
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <EmpresaServicos/>
                </View>
            </ScrollView>
            <HomeNavBar/>
        </View>
    );
};

export default EmpresaInfoScreen;