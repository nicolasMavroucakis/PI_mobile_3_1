import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import AdicionarCategoriaStyle from "./AdicionarCategoriaScreenStyle";
import stylesSingLog from "../../SingLog/SignLogStyle";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext";
import { AntDesign } from "@expo/vector-icons";

type RootStackParamList = {
    EmpresaMinhaPaginaScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EmpresaMinhaPaginaScreen">;

const AdicionarCategoriaScreen = () => {
    const [categoria, setCategoria] = useState(""); 
    const navigation = useNavigation<NavigationProp>();
    const { addCategoria } = useEmpresaGlobalContext(); 

    const handleConfirmar = async () => {
        if (categoria.trim() === "") {
            Alert.alert("Erro", "Por favor, insira o nome da categoria.");
            return;
        }

        try {
            await addCategoria(categoria.trim()); 
            Alert.alert("Sucesso", `Categoria adicionada: ${categoria}`);
            setCategoria(""); 
            navigation.navigate("EmpresaMinhaPaginaScreen"); 
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
            Alert.alert("Erro", "Não foi possível adicionar a categoria. Tente novamente.");
        }
    };

    return (
        <View style={AdicionarCategoriaStyle.container}>
            <View style={AdicionarCategoriaStyle.containerTopTitle}>
                <TouchableOpacity onPress={() => navigation.navigate("EmpresaMinhaPaginaScreen")}>
                    <AntDesign 
                        name={"left"} 
                        size={30} 
                        color={"#00C20A"} 
                        style={{ marginLeft: 10 }}         
                    />
                </TouchableOpacity>
                <Text style={AdicionarCategoriaStyle.titulo}>Adicionando Categorias</Text>
            </View>
            <View
                style={[
                    stylesSingLog.inputContainerOneInput,
                    { backgroundColor: "transparent", margin: "auto", marginTop: 0, marginBottom: 0 },
                ]}
            >
                <Text style={{ color: "#00C20A" }}>Categoria</Text>
                <TextInput
                    style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
                    placeholder=""
                    placeholderTextColor="#ccc"
                    value={categoria}
                    onChangeText={setCategoria} 
                />
            </View>
            <TouchableOpacity
                style={[stylesSingLog.botaoCadastro, { margin: "auto", marginTop: 20, marginBottom: 0 }]}
                onPress={handleConfirmar}
            >
                <Text style={stylesSingLog.botaoTexto}>Confirmar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AdicionarCategoriaScreen;