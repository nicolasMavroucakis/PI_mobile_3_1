import HomeNavBar from "@/components/HomeNavBar";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";
import ImgComp from "../../../../assets/images/compartilhar.png";
import EmpresaInfoScreenStyle from "./EmpresaInfoScreenStyle";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useState, useEffect } from "react";
import EmpresaServicos from "@/components/EmpresaInfoComponents/EmpresaServicos";
import EmpresaCartaoPresente from "@/components/EmpresaInfoComponents/EmpresaCartaoPresente";
import EmpresaDetalhes from "@/components/EmpresaInfoComponents/EmpresaDetalhes";
import EmpresaAvaliacao from "@/components/EmpresaInfoComponents/EmpresaAvaliacao";
import { calcularMediaEAvaliacoes } from "@/components/utils/avaliacaoUtils";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";

const EmpresaInfoScreen = () => {
    const [favoritado, setFavoritado] = useState(false); 
    const [servico, setServico] = useState(true)
    const [avaliacao, setAvaliacao] = useState(false)
    const [cartaoPresente, setCartaoPresente] = useState(false)
    const [detalhes, setDetalhes] = useState(false)
    const empresa = useEmpresaContext();
    const [average, setAverage] = useState("0.0");
    const [total, setTotal] = useState(0);
    const [formattedTotal, setFormattedTotal] = useState("0");
    const { db } = StartFirebase();

    useEffect(() => {
        const fetchAvaliacoes = async () => {
            if (!empresa.id) return;
            const q = query(
                collection(db, "avaliacao"),
                where("empresaId", "==", empresa.id)
            );
            const snap = await getDocs(q);
            let sum = 0;
            let count = 0;
            snap.docs.forEach(doc => {
                const data = doc.data();
                if (data.nota >= 1 && data.nota <= 5) {
                    sum += data.nota;
                    count++;
                }
            });
            setAverage(count > 0 ? (sum / count).toFixed(1) : "0.0");
            setTotal(count);
            setFormattedTotal(count >= 1000 ? (count / 1000).toFixed(count >= 10000 ? 0 : 1).replace('.', ',') + 'k' : count.toString());
        };
        fetchAvaliacoes();
    }, [empresa.id]);

    const ratingsData: { [key: number]: number } = {
        5: 66,
        4: 10,
        3: 100,
        2: 110,
        1: 0,
    };

    const { average: calculatedAverage, total: calculatedTotal } = calcularMediaEAvaliacoes(ratingsData);

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
                        source={empresa.fotoPerfil ? { uri: empresa.fotoPerfil } : ImgExemplo}
                        style={EmpresaInfoScreenStyle.principalImage}
                        resizeMode="cover"
                    />
                    <View style={EmpresaInfoScreenStyle.containerAvaliacao}>
                        <Text style={EmpresaInfoScreenStyle.avaliacaoNota}>
                            {average}
                        </Text>
                        <Text style={EmpresaInfoScreenStyle.avaliacaoTexto}>
                            {formattedTotal} Avaliações
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={EmpresaInfoScreenStyle.containerFavoritoCompText}>
                        <View>
                            <Text style={EmpresaInfoScreenStyle.empresa}>
                                {empresa.nome || "Nome da Empresa"}
                            </Text>
                            <Text style={EmpresaInfoScreenStyle.empresaMenor}>
                                {empresa.endereco ? 
                                    `${empresa.endereco.rua || ''} ${empresa.endereco.numero ? `, ${empresa.endereco.numero}` : ''} ${empresa.endereco.cidade ? `, ${empresa.endereco.cidade}` : ''}`.trim() 
                                    : "Endereço não disponível"
                                }
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
                    {avaliacao === true && <EmpresaAvaliacao />}
                </View>
            </ScrollView>
            <HomeNavBar/>
        </View>
    );
};

export default EmpresaInfoScreen;