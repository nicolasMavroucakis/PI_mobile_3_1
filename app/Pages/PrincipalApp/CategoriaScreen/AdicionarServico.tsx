import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity } from "react-native";
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
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [duracao, setDuracao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [funcionarios, setFuncionarios] = useState("");
  const [obs, setObs] = useState("");

  const navigation = useNavigation<NavigationProp>();

  const handleSalvar = () => {
    if (servico.trim() === "") {
      Alert.alert("Erro", "Por favor, insira o nome do serviço.");
      return;
    }
    Alert.alert("Serviço salvo", `Serviço: ${servico}`);
  };

  return (
    <ScrollView contentContainerStyle={AdicionarServicoStyle.container}>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:30, marginBottom:0 }]}>
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
    

     <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:20, marginBottom:0 }]}>
                    <Text style={{color: '#00C20A'}}>
                        Categoria Pertencente
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={categoria}
                        onChangeText={setCategoria}
                    />
                </View>
    

      <Text style={AdicionarServicoStyle.linkTexto}>Não possui uma categoria?</Text>

      <Text style={AdicionarServicoStyle.subtitulo}>Configurações do serviço</Text>

      <View style={AdicionarServicoStyle.linha}>

         <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:0, marginBottom:0,width:185 }]}>
                    <Text style={{color: '#00C20A'}}>
                        Valor
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={valor}
                        onChangeText={setValor}
                    />
                </View>
    <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:0, marginBottom:0,width:185 }]}>
        <Text style={{color: '#00C20A'}}>
          Duração
        </Text>
        <TextInput
                      style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                      placeholder=""
                      placeholderTextColor="#ccc"
                      value={duracao}
                      onChangeText={setDuracao}
        />
        </View>
      </View>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:20, marginBottom:0, height:80,}]}>
                    <Text style={{color: '#00C20A'}}>
                        Descrição
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                </View>
            <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:20, marginBottom:0, height:80,}]}>
                    <Text style={{color: '#00C20A'}}>
                        Funcionparios desse Serviço
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={funcionarios}
                        onChangeText={setFuncionarios}
                    />
                </View>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: 'transparent', margin:'auto', marginTop:20, marginBottom:50, height:80,}]}>
                    <Text style={{color: '#00C20A'}}>
                        Adicionar Serviços
                    </Text>
                    <TextInput
                        style={[stylesSingLog.input, { backgroundColor: 'transparent',}]}
                        placeholder=""
                        placeholderTextColor="#ccc"
                        value={funcionarios}
                        onChangeText={setFuncionarios}
                    />
                </View>

      <TouchableOpacity style={AdicionarServicoStyle.botao} onPress={handleSalvar}>
        <Text style={AdicionarServicoStyle.botaoTexto}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdicionarServico;
