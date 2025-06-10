import { ScrollView, TouchableOpacity, View, Image, Text, Alert } from "react-native"
import EmpresaInfoMoneyScreenStyle from "./EmpresaInfoMoneyScreenStyle"
import UserScreenStyle from "../../PrincipalApp/UserScreen/UserScreenStyle"
import setaImg from "../../../../assets/images/seta.png"
import deleteImg from "../../../../assets/images/deleteImg.png"
import lapisImg from "../../../../assets/images/lapis.png"
import { useNavigation } from "expo-router"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, query, where, deleteDoc, updateDoc } from "firebase/firestore"
import StartFirebase from "@/app/crud/firebaseConfig"
import EmpresaNavBar from "@/components/EmpresaNavBar"

type RootStackParamList = {
    UserScreen: undefined;
    FuncionarioChangeInfo: { funcionarioId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface EmpresaGlobalContextType {
    empresa: {
        id: string;
        userId: string;
        funcionarios: string[];
        [key: string]: any;
    } | null;
    carregarEmpresa: () => Promise<void>;
}

interface Funcionario {
    id: string;
    nome: string;
    fotoPerfil: string;
    especialidade?: string;
    email: string;
    telefone: string;
}

const EditarDeletarFuncionario = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const context = useEmpresaGlobalContext();
    const { empresa, carregarEmpresa } = context as EmpresaGlobalContextType;
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(true);

    const carregarFuncionarios = async () => {
        if (!empresa?.id) {
            console.log("Empresa não encontrada no contexto");
            await carregarEmpresa();
            if (!empresa?.id) {
                setFuncionarios([]);
                setLoading(false);
                return;
            }
        }

        if (!empresa?.funcionarios?.length) {
            console.log("Nenhum funcionário cadastrado");
            setFuncionarios([]);
            setLoading(false);
            return;
        }

        try {
            const funcionariosPromises = empresa.funcionarios.map(async (funcionarioId: string) => {
                console.log("Consultando funcionário:", funcionarioId);
                const funcionarioDoc = await getDoc(doc(db, "users", funcionarioId));
                if (funcionarioDoc.exists()) {
                    const funcionarioData = funcionarioDoc.data();
                    console.log("Dados do funcionário:", funcionarioData);
                    const funcionario: Funcionario = {
                        id: funcionarioId,
                        nome: funcionarioData.nome || "Nome não disponível",
                        fotoPerfil: funcionarioData.fotoPerfil || "",
                        especialidade: funcionarioData.especialidade,
                        email: funcionarioData.email || "",
                        telefone: funcionarioData.telefone || ""
                    };
                    return funcionario;
                }
                console.log("Funcionário não encontrado:", funcionarioId);
                return null;
            });

            const funcionariosDetalhados = await Promise.all(funcionariosPromises);
            const funcionariosFiltrados = funcionariosDetalhados.filter((f): f is Funcionario => f !== null);
            console.log("Funcionários carregados:", funcionariosFiltrados);
            setFuncionarios(funcionariosFiltrados);
        } catch (error) {
            console.error("Erro ao carregar funcionários:", error);
            Alert.alert("Erro", "Não foi possível carregar a lista de funcionários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarFuncionarios();
    }, [empresa?.id, empresa?.funcionarios]);

    const handleEditar = (funcionarioId: string) => {
        navigation.navigate("FuncionarioChangeInfo", { funcionarioId });
    };

    const handleDeletar = async (funcionarioId: string) => {
        if (!empresa?.id) {
            Alert.alert("Erro", "Dados da empresa não encontrados.");
            return;
        }

        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja remover este funcionário?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const empresaRef = doc(db, "empresas", empresa.id);
                            const funcionariosAtualizados = empresa.funcionarios.filter((id: string) => id !== funcionarioId);
                            await updateDoc(empresaRef, {
                                funcionarios: funcionariosAtualizados
                            });

                            await deleteDoc(doc(db, "users", funcionarioId));

                            await carregarEmpresa();
                            
                            Alert.alert("Sucesso", "Funcionário removido com sucesso!");
                        } catch (error) {
                            console.error("Erro ao deletar funcionário:", error);
                            Alert.alert("Erro", "Não foi possível remover o funcionário.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <View style={[EmpresaInfoMoneyScreenStyle.containerTitle]}>
                <TouchableOpacity onPress={() => navigation.navigate("UserScreen")}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Funcionários</Text>
                <TouchableOpacity style={{ width: 30, height: 30, marginRight: 10 }}/>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[UserScreenStyle.containerRest, { 
                    minHeight: 750, 
                    flexGrow: 1, 
                    paddingBottom: 100,
                    gap: 5,
                    paddingTop: 10,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                }]}>
                    {loading ? (
                        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>Carregando...</Text>
                    ) : funcionarios.length === 0 ? (
                        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>Nenhum funcionário cadastrado</Text>
                    ) : (
                        funcionarios.map((funcionario) => (
                            <View 
                                key={funcionario.id} 
                                style={[
                                    EmpresaInfoMoneyScreenStyle.touchableOpacityAdd,
                                    { 
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: 15,
                                        marginBottom: 5
                                    }
                                ]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                        {funcionario.nome}
                                    </Text>
                                    {funcionario.especialidade && (
                                        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                                            {funcionario.especialidade}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', gap: 15 }}>
                                    <TouchableOpacity 
                                        onPress={() => handleEditar(funcionario.id)}
                                        style={{ padding: 5 }}
                                    >
                                        <Image 
                                            source={lapisImg} 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => handleDeletar(funcionario.id)}
                                        style={{ padding: 5 }}
                                    >
                                        <Image 
                                            source={deleteImg} 
                                            style={{ width: 24, height: 24 }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
            <EmpresaNavBar />
        </View>
    );
};

export default EditarDeletarFuncionario;