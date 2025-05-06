import EmpresaNavBar from "@/components/EmpresaNavBar"
import { ScrollView, TouchableOpacity, View, Image, Text } from "react-native"
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle"
import setaImg from "../../../../assets/images/seta.png";
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle";
import engrenagemImg from "../../../../assets/images/engrenagemColorida.png";
import addImg from "../../../../assets/images/add.png"
import deleteImg from "../../../../assets/images/deleteImg.png"
import lapisImg from "../../../../assets/images/lapis.png"
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmpresaMinhaPaginaScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    return(
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Agendamentos</Text>
                <TouchableOpacity>
                    <Image source={engrenagemImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[UserScreenStyle.containerRest, { minHeight: 750, flexGrow: 1 , paddingBottom: 100}]}>
                    <View style={EmpresaInfoMoneyScreenStyle.containerMinhaPaginaTop}>
                        <TouchableOpacity style={EmpresaInfoMoneyScreenStyle.touchbleOpacityButtonMinhaPaginaTop}>
                            <Text style={{ color: '#00C20A', fontSize: 11, fontWeight: 'bold' }}>
                                Ver Previa da Pagina
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={EmpresaInfoMoneyScreenStyle.containerCategorias}>
                        <View style={EmpresaInfoMoneyScreenStyle.containerCategoriaServicosAdd}>
                            <Text style={UserScreenStyle.textTitle}>Categorias</Text>
                            <TouchableOpacity>
                                <Image source={addImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                            </TouchableOpacity>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.containerItens}>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Trocas</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Verificações</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Concertos</Text>
                                <TouchableOpacity>
                                    <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={EmpresaInfoMoneyScreenStyle.containerServicos}>
                        <View style={EmpresaInfoMoneyScreenStyle.containerCategoriaServicosAdd}>
                            <Text style={UserScreenStyle.textTitle}>Serviços</Text>
                            <TouchableOpacity>
                                <Image source={addImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                            </TouchableOpacity>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.containerItens}>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Serviço 1</Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerPenDelete}>
                                    <TouchableOpacity>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={lapisImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Serviço 2</Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerPenDelete}>
                                    <TouchableOpacity>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={lapisImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Serviço 2</Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerPenDelete}>
                                    <TouchableOpacity>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={lapisImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Serviço 2</Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerPenDelete}>
                                    <TouchableOpacity>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={lapisImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={EmpresaInfoMoneyScreenStyle.item}>
                                <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>Serviço 2</Text>
                                <View style={EmpresaInfoMoneyScreenStyle.containerPenDelete}>
                                    <TouchableOpacity>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={lapisImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <EmpresaNavBar/>
        </View>
        
    )
}

export default EmpresaMinhaPaginaScreen