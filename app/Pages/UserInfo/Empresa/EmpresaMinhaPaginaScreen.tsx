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
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";

type RootStackParamList = {
    UserScreen: undefined;
    AdicionarCategoriaScreen: undefined;
    AdicionarServico: undefined;
    ConfigEmpresaInfo: undefined;
    EmpresaInfoScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EmpresaMinhaPaginaScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { categorias, deleteCategoria, servicos, deleteServico } = useEmpresaGlobalContext(); 
    const { id: userId } = useUserGlobalContext();
    const { db } = StartFirebase();
    const { setAll } = useEmpresaContext();

    const handleVerPrevia = async () => {
        try {
            if (!userId) return;

            const empresasRef = collection(db, "empresas");
            const empresaQuery = await getDocs(query(empresasRef, where("userId", "==", userId)));
            
            if (!empresaQuery.empty) {
                const empresaDoc = empresaQuery.docs[0];
                const empresaData = empresaDoc.data();
                const enderecoData = empresaData.endereco || {};
                
                const dadosAtualizados = {
                    id: empresaDoc.id,
                    nome: empresaData.nome || '',
                    email: empresaData.email || '',
                    endereco: {
                        cep: enderecoData.cep || '',
                        cidade: enderecoData.cidade || '',
                        complemento: enderecoData.complemento || '',
                        numero: enderecoData.numero || '',
                        rua: enderecoData.rua || ''
                    },
                    funcionarios: empresaData.funcionarios || [],
                    servicos: empresaData.servicos || [],
                    telefone: empresaData.telefone || '',
                    createdAt: empresaData.createdAt ? new Date(empresaData.createdAt.seconds * 1000) : null,
                    updatedAt: empresaData.updatedAt ? new Date(empresaData.updatedAt.seconds * 1000) : null,
                    userId: empresaData.userId || '',
                };

                setAll(dadosAtualizados);
                navigation.navigate('EmpresaInfoScreen');
            }
        } catch (error) {
            console.error("Erro ao buscar dados da empresa:", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Agendamentos</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ConfigEmpresaInfo")}>
                    <Image source={engrenagemImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[UserScreenStyle.containerRest, { minHeight: 750, flexGrow: 1, paddingBottom: 100 }]}>
                    <View style={EmpresaInfoMoneyScreenStyle.containerMinhaPaginaTop}>
                        <TouchableOpacity 
                            style={EmpresaInfoMoneyScreenStyle.touchbleOpacityButtonMinhaPaginaTop}
                            onPress={handleVerPrevia}
                        >
                            <Text style={{ color: '#00C20A', fontSize: 11, fontWeight: 'bold' }}>
                                Ver Previa da Pagina
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={EmpresaInfoMoneyScreenStyle.containerCategorias}>
                        <View style={EmpresaInfoMoneyScreenStyle.containerCategoriaServicosAdd}>
                            <Text style={UserScreenStyle.textTitle}>Categorias</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("AdicionarCategoriaScreen")}>
                                <Image source={addImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                            </TouchableOpacity>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.containerItens}>
                            {categorias.map((categoria, index) => (
                                <View key={index} style={EmpresaInfoMoneyScreenStyle.item}>
                                    <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>{categoria}</Text>
                                    <TouchableOpacity onPress={() => deleteCategoria(categoria)}>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={EmpresaInfoMoneyScreenStyle.containerServicos}>
                        <View style={EmpresaInfoMoneyScreenStyle.containerCategoriaServicosAdd}>
                            <Text style={UserScreenStyle.textTitle}>Serviços</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("AdicionarServico")}>
                                <Image source={addImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                            </TouchableOpacity>
                        </View>
                        <View style={EmpresaInfoMoneyScreenStyle.containerItens}>
                            {servicos.map((servico, index) => (
                                <View key={index} style={EmpresaInfoMoneyScreenStyle.item}>
                                    <Text style={EmpresaInfoMoneyScreenStyle.textTitleServicos}>{servico.nome}</Text>
                                    <View style={EmpresaInfoMoneyScreenStyle.containerPenDelete}>
                                    <TouchableOpacity onPress={() => deleteServico(servico.id)}>
                                        <Image source={deleteImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image source={lapisImg} style={EmpresaInfoMoneyScreenStyle.iconesAddDeleteActionsMinhaPagina} />
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <EmpresaNavBar />
        </View>
    );
};

export default EmpresaMinhaPaginaScreen;