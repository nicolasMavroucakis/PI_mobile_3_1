import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, Image } from "react-native";
import AdicionarServicoStyle from "./AdicionarServicoStyle";
import stylesSingLog from "../../SingLog/SignLogStyle";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, query, where, getDocs, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values"; 
import { v4 as uuidv4 } from "uuid";

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
  const [tipoServico, setTipoServico] = useState("");
  const [funcionarios, setFuncionarios] = useState("");
  const [imagens, setImagens] = useState<string[]>([]);

  const navigation = useNavigation<NavigationProp>();
  const { storage, db } = StartFirebase();
  const { id: userId } = useUserGlobalContext();
  const { carregarServicos } = useEmpresaGlobalContext();

  const handleSalvar = async () => {
    if (servico.trim() === "" || valor.trim() === "" || duracao.trim() === "" || tipoServico.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const uploadedImageUrls: string[] = [];
      for (let i = 0; i < imagens.length; i++) {
        const imageUri = imagens[i];
        const storageRef = ref(
          storage,
          `servicos/${userId}/${servico}/${i + 1}`
        );

        const response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error(`Erro ao carregar a imagem: ${response.status}`);
        }
        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadURL);
      }

      const pagamento = tipoServico === "inicio" ? "pagamento no inicio" : "pagamento no final";

      const empresasRef = collection(db, "empresas");
      const q = query(empresasRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const empresaDoc = querySnapshot.docs[0];
        const empresaRef = empresaDoc.ref;

        await updateDoc(empresaRef, {
          servicos: arrayUnion({
            id: uuidv4(), // Gera um ID único
            nome: servico,
            categoria,
            preco: parseFloat(valor),
            duracao: parseInt(duracao, 10),
            descricao,
            imagensUrl: uploadedImageUrls,
            tipoServico: pagamento,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }),
        });

        Alert.alert("Sucesso", `Serviço "${servico}" salvo com sucesso!`);

        carregarServicos(categoria);

        setServico("");
        setCategoria("");
        setValor("");
        setDuracao("");
        setDescricao("");
        setImagens([]);
        setTipoServico("");
        navigation.goBack();
      } else {
        Alert.alert("Erro", "Empresa não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao salvar o serviço:", error);
      Alert.alert("Erro", "Não foi possível salvar o serviço. Tente novamente.");
    }
  };

  const selecionarImagens = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de permissão para acessar sua galeria.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsMultipleSelection: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setImagens((prevImagens) => [...prevImagens, ...uris]);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagens:", error);
      Alert.alert("Erro", "Não foi possível acessar a galeria.");
    }
  };

  return (
    <ScrollView contentContainerStyle={AdicionarServicoStyle.container}>
      <View style={AdicionarServicoStyle.containerTituloPagina}>
        <Text style={[AdicionarServicoStyle.subtitulo, { marginBottom: 0 }]}>
          Adicionar serviço
        </Text>
      </View>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: "transparent", margin: "auto", marginTop: 30, marginBottom: 0 }]}>
        <Text style={{ color: "#00C20A" }}>Nome do Serviço</Text>
        <TextInput
          style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
          placeholder=""
          placeholderTextColor="#ccc"
          value={servico}
          onChangeText={setServico}
        />
      </View>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: "transparent", margin: "auto", marginTop: 20, marginBottom: 0 }]}>
        <Text style={{ color: "#00C20A" }}>Categoria Pertencente</Text>
        <TextInput
          style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
          placeholder=""
          placeholderTextColor="#ccc"
          value={categoria}
          onChangeText={setCategoria}
        />
      </View>
      <Text style={AdicionarServicoStyle.linkTexto}>Não possui uma categoria?</Text>
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={AdicionarServicoStyle.subtitulo}>Qual o tipo do serviço?</Text>
        <View style={AdicionarServicoStyle.containerTipoServico}>
          <View style={AdicionarServicoStyle.containerTipoServicoMetade}>
            <Text style={AdicionarServicoStyle.linkTexto}>Valor no inicio</Text>
            <TouchableOpacity
              style={[
                AdicionarServicoStyle.botaoTipoServico,
                { backgroundColor: tipoServico === "inicio" ? "#00C20A" : "#ccc" },
              ]}
              onPress={() => {
                setTipoServico("inicio");
              }}
            />
          </View>
          <View style={AdicionarServicoStyle.containerTipoServicoMetade}>
            <Text style={AdicionarServicoStyle.linkTexto}>Valor no final</Text>
            <TouchableOpacity
              style={[
                AdicionarServicoStyle.botaoTipoServico,
                { backgroundColor: tipoServico === "final" ? "#00C20A" : "#ccc" },
              ]}
              onPress={() => {
                setTipoServico("final");
              }}
            />
          </View>
        </View>
      </View>
      <View style={AdicionarServicoStyle.linha}>
        <View style={AdicionarServicoStyle.inputContainerTwoInputs}>
          <Text style={{ color: "#00C20A" }}>
            Valor {tipoServico === "inicio" ? "fixo" : "inicial"}
          </Text>
          <TextInput
            style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
            placeholder=""
            placeholderTextColor="#ccc"
            value={valor}
            onChangeText={setValor}
          />
        </View>
        <View style={AdicionarServicoStyle.inputContainerTwoInputs}>
          <Text style={{ color: "#00C20A" }}>Duração</Text>
          <TextInput
            style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
            placeholder=""
            placeholderTextColor="#ccc"
            value={duracao}
            onChangeText={setDuracao}
          />
        </View>
      </View>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: "transparent", margin: "auto", marginTop: 20, marginBottom: 0, height: 80 }]}>
        <Text style={{ color: "#00C20A" }}>Descrição</Text>
        <TextInput
          style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
          placeholder=""
          placeholderTextColor="#ccc"
          value={descricao}
          onChangeText={setDescricao}
        />
      </View>
      <View style={[stylesSingLog.inputContainerOneInput, { backgroundColor: "transparent", margin: "auto", marginTop: 20, marginBottom: 20, height: 80 }]}>
        <Text style={{ color: "#00C20A" }}>Funcionários desse Serviço</Text>
        <TextInput
          style={[stylesSingLog.input, { backgroundColor: "transparent" }]}
          placeholder=""
          placeholderTextColor="#ccc"
          value={funcionarios}
          onChangeText={setFuncionarios}
        />
      </View>
      <View style={[AdicionarServicoStyle.inputContainerBig, { margin: "auto", marginBottom: 20, paddingTop: 40 }]}>
        <View style={{ width: "100%", alignItems: "flex-start", marginBottom: 10, marginLeft: 20, marginTop: 10 }}>
          <Text style={{ color: "#00C20A", textAlign: "left" }}>Adicionar Imagens</Text>
        </View>
        <TouchableOpacity
          style={{
            width: 250,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#00C20A",
            borderRadius: 10,
            backgroundColor: "transparent",
          }}
          onPress={selecionarImagens}
        >
          <Text style={{ color: "#ccc" }}>Clique para selecionar imagens</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {imagens.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{
                  width: 60,
                  height: 60,
                  marginRight: 10,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#00C20A",
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      <TouchableOpacity style={AdicionarServicoStyle.botao} onPress={handleSalvar}>
        <Text style={AdicionarServicoStyle.botaoTexto}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdicionarServico;

