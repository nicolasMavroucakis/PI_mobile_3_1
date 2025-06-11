import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, Image, Modal, FlatList, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import AdicionarServicoStyle from "./AdicionarServicoStyle";
import stylesSingLog from "../../SingLog/SignLogStyle";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, query, where, getDocs, updateDoc, arrayUnion, Timestamp, doc, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { useEmpresaGlobalContext } from "@/app/GlobalContext/EmpresaGlobalContext";
import * as ImagePicker from "expo-image-picker";
import "react-native-get-random-values"; 
import { v4 as uuidv4 } from "uuid";
import { Ionicons } from '@expo/vector-icons';

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

type Funcionario = {
  id: string;
  nome: string;
};

type ServicoData = {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  duracao: number;
  descricao: string;
  imagensUrl: string[];
  tipoServico: string;
  ValorFinalMuda: boolean;
  funcionariosIds?: string[];
  createdAt?: Timestamp;
  updatedAt: Timestamp;
};

const AdicionarServico = () => {
  const [servico, setServico] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [duracao, setDuracao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<Funcionario[]>([]);
  const [imagens, setImagens] = useState<string[]>([]);
  const [categoriasEmpresa, setCategoriasEmpresa] = useState<string[]>([]);
  const [modalCategoriaVisible, setModalCategoriaVisible] = useState(false);
  const [modalFuncionariosVisible, setModalFuncionariosVisible] = useState(false);
  const [funcionariosEmpresa, setFuncionariosEmpresa] = useState<Funcionario[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const navigation = useNavigation<NavigationProp>();
  const { storage, db } = StartFirebase();
  const { id: userId } = useUserGlobalContext();
  const { carregarServicos } = useEmpresaGlobalContext();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const empresasRef = collection(db, "empresas");
        const q = query(empresasRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const empresaDoc = querySnapshot.docs[0];
          const data = empresaDoc.data();
          setCategoriasEmpresa(data.categorias || []);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        Alert.alert("Erro", "Não foi possível carregar as categorias da empresa.");
      }
    };
    fetchCategorias();
  }, [userId]);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        // Primeiro, buscar a empresa para obter os IDs dos funcionários
        const empresasRef = collection(db, "empresas");
        const q = query(empresasRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const empresaDoc = querySnapshot.docs[0];
          const data = empresaDoc.data();
          const funcionariosIds = data.funcionarios || [];

          // Agora, buscar os dados completos de cada funcionário na coleção users
          const funcionariosCompletos: Funcionario[] = [];
          for (const funcionarioId of funcionariosIds) {
            const funcionarioRef = doc(db, "users", funcionarioId);
            const funcionarioDoc = await getDoc(funcionarioRef);
            
            if (funcionarioDoc.exists()) {
              const funcionarioData = funcionarioDoc.data();
              funcionariosCompletos.push({
                id: funcionarioId,
                nome: funcionarioData.nome || "Funcionário sem nome"
              });
            }
          }
          
          setFuncionariosEmpresa(funcionariosCompletos);
        }
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
        Alert.alert("Erro", "Não foi possível carregar os funcionários da empresa.");
      }
    };
    fetchFuncionarios();
  }, [userId]);

  const handleSalvar = async () => {
    if (servico.trim() === "" || valor.trim() === "" || duracao.trim() === "" || tipoServico.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const newUploadedImageUrls: string[] = [...uploadedImageUrls];
      
      for (let i = 0; i < imagens.length; i++) {
        const imageUri = imagens[i];
        if (uploadedImageUrls[i] === imageUri) {
          continue;
        }

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
        newUploadedImageUrls[i] = downloadURL;
      }

      setUploadedImageUrls(newUploadedImageUrls);

      const pagamento = tipoServico === "inicio" ? "pagamento no inicio" : "pagamento no final";
      const valorFinalMuda = tipoServico === "final";

      const empresasRef = collection(db, "empresas");
      const q = query(empresasRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const empresaDoc = querySnapshot.docs[0];
        const empresaRef = empresaDoc.ref;

        const servicoData = {
          id: uuidv4(),
          nome: servico,
          categoria,
          preco: parseFloat(valor),
          duracao: parseInt(duracao, 10),
          descricao,
          imagensUrl: newUploadedImageUrls,
          tipoServico: pagamento,
          ValorFinalMuda: valorFinalMuda,
          funcionariosIds: funcionariosSelecionados.map(f => f.id),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await updateDoc(empresaRef, {
          servicos: arrayUnion(servicoData)
        });

        Alert.alert("Sucesso", `Serviço "${servico}" salvo com sucesso!`);
        carregarServicos();

        setServico("");
        setCategoria("");
        setValor("");
        setDuracao("");
        setDescricao("");
        setImagens([]);
        setUploadedImageUrls([]);
        setTipoServico("");
        setFuncionariosSelecionados([]);
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

  const toggleFuncionario = (funcionario: Funcionario) => {
    setFuncionariosSelecionados(prev => {
      const jaSelecionado = prev.some(f => f.id === funcionario.id);
      if (jaSelecionado) {
        return prev.filter(f => f.id !== funcionario.id);
      } else {
        return [...prev, funcionario];
      }
    });
  };

  const deletarImagem = async (index: number) => {
    Alert.alert(
      "Deletar Imagem",
      "Deseja realmente deletar esta imagem?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(index);
              
              if (uploadedImageUrls[index]) {
                const imageUrl = uploadedImageUrls[index];
                const storagePath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
                const imageRef = ref(storage, storagePath);
                await deleteObject(imageRef);
              }

              setImagens(prevImagens => prevImagens.filter((_, i) => i !== index));
              setUploadedImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
              
              Alert.alert("Sucesso", "Imagem deletada com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar imagem:", error);
              Alert.alert("Erro", "Não foi possível deletar a imagem. Tente novamente.");
            } finally {
              setIsDeleting(null);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={AdicionarServicoStyle.container}>
      <View style={[AdicionarServicoStyle.containerTituloPagina, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 10,
            marginRight: 10,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#00C20A" />
        </TouchableOpacity>
        <Text style={[AdicionarServicoStyle.subtitulo, { marginBottom: 0, flex: 1 }]}>
          Adicionar Serviço
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
        <TouchableOpacity
          style={[stylesSingLog.input, { backgroundColor: "transparent", justifyContent: 'center' }]}
          onPress={() => setModalCategoriaVisible(true)}
        >
          <Text style={{ color: categoria ? "#fff" : "#ccc" }}>
            {categoria || "Selecione uma categoria"}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={modalCategoriaVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalCategoriaVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: 300 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: '#00C20A' }}>Selecione uma categoria</Text>
              <FlatList
                data={categoriasEmpresa}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCategoria(item);
                      setModalCategoriaVisible(false);
                    }}
                    style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                  >
                    <Text style={{ color: '#333', fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setModalCategoriaVisible(false)} style={{ marginTop: 10, alignItems: 'center' }}>
                <Text style={{ color: '#B10000' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
        <TouchableOpacity
          style={[stylesSingLog.input, { backgroundColor: "transparent", justifyContent: 'center' }]}
          onPress={() => setModalFuncionariosVisible(true)}
        >
          <Text style={{ color: funcionariosSelecionados.length > 0 ? "#fff" : "#ccc" }}>
            {funcionariosSelecionados.length > 0 
              ? `${funcionariosSelecionados.length} funcionário(s) selecionado(s)`
              : "Selecione os funcionários"}
          </Text>
        </TouchableOpacity>
        <Modal
          visible={modalFuncionariosVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalFuncionariosVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%', maxHeight: '80%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: '#00C20A' }}>
                Selecione os Funcionários
              </Text>
              <FlatList
                data={funcionariosEmpresa}
                keyExtractor={(item) => `funcionario-${item.id}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={`funcionario-item-${item.id}`}
                    onPress={() => toggleFuncionario(item)}
                    style={{
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: funcionariosSelecionados.some(f => f.id === item.id)
                        ? 'rgba(0,194,10,0.1)'
                        : 'transparent'
                    }}
                  >
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: '#00C20A',
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: funcionariosSelecionados.some(f => f.id === item.id)
                        ? '#00C20A'
                        : 'transparent'
                    }}>
                      {funcionariosSelecionados.some(f => f.id === item.id) && (
                        <Text style={{ color: '#fff', fontSize: 16 }}>✓</Text>
                      )}
                    </View>
                    <Text style={{ color: '#333', fontSize: 16 }}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity
                  onPress={() => setModalFuncionariosVisible(false)}
                  style={{
                    padding: 10,
                    backgroundColor: '#B10000',
                    borderRadius: 5,
                    minWidth: 100,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#fff' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalFuncionariosVisible(false)}
                  style={{
                    padding: 10,
                    backgroundColor: '#00C20A',
                    borderRadius: 5,
                    minWidth: 100,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#fff' }}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
              <TouchableOpacity
                key={index}
                onPress={() => deletarImagem(index)}
                style={{
                  position: 'relative',
                  marginRight: 10,
                  opacity: isDeleting === index ? 0.5 : 1,
                }}
                disabled={isDeleting === index}
              >
                <Image
                  source={{ uri }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: "#00C20A",
                  }}
                />
                {isDeleting === index ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: 10,
                    }}
                  >
                    <ActivityIndicator color="#fff" />
                  </View>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: '#B10000',
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>×</Text>
                  </View>
                )}
              </TouchableOpacity>
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
