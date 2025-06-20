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
import EmpresaInfoScreen from "../EmpresaInfoScreen/EmpresaInfoScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";

type RootStackParamList = {
    UserScreen: undefined;
    CategoriaScreen: { categoria: string };
    EmpresaInfoScreen: undefined;
    CategoriasDeEmpresasScreen: { categoria: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Empresa {
    id: string;
    userId: string;
    nome: string;
    fotoPerfil: string | null;
    [key: string]: any;
}

interface EmpresaData {
    id: string;
    userId: string;
    [key: string]: any;
}

const CATEGORIAS = ['Beleza', 'Limpeza', 'Massagem', 'Eletricista', 'Encanador', 'Mecanico', 'TI', 'Aulas'];

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { setCategoriaSelecionada } = useUserGlobalContext();

    const {
        nome: nomeGlobal,
        usuarioGlobal: usuarioGlobal,
        cidade: cidadeGlobal,
        endereco: enderecoGlobal,
        numero: numeroGlobal,
        id: userId
    } = useUserGlobalContext();
    const primeiroNome = nomeGlobal.split(' ')[0];

    const { db } = StartFirebase();
    const [meusAgendamentos, setMeusAgendamentos] = useState<any[]>([]);
    const [ultimasEmpresas, setUltimasEmpresas] = useState<any[]>([]);
    const [empresasRecomendadas, setEmpresasRecomendadas] = useState<any[]>([]);
    const [categoriasAleatorias, setCategoriasAleatorias] = useState<string[]>([]);
    const [empresasPorCategoria, setEmpresasPorCategoria] = useState<Record<string, Empresa[]>>({});

    const { setAll } = useEmpresaContext();

    useEffect(() => {
        const fetchAgendamentos = async () => {
            if (!userId) return;
            const agendamentosRef = collection(db, "agendamentos");
            const q = query(
                agendamentosRef, 
                where("clienteId", "==", userId),
                where("status", "==", "agendado")
            );
            const querySnapshot = await getDocs(q);
            const agendamentos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMeusAgendamentos(agendamentos);
        };
        fetchAgendamentos();
    }, [userId]);

    useEffect(() => {
        const fetchFinalizados = async () => {
            if (!userId) return;
    
            try {
                const agendamentosRef = collection(db, "agendamentos");
                const q = query(
                    agendamentosRef,
                    where("clienteId", "==", userId),
                    where("status", "==", "finalizado"),
                    orderBy("data", "desc"),
                    limit(10)
                );
    
                const querySnapshot = await getDocs(q);
                const empresaIds = querySnapshot.docs.map(doc => doc.data().empresaId);
    
                if (empresaIds.length > 1) {
                    const empresasRef = collection(db, "empresas");
                    const empresasQuery = query(empresasRef, where("__name__", "in", empresaIds));
                    const empresasSnapshot = await getDocs(empresasQuery);
                    const userIds = empresasSnapshot.docs.map(doc => doc.data().userId);
                    const usersRef = collection(db, "users");
                    const usersQuery = query(usersRef, where("__name__", "in", userIds));
                    const usersSnapshot = await getDocs(usersQuery);
                    const empresasInfo = usersSnapshot.docs.map(doc => ({
                        nome: doc.data().nome,
                        fotoPerfil: doc.data().fotoPerfil,
                        userId: doc.id
                    }));
                    console.log("Informações das empresas:", empresasInfo);
                    setUltimasEmpresas(empresasInfo);
                }
            } catch (error) {
                console.error("Erro ao buscar agendamentos finalizados e informações das empresas:", error);
            }
        };
    
        fetchFinalizados();
    }, [userId]);

    useEffect(() => {
        const fetchEmpresasRecomendadas = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const empresasQuery = query(empresasRef, limit(10));
                const empresasSnapshot = await getDocs(empresasQuery);

                const empresas = empresasSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    nome: doc.data().nome,
                    userId: doc.data().userId,
                }));

                const userIds = empresas.map((empresa) => empresa.userId);
                const usersRef = collection(db, "users");
                const usersQuery = query(usersRef);
                const usersSnapshot = await getDocs(usersRef);

                const usersMap = usersSnapshot.docs.reduce<Record<string, string | null>>((acc, doc) => {
                    acc[doc.id] = doc.data().fotoPerfil;
                    return acc;
                }, {});

                const empresasComFotos = empresas.map((empresa) => ({
                    ...empresa,
                    fotoPerfil: usersMap[empresa.userId] || null,
                }));

                setEmpresasRecomendadas(empresasComFotos);
            } catch (error) {
                console.error("Erro ao buscar empresas recomendadas:", error);
            }
        };

        fetchEmpresasRecomendadas();
    }, [db]);

    const selecionarCategoriasAleatorias = () => {
        const categoriasEmbaralhadas = [...CATEGORIAS].sort(() => Math.random() - 0.5);
        setCategoriasAleatorias(categoriasEmbaralhadas.slice(0, 3));
    };

    useEffect(() => {
        selecionarCategoriasAleatorias();
    }, []);

    useEffect(() => {
        const fetchEmpresasPorCategoria = async () => {
            try {
                const empresasRef = collection(db, "empresas");
                const categoriasRef = collection(db, "categorias");
                const categoriasSnapshot = await getDocs(categoriasRef);
                
                if (!categoriasSnapshot.empty) {
                    const data = categoriasSnapshot.docs[0].data() as Record<string, string[]>;
                    const empresasPorCat: Record<string, Empresa[]> = {};

                    for (const categoria of categoriasAleatorias) {
                        const empresaIds = (data[categoria] || []) as string[];
                        if (empresaIds.length > 0) {
                            const empresasQuery = query(
                                empresasRef,
                                where("__name__", "in", empresaIds.slice(0, 10))
                            );
                            const empresasSnapshot = await getDocs(empresasQuery);
                            
                            const empresas = empresasSnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            })) as EmpresaData[];

                            const userIds = empresas.map(empresa => empresa.userId);
                            const usersRef = collection(db, "users");
                            const usersQuery = query(usersRef, where("__name__", "in", userIds));
                            const usersSnapshot = await getDocs(usersQuery);

                            const usersMap = usersSnapshot.docs.reduce<Record<string, { nome: string; fotoPerfil: string | null }>>((acc, doc) => {
                                acc[doc.id] = {
                                    nome: doc.data().nome,
                                    fotoPerfil: doc.data().fotoPerfil
                                };
                                return acc;
                            }, {});

                            const empresasComInfo: Empresa[] = empresas.map(empresa => ({
                                ...empresa,
                                nome: usersMap[empresa.userId]?.nome || empresa.nome,
                                fotoPerfil: usersMap[empresa.userId]?.fotoPerfil || null,
                                userId: empresa.userId
                            }));

                            empresasPorCat[categoria] = empresasComInfo;
                        } else {
                            empresasPorCat[categoria] = [];
                        }
                    }

                    setEmpresasPorCategoria(empresasPorCat);
                }
            } catch (error) {
                console.error("Erro ao buscar empresas por categoria:", error);
            }
        };

        if (categoriasAleatorias.length > 0) {
            fetchEmpresasPorCategoria();
        }
    }, [categoriasAleatorias]);

    const handleEmpresaClick = async (empresa: any) => {
        try {
            const empresasRef = collection(db, "empresas");
            const empresaDoc = await getDocs(query(empresasRef, where("userId", "==", empresa.userId)));
            
            if (!empresaDoc.empty) {
                const empresaData = empresaDoc.docs[0].data();
                
                // Buscar dados do usuário para pegar a foto de perfil e endereço
                const usersRef = collection(db, "users");
                const userDoc = await getDocs(query(usersRef, where("__name__", "==", empresa.userId)));
                const userData = userDoc.docs[0]?.data() || {};
                const fotoPerfil = userData.fotoPerfil || '';
                const enderecoData = userData.endereco || {};
                
                console.log("Dados brutos do Firebase:", empresaData);
                console.log("Dados do usuário:", userData);
                console.log("Dados do endereço:", enderecoData);

                const dadosAtualizados = {
                    id: empresaDoc.docs[0].id,
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
                    createdAt: empresaData.createdAt || null,
                    updatedAt: empresaData.updatedAt || null,
                    userId: empresaData.userId || '',
                    fotoPerfil: fotoPerfil,
                    linkInstagram: empresaData.linkInstagram || '',
                    linkSite: empresaData.linkSite || ''
                };

                console.log("Dados que serão enviados para o contexto:", dadosAtualizados);
                setAll(dadosAtualizados);
                navigation.navigate("EmpresaInfoScreen" as never);
            } else {
                console.error("Empresa não encontrada");
            }
        } catch (error) {
            console.error("Erro ao buscar dados da empresa:", error);
        }
    };

    const handleCategoriaClick = (categoria: string) => {
        setCategoriaSelecionada(categoria);
        navigation.navigate('CategoriasDeEmpresasScreen');
    };

    return(
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={[HomeScreenStyle.container,{paddingBottom: 200}]}>
                <View style={HomeScreenStyle.topNav}>
                    <View style={[HomeScreenStyle.itensTop, {alignItems: 'flex-start'}]}>
                        <Text style={[HomeScreenStyle.text, {fontSize: 15, marginLeft: 10}]}>Ola {primeiroNome}</Text>
                    </View>
                    <View style={[HomeScreenStyle.itensTop, {alignItems: 'center'}]}>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[HomeScreenStyle.text]}>{enderecoGlobal}, {numeroGlobal}</Text>
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
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Aulas')}>
                            <Image source={AulasImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Aulas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Eletricista')}>
                            <Image source={EletricistaImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Eletricista</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Beleza')}>
                            <Image source={CabelereiroImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Beleza</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Limpesa')}>
                            <Image source={DiaristaImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Limpeza</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={HomeScreenStyle.topPageCategoriasContainer}>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('TI')}>
                            <Image source={TecImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>TI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Encanador')}>
                            <Image source={EncanadorImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Encanador</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Massagem')}>
                            <Image source={MassagemImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Massagem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={HomeScreenStyle.topPageCategoriasContainerButton} onPress={() => handleCategoriaClick('Mecanico')}>
                            <Image source={MecanicoImg} />
                            <Text style={[HomeScreenStyle.text, {fontSize: RFPercentage(1) }]}>Mecanico</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginLeft: 10}}>
                        Meus Agendamentos
                    </Text>
                    <ScrollView style={HomeScreenStyle.containerMeusAgendamentos}>
                        {meusAgendamentos.length === 0 ? (
                            <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhum agendamento encontrado.</Text>
                        ) : (
                            meusAgendamentos.map((agendamento) => (
                                <TouchableOpacity key={agendamento.id} style={HomeScreenStyle.MeusAgendamentosInput}>
                                    <View style={HomeScreenStyle.MeusAgendamentosInputDentro}>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-start'}]}>
                                            <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 10, color: '#B10000'}}>
                                                {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }) : ''}
                                            </Text>
                                            <Text style={{fontWeight: 'bold', fontSize: 25, paddingLeft: 20, color: '#B10000'}}>
                                                {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).getDate() : ''}
                                            </Text>
                                        </View>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-start'}]}>
                                            <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                <Image source={ClockImg} style={{width: 20, height: 20}}/>
                                                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                                    {agendamento.data && agendamento.data.seconds ? new Date(agendamento.data.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </Text>
                                            </View>
                                            <View style={HomeScreenStyle.containersDentroAgendamentoLocHora}>
                                                <Image source={Location} style={{width: 20, height: 20}}/>
                                                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                                    Atendimento a Residencia
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[HomeScreenStyle.containersDentroAgendamento, {alignItems: 'flex-end'}]}>
                                            <Text 
                                                numberOfLines={1} 
                                                ellipsizeMode="tail" 
                                                style={{fontWeight: 'bold', fontSize: 15, paddingRight: 10, maxWidth: 100}}
                                            >
                                                {(agendamento.servico?.nome || "Serviço").length > 7 
                                                    ? (agendamento.servico?.nome || "Serviço").substring(0, 7) + "..."
                                                    : agendamento.servico?.nome || "Serviço"
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>
                <View>
                    <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 20, marginLeft: 10}}>
                        Últimos Serviços
                    </Text>
                    <ScrollView style={HomeScreenStyle.containerUltimosServicos} horizontal={true}>
                        {ultimasEmpresas.length === 0 ? (
                            <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhuma empresa encontrada.</Text>
                        ) : (
                            ultimasEmpresas.map((empresa, index) => (
                                <TouchableOpacity 
                                    key={index} 
                                    style={HomeScreenStyle.containerUltimosServicosDentro} 
                                    onPress={() => handleEmpresaClick(empresa)}
                                >
                                    <View style={HomeScreenStyle.ImgUltServiView}>
                                        <Image 
                                            source={{ uri: empresa.fotoPerfil }} 
                                            style={HomeScreenStyle.ImgUltServi} 
                                            resizeMode="cover" 
                                        />
                                    </View>
                                    <View style={[HomeScreenStyle.ImgUltServiView, {width: '80%', alignItems: 'center', margin: 'auto'}]}>
                                        <Text style={{ fontSize: RFPercentage(1), fontWeight: "bold", color: "#fff", textAlign: 'center' }}>
                                            {empresa.nome}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>
                <View>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 20, marginTop: 20, marginLeft: 10 }}>
                        Empresas Recomendadas
                    </Text>
                    <ScrollView style={HomeScreenStyle.containerUltimosServicos} horizontal={true}>
                        {empresasRecomendadas.length === 0 ? (
                            <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhuma empresa encontrada.</Text>
                        ) : (
                            empresasRecomendadas.map((empresa, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={HomeScreenStyle.containerUltimosServicosDentro}
                                    onPress={() => handleEmpresaClick(empresa)}
                                >
                                    <View style={HomeScreenStyle.ImgUltServiView}>
                                        <Image
                                            source={empresa.fotoPerfil ? { uri: empresa.fotoPerfil } : require("../../../../assets/images/user.jpeg")}
                                            style={HomeScreenStyle.ImgUltServi}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={[HomeScreenStyle.ImgUltServiView, {width: '80%', alignItems: 'center', margin: 'auto'}]}>
                                        <Text style={{ fontSize: RFPercentage(1), fontWeight: "bold", color: "#fff", textAlign: 'center' }}>
                                            {empresa.nome}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </ScrollView>
                </View>
                {categoriasAleatorias.map((categoria, index) => (
                    <View key={categoria}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 20, marginLeft: 10}}>
                                Empresas de {categoria}
                            </Text>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}} onPress={() => handleCategoriaClick(categoria)}>
                                <Text style={{color: '#00C20A', fontSize: 15, fontWeight: 'bold'}}>
                                    Ver todas
                                </Text>
                                <AntDesign name="right" size={20} color="#00C20A" style={{marginLeft: 5, fontWeight: 'bold'}} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={HomeScreenStyle.containerUltimosServicos} horizontal={true}>
                            {(!empresasPorCategoria[categoria] || empresasPorCategoria[categoria].length === 0) ? (
                                <Text style={{ color: "#fff", marginLeft: 10 }}>Nenhuma empresa encontrada.</Text>
                            ) : (
                                empresasPorCategoria[categoria].map((empresa, index) => (
                                    <TouchableOpacity
                                        key={empresa.id || index}
                                        style={HomeScreenStyle.containerUltimosServicosDentro}
                                        onPress={() => handleEmpresaClick(empresa)}
                                    >
                                        <View style={HomeScreenStyle.ImgUltServiView}>
                                            <Image
                                                source={empresa.fotoPerfil ? { uri: empresa.fotoPerfil } : require("../../../../assets/images/user.jpeg")}
                                                style={HomeScreenStyle.ImgUltServi}
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View style={[HomeScreenStyle.ImgUltServiView, {width: '80%', alignItems: 'center', margin: 'auto'}]}>
                                            <Text style={{ fontSize: RFPercentage(1), fontWeight: "bold", color: "#fff", textAlign: 'center' }}>
                                                {empresa.nome}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
            <HomeNavBar/>
        </View>
    )
}

export default HomeScreen;