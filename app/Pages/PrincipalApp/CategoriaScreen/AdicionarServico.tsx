import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, GestureResponderEvent } from "react-native";
import AdicionarServicoStyle from "./AdicionarServicoStyle";
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
  AdicionarCategoriaScreen: undefined;
  AdicionarServico: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AdicionarServico">;

const AdicionarServico = () => {
  const [servico, setServico] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const handleAdicionarServico = () => {
    if (servico.trim() === "") {
      Alert.alert("Erro", "Por favor, insira o nome do serviço.");
      return;
    }

    Alert.alert("Serviço adicionado", `Serviço: ${servico}`);
    setServico("");

  };

  function handleLogin(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <View style={AdicionarServicoStyle.container}> 
        <Text style={AdicionarServicoStyle.titulo}>Adicionando Serviços</Text>
        <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:0, marginBottom:0 }]}>
                    <Text style={{color: '#00C20A'}}>
                        Nome do Serviço
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={servico}
                        onChangeText={setServico}
                    />
          
                </View>
    
                <TouchableOpacity style={[stylesSingLog.botaoCadastro,{ margin:'auto'} ]} onPress={handleLogin}>
                    <Text style={stylesSingLog.botaoTexto}>Salvar Alterações</Text>
                </TouchableOpacity>
    </View>
  );
};

export default AdicionarServico;