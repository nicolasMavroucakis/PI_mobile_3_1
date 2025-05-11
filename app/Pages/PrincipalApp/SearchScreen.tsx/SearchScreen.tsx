import { ScrollView, View, Image, TextInput, TouchableOpacity, Text } from "react-native"
import HomeNavBar from "@/components/HomeNavBar"
import HomeScreenStyle from "../HomeScreen/HomeScreenStyle"
import BuscaImg from "../../../../components/assets/Images/Busca.png";
import CalendarioImg from "../../../../components/assets/Images/Calendario.png";
import LocationImg from "../../../../assets/images/location.png"
import SearchScreenStyle from "./SearchScreenStyle";
import Mecanico from "../../../../assets/images/mecanico.png"
import Cabelereiro from "../../../../assets/images/cabelereiro.png"
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import ImgExemplo from "../../../../assets/images/imageExemplo.png"

const SearchScreen = () => {
    const [searchText, setSearchText] = useState("");
    const [city, setCity] = useState(""); 
    const [results, setResults] = useState<any[]>([]); 
    const { db } = StartFirebase()

    const handleSearch = async () => {
        if (!searchText || !city) {
            alert("Por favor, preencha os campos de pesquisa e cidade.");
            return;
        }
    
        try {
            const empresasRef = collection(db, "empresas");
            const q = query(
                empresasRef,
                where("endereco.cidade", "==", city),
                where("nome", ">=", searchText),
                where("nome", "<=", searchText + "\uf8ff")
            );
    
            const querySnapshot = await getDocs(q);
    
            const empresas = querySnapshot.docs.map(doc => ({
                id: doc.id,
                userId: doc.data().userId, 
                ...doc.data(),
            }));
            const userIds = [...new Set(empresas.map(e => e.userId))];
    
            if (userIds.length === 0) {
                setResults([]); 
                return;
            }
    
            const usersRef = collection(db, "users");
    
            const userChunks = [];
            for (let i = 0; i < userIds.length; i += 10) {
                userChunks.push(userIds.slice(i, i + 10));
            }
    
            const userData: any[] = [];
    
            for (const chunk of userChunks) {
                const usersQuery = query(usersRef, where("__name__", "in", chunk));
                const usersSnapshot = await getDocs(usersQuery);
    
                const chunkData = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    nome: doc.data().nome,
                    fotoPerfil: doc.data().fotoPerfil,
                    endereco: doc.data().endereco,
                }));
    
                userData.push(...chunkData);
            }
    
            setResults(userData);
            console.log("Resultados da pesquisa com dados dos usuários:", userData);
    
        } catch (error) {
            console.error("Erro ao buscar empresas ou usuários:", error);
        }
    };

    return(
        <View style={{flex:1}}>
            <View style={HomeScreenStyle.container}>
                <View style={SearchScreenStyle.containerAllInputs}>
                    <View style={[SearchScreenStyle.inputBox, SearchScreenStyle.inputBoxBig]}>
                        <Image source={BuscaImg} style={SearchScreenStyle.ImagesTextInput}/>
                        <TextInput style={{flex: 1}} placeholder="Pesquise serviços ou empresas" placeholderTextColor="#4F4F4F" onChangeText={setSearchText}/>
                    </View>
                    <View style={SearchScreenStyle.containerSmallInputs}>
                        <View style={[SearchScreenStyle.inputBox, SearchScreenStyle.inputBoxSmall]}>
                            <Image source={LocationImg} style={SearchScreenStyle.ImagesTextInput}/>
                            <TextInput style={{flex: 1}} placeholder="A onde?" placeholderTextColor="#4F4F4F" onChangeText={setCity}/>
                        </View>
                        <View style={[SearchScreenStyle.inputBox, SearchScreenStyle.inputBoxSmall]}>
                            <Image source={CalendarioImg} style={SearchScreenStyle.ImagesTextInput}/>
                            <TextInput style={{flex: 1}} placeholder="Quando?" placeholderTextColor="#4F4F4F" />
                        </View>
                    </View>
                    <TouchableOpacity style={SearchScreenStyle.TouchableOpacityPesquisa} onPress={handleSearch}>
                        <Text style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
                            Pesquisar
                        </Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={SearchScreenStyle.containerCategorias}>
                    <View style={SearchScreenStyle.containerCategoriasContent}>
                        {results.length === 0 ? (
                            <Text style={{ color: "#FFF", textAlign: "center", marginTop: 20 }}>
                                Nenhuma empresa encontrada.
                            </Text>
                        ) : (
                            results.map((empresa, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={HomeScreenStyle.containerDescontoDentro}
                                    onPress={() => console.log(`Empresa selecionada: ${empresa.nome}`)}
                                >
                                    <Image
                                        source={{ uri: empresa.fotoPerfil || "https://via.placeholder.com/150" }}
                                        style={HomeScreenStyle.containerDescontoDentroImg}
                                        resizeMode="cover"
                                    />
                                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 5, marginTop: 10, marginLeft: 0 }}>
                                        {empresa.nome}
                                    </Text>
                                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 15, marginTop: 1, marginLeft: 0 }}>
                                        {empresa.endereco?.rua}, {empresa.endereco?.numero}, {empresa.endereco?.cidade}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
            <HomeNavBar/>
        </View>
    )
}

export default SearchScreen