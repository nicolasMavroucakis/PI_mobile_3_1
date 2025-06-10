import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CategoriasDeEmpresasScreenStyle from "./CategoriasDeEmpresasScreenStyle";
import UserScreenStyle from "../UserScreen/UserScreenStyle";
import EmpresaInfoMoneyScreenStyle from "../../UserInfo/Empresa/EmpresaInfoMoneyScreenStyle";
import StartFirebase from "@/app/crud/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import HomeScreenStyle from "../HomeScreen/HomeScreenStyle";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import HomeNavBar from "@/components/HomeNavBar";

const CategoriasDeEmpresasScreen = () => {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = StartFirebase();
  const navigation = useNavigation();
  const { setAll } = useEmpresaContext();
  const { categoriaSelecionada } = useUserGlobalContext();

  console.log('DEBUG: Categoria selecionada do contexto:', categoriaSelecionada);

  useEffect(() => {
    const fetchEmpresas = async () => {
      if (!categoriaSelecionada) {
        console.log('DEBUG: Nenhuma categoria selecionada');
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log('DEBUG: Entrou em fetchEmpresas para categoria:', categoriaSelecionada);
      try {
        const categoriasRef = collection(db, "categorias");
        const snapshot = await getDocs(categoriasRef);
        console.log('DEBUG: Quantidade de documentos de categorias:', snapshot.size);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as Record<string, string[]>;
          console.log('DEBUG: Dados completos do documento de categorias:', JSON.stringify(data, null, 2));
          console.log('DEBUG: Categoria selecionada:', categoriaSelecionada);
          
          if (categoriaSelecionada === 'Beleza') {
            console.log('DEBUG: Verificando categoria Beleza');
            console.log('DEBUG: IDs na categoria Beleza:', data['Beleza']);
          }

          const empresaIds = (data[categoriaSelecionada as string] || []) as string[];
          console.log('DEBUG empresaIds para categoria:', categoriaSelecionada, empresaIds);
          
          if (!Array.isArray(empresaIds) || empresaIds.length === 0) {
            console.log('DEBUG: Nenhuma empresa encontrada para esta categoria');
            setEmpresas([]);
            setLoading(false);
            return;
          }
          const empresasData: any[] = [];
          for (const id of empresaIds) {
            if (!id) {
              console.log('DEBUG: ID vazio encontrado, pulando...');
              continue;
            }
            try {
              console.log('DEBUG: Buscando empresa com ID:', id);
              const empresaDoc = await getDoc(doc(db, "empresas", id));
              
              if (empresaDoc.exists()) {
                const empresaDataObj = empresaDoc.data() || {};
                console.log('DEBUG: Dados da empresa encontrada:', JSON.stringify(empresaDataObj, null, 2));
                
                const userId = empresaDataObj.userId || '';
                if (!userId) {
                  console.log('DEBUG: Empresa sem userId:', id);
                  continue;
                }

                const usersRef = collection(db, "users");
                const userDoc = await getDocs(query(usersRef, where("__name__", "==", userId)));
                
                if (userDoc.empty) {
                  console.log('DEBUG: Usuário não encontrado para userId:', userId);
                  continue;
                }

                const fotoPerfil = userDoc.docs[0]?.data()?.fotoPerfil || '';
                const empresaCompleta = { 
                  id: empresaDoc.id, 
                  ...empresaDataObj, 
                  userId, 
                  fotoPerfil 
                };
                console.log('DEBUG: Empresa completa preparada:', JSON.stringify(empresaCompleta, null, 2));
                empresasData.push(empresaCompleta);
              } else {
                console.log('DEBUG: Empresa não encontrada para ID:', id);
              }
            } catch (error) {
              console.log('DEBUG erro ao buscar empresa:', id, error);
            }
          }
          console.log('DEBUG: Total de empresas encontradas:', empresasData.length);
          console.log('DEBUG: Lista final de empresas:', JSON.stringify(empresasData, null, 2));
          setEmpresas(empresasData);
        } else {
          console.log('DEBUG: Nenhum documento de categorias encontrado');
          setEmpresas([]);
        }
      } catch (error) {
        console.log('DEBUG erro geral fetchEmpresas:', error);
        setEmpresas([]);
      }
      setLoading(false);
    };

    fetchEmpresas();
  }, [db, categoriaSelecionada]);

  const handleEmpresaClick = async (empresa: any) => {
    try {
      const empresasRef = collection(db, "empresas");
      const empresaDoc = await getDocs(query(empresasRef, where("userId", "==", empresa.userId)));
      if (!empresaDoc.empty) {
        const empresaData = empresaDoc.docs[0].data();
        const enderecoData = empresaData.endereco || {};
        console.log('DEBUG: Dados da empresa encontrada:', JSON.stringify(empresaData, null, 2));
        const usersRef = collection(db, "users");
        const userDoc = await getDocs(query(usersRef, where("__name__", "==", empresa.userId)));
        const fotoPerfil = userDoc.docs[0]?.data()?.fotoPerfil || '';
        const dadosAtualizados = {
          id: empresaDoc.docs[0].id,
          nome: empresaData.nome || '',
          email: empresaData.email || '',
          endereco: {
            cep: enderecoData.cep || '',
            cidade: enderecoData.cidade || '',
            complemento: enderecoData.complemento || '',
            numero: enderecoData.numero || '',
            rua: enderecoData.rua || ''
          },
          funcionarios: empresaData.funcionarios || [],
          servicos: empresaData.servicos || [],
          telefone: empresaData.telefone || '',
          createdAt: empresaData.createdAt ? new Date(empresaData.createdAt.seconds * 1000) : null,
          updatedAt: empresaData.updatedAt ? new Date(empresaData.updatedAt.seconds * 1000) : null,
          userId: empresaData.userId || '',
          fotoPerfil: fotoPerfil,
          linkInstagram: empresaData.linkInstagram || '',
          linkSite: empresaData.linkSite || ''
        };
        setAll(dadosAtualizados);
        navigation.navigate("EmpresaInfoScreen" as never);
      } else {
        console.log('DEBUG empresa não encontrada');
      }
    } catch (error) {
      console.log('DEBUG erro ao buscar empresa:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#00C20A" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={[CategoriasDeEmpresasScreenStyle.container, { alignItems: 'center', justifyContent: 'center' }]}> 
        <Text style={UserScreenStyle.textTitle}>Empresas da categoria: {categoriaSelecionada}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "#323232", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <View style={{ padding: 16 }}>
          {empresas.length === 0 ? (
            <Text style={{ color: "#FFF", textAlign: "center", marginTop: 20 }}>
              Nenhuma empresa encontrada.
            </Text>
          ) : (
            empresas.map((empresa, index) => (
              <TouchableOpacity
                key={empresa.id || index}
                style={HomeScreenStyle.containerDescontoDentro}
                onPress={() => handleEmpresaClick(empresa)}
              >
                <Image
                  source={empresa.fotoPerfil ? { uri: empresa.fotoPerfil } : require("../../../../assets/images/user.jpeg")}
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
      <HomeNavBar/>
    </View>
  );
};

export default CategoriasDeEmpresasScreen;