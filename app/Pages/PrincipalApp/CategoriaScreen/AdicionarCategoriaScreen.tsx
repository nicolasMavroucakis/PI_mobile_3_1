import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, TouchableOpacity } from "react-native";
import AdicionarCategoriaStyle from "./AdicionarCategoriaScreenStyle";
import stylesSingLog from "../../SingLog/SignLogStyle";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";

type RootStackParamList = {
    Login: undefined;
    SignIn: undefined;
    SignEmpresa: undefined;
    SignFuncionario: undefined;
    SignCliente: undefined;
    HomeApp: undefined;
    AdicionarCategoriaScreen: undefined
    AdicionarServico:undefined
  };

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const AdicionarCategoriaScreen = () => {
  const [categoria, setCategoria] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const handleConfirmar = () => {
    if (categoria.trim() === "") {
      Alert.alert("Erro", "Por favor, insira o nome da categoria.");
      return;
    }
    Alert.alert("Categoria adicionada", `Categoria: ${categoria}`);
    setCategoria("");
  };
  const handleLogin = () => {
    navigation.navigate("AdicionarServico"); 
}

  return (
    <View style={AdicionarCategoriaStyle.container}>
        <Text style={AdicionarCategoriaStyle.titulo}>Adicionando Categorias</Text>
        <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:0, marginBottom:0 }]}>
                    <Text style={{color: '#00C20A'}}>
                        Categoria
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={categoria}
                        onChangeText={setCategoria}
                    />
                </View>
    
                <TouchableOpacity style={[stylesSingLog.botaoCadastro,{ margin:'auto', marginTop:20, marginBottom:0} ]} onPress={handleLogin}>
                    <Text style={stylesSingLog.botaoTexto}>Confirmar</Text>
                </TouchableOpacity>
    </View>
  );
};

export default AdicionarCategoriaScreen;