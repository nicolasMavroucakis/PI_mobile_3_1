import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image, ScrollView, Dimensions, Modal, StyleSheet } from "react-native";
import EmpresaInfoScreenStyle from "@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle";
import imageExp from "../../assets/images/imageExemplo.png";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";
import { useAgendamentoServicos } from "@/app/GlobalContext/AgendamentoServicosGlobalContext";
import { useNavigation } from "@react-navigation/native";

interface Servico {
    createdAt: Date;
    duracao: number;
    nome: string;
    preco: number;
    updatedAt: Date;
    categoria: string;
    descricao: string;
    id: string;
    imagensUrl?: string[];
    tipoServico: string;
}

interface CategoriaExpandida {
    nome: string;
    expandida: boolean;
}

const ImagemCarrossel = ({ imagens }: { imagens?: string[] }) => {
    const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    if (!imagens || imagens.length === 0) {
        return (
            <View style={styles.miniaturaWrapper}>
                <Image 
                    source={imageExp} 
                    style={styles.miniatura}
                />
            </View>
        );
    }

    return (
        <View>
            <View style={styles.miniaturaContainer}>
                {imagens.map((imagem, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setImagemSelecionada(imagem)}
                        style={styles.miniaturaWrapper}
                    >
                        <Image 
                            source={{ uri: imagem }} 
                            style={styles.miniatura}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <Modal
                visible={!!imagemSelecionada}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setImagemSelecionada(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity 
                        style={styles.modalBackground}
                        onPress={() => setImagemSelecionada(null)}
                    >
                        <View style={styles.modalImageContainer}>
                            <Image 
                                source={{ uri: imagemSelecionada || '' }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 10
                                }}
                                resizeMode="contain"
                            />
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setImagemSelecionada(null)}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    miniaturaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        marginTop: 10,
    },
    miniaturaWrapper: {
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
    },
    miniatura: {
        width: 40,
        height: 40,
        borderRadius: 5,
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    modalBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImageContainer: {
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        width: '90%',
        aspectRatio: 1,
        maxHeight: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

const EmpresaServicos = () => {
    const navigation = useNavigation();
    const empresa = useEmpresaContext();
    const { adicionarServico, limparSelecao } = useAgendamentoServicos();
    const [categorias, setCategorias] = useState<CategoriaExpandida[]>([]);

    React.useEffect(() => {
        if (empresa.servicos) {
            const servicos = empresa.servicos as unknown as Servico[];
            const categoriasUnicas = Array.from(new Set(servicos.map(s => s.categoria)));
            const categoriasExpandidas: CategoriaExpandida[] = categoriasUnicas.map((cat) => ({
                nome: cat as string,
                expandida: false
            }));
            setCategorias(categoriasExpandidas);
        }
    }, [empresa.servicos]);

    const toggleCategoria = (categoriaNome: string) => {
        setCategorias(cats => 
            cats.map(cat => 
                cat.nome === categoriaNome 
                    ? { ...cat, expandida: !cat.expandida }
                    : cat
            )
        );
    };

    const handleReservar = (servico: Servico) => {
        // Limpa seleções anteriores
        limparSelecao();
        
        // Adiciona o serviço selecionado ao contexto
        adicionarServico({
            nome: servico.nome,
            preco: servico.preco,
            duracao: servico.duracao
        });

        // Navega para a tela de reserva
        navigation.navigate('ReservaScreen' as never);
    };

    const servicos = empresa.servicos as unknown as Servico[];

    return (
        <ScrollView style={EmpresaInfoScreenStyle.styleContainerServico}>
            {categorias.map((categoria) => (
                <View key={categoria.nome}>
                    <TouchableOpacity
                        onPress={() => toggleCategoria(categoria.nome)}
                        style={EmpresaInfoScreenStyle.moduloServicoButton}
                    >
                        <Text style={EmpresaInfoScreenStyle.moduloServico}>
                            {categoria.nome}
                        </Text>
                        <Image 
                            source={require("../assets/Images/Arrow.png")} 
                            style={{
                                ...EmpresaInfoScreenStyle.arrowImage,
                                transform: [{ rotate: categoria.expandida ? '180deg' : '0deg' }]
                            }}
                        />
                    </TouchableOpacity>

                    {categoria.expandida && (
                        <View style={EmpresaInfoScreenStyle.moduloContainer}>
                            {servicos
                                .filter(servico => servico.categoria === categoria.nome)
                                .map((servico, index, array) => (
                                    <React.Fragment key={servico.id}>
                                        <View style={EmpresaInfoScreenStyle.servicoContainer}>
                                            <View style={EmpresaInfoScreenStyle.servicoContainerText}>
                                                <Text style={EmpresaInfoScreenStyle.titleDentroServico}>
                                                    {servico.nome}
                                                </Text>
                                                <Text style={EmpresaInfoScreenStyle.subtitleDentroServico}>
                                                    {servico.descricao}
                                                </Text>
                                                <ImagemCarrossel imagens={servico.imagensUrl} />
                                            </View>
                                            <View style={EmpresaInfoScreenStyle.servicoContainerReserva}>
                                                <TouchableOpacity 
                                                    style={EmpresaInfoScreenStyle.buttonReservar}
                                                    onPress={() => handleReservar(servico)}
                                                >
                                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
                                                        Reservar
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={EmpresaInfoScreenStyle.containerTextPrice}>
                                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
                                                        R$ {servico.preco.toFixed(2)}
                                                    </Text>
                                                    <Text style={{color: 'rgba(255, 255, 255, 0.65)', fontWeight: 'bold', fontSize: 10}}>
                                                        {servico.duracao}min
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        {index < array.length - 1 && (
                                            <View style={EmpresaInfoScreenStyle.line} />
                                        )}
                                    </React.Fragment>
                                ))}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

export default EmpresaServicos;
