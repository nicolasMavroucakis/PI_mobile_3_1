import EmpresaInfoScreenStyle from "@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle"
import { View, Text, Image} from "react-native"
import imageExp from "../../assets/images/imageExemplo.png"

const EmpresaCartaoPresente = () => {
    return(
        <View style={[EmpresaInfoScreenStyle.styleContainerServico,{paddingLeft: 0}]}>
            <View style={[EmpresaInfoScreenStyle.containerCartaoPresente,{backgroundColor: '#A44F00', padding: 5}]}>
                <View style={EmpresaInfoScreenStyle.boxPrecoCartaoPresente}>
                    <Text style={[EmpresaInfoScreenStyle.textoMenorCartaoPresente]}>
                        Cartão Presente
                    </Text>
                    <View style={EmpresaInfoScreenStyle.boxPreco}>
                        <Text style={EmpresaInfoScreenStyle.textoMenorCartaoPresente}>
                            Valor
                        </Text>
                        <Text style={EmpresaInfoScreenStyle.textoDinheiroCartaoPresente}>
                            R$ 130,00
                        </Text>
                    </View>
                </View>
                <View style={EmpresaInfoScreenStyle.boxServicoCartaoPresente}>
                    <Text style={EmpresaInfoScreenStyle.textValePresente}>
                        Vale Presente
                    </Text>
                    <Text style={EmpresaInfoScreenStyle.textServicoValePresente}> 
                        Todos os serviços
                    </Text>
                </View>
                <View style={EmpresaInfoScreenStyle.containerCartaoPresenteImagem}>
                    <Image source={imageExp} style={EmpresaInfoScreenStyle.containerCartaoPresenteImg}/>
                    <Text style={EmpresaInfoScreenStyle.textoMenorCartaoPresente}>
                        Mecanico do seu Zé
                    </Text>
                </View>
            </View>
            <View style={[EmpresaInfoScreenStyle.containerCartaoPresente,{backgroundColor: '#A44F00', padding: 5}]}>
                <View style={EmpresaInfoScreenStyle.boxPrecoCartaoPresente}>
                    <Text style={[EmpresaInfoScreenStyle.textoMenorCartaoPresente]}>
                        Cartão Presente
                    </Text>
                    <View style={EmpresaInfoScreenStyle.boxPreco}>
                        <Text style={EmpresaInfoScreenStyle.textoMenorCartaoPresente}>
                            Valor
                        </Text>
                        <Text style={EmpresaInfoScreenStyle.textoDinheiroCartaoPresente}>
                            R$ 130,00
                        </Text>
                    </View>
                </View>
                <View style={EmpresaInfoScreenStyle.boxServicoCartaoPresente}>
                    <Text style={EmpresaInfoScreenStyle.textValePresente}>
                        Vale Presente
                    </Text>
                    <Text style={EmpresaInfoScreenStyle.textServicoValePresente}> 
                        Todos os serviços
                    </Text>
                </View>
                <View style={EmpresaInfoScreenStyle.containerCartaoPresenteImagem}>
                    <Image source={imageExp} style={EmpresaInfoScreenStyle.containerCartaoPresenteImg}/>
                </View>
            </View>
            <View style={[EmpresaInfoScreenStyle.containerCartaoPresente,{backgroundColor: '#A44F00', padding: 5}]}>
                <View style={EmpresaInfoScreenStyle.boxPrecoCartaoPresente}>
                    <Text style={[EmpresaInfoScreenStyle.textoMenorCartaoPresente]}>
                        Cartão Presente
                    </Text>
                    <View style={EmpresaInfoScreenStyle.boxPreco}>
                        <Text style={EmpresaInfoScreenStyle.textoMenorCartaoPresente}>
                            Valor
                        </Text>
                        <Text style={EmpresaInfoScreenStyle.textoDinheiroCartaoPresente}>
                            R$ 130,00
                        </Text>
                    </View>
                </View>
                <View style={EmpresaInfoScreenStyle.boxServicoCartaoPresente}>
                    <Text style={EmpresaInfoScreenStyle.textValePresente}>
                        Vale Presente
                    </Text>
                    <Text style={EmpresaInfoScreenStyle.textServicoValePresente}> 
                        Todos os serviços
                    </Text>
                </View>
                <View style={EmpresaInfoScreenStyle.containerCartaoPresenteImagem}>
                    <Image source={imageExp} style={EmpresaInfoScreenStyle.containerCartaoPresenteImg}/>
                </View>
            </View>
            <View style={[EmpresaInfoScreenStyle.containerCartaoPresente,{backgroundColor: '#A44F00', padding: 5, marginBottom: 120}]}>
                <View style={EmpresaInfoScreenStyle.boxPrecoCartaoPresente}>
                    <Text style={[EmpresaInfoScreenStyle.textoMenorCartaoPresente]}>
                        Cartão Presente
                    </Text>
                    <View style={EmpresaInfoScreenStyle.boxPreco}>
                        <Text style={EmpresaInfoScreenStyle.textoMenorCartaoPresente}>
                            Valor
                        </Text>
                        <Text style={EmpresaInfoScreenStyle.textoDinheiroCartaoPresente}>
                            R$ 130,00
                        </Text>
                    </View>
                </View>
                <View style={EmpresaInfoScreenStyle.boxServicoCartaoPresente}>
                    <Text style={EmpresaInfoScreenStyle.textValePresente}>
                        Vale Presente
                    </Text>
                    <Text style={EmpresaInfoScreenStyle.textServicoValePresente}> 
                        Todos os serviços
                    </Text>
                </View>
                <View style={EmpresaInfoScreenStyle.containerCartaoPresenteImagem}>
                    <Image source={imageExp} style={EmpresaInfoScreenStyle.containerCartaoPresenteImg}/>
                    <Text>
                        Mecanico do seu Zé
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default EmpresaCartaoPresente