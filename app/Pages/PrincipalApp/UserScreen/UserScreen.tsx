import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import HomeNavBar from "@/components/HomeNavBar";
import UserScreenStyle from "./UserScreenStyle";
import EngrenagemImg from "../../../../assets/images/engrenage.png";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import { useEmpresaContext } from "@/app/GlobalContext/EmpresaReservaGlobalContext";
import lapisImg from "../../../../assets/images/lapis.png";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import defaultProfileImg from "../../../../assets/images/user.jpeg";
import ProfileImage from "@/components/ProfileImage";

interface EmpresaData {
  userId: string;
  fotoPerfil?: string;
  nome?: string;
}

type RootStackParamList = {
  ClienteConfig: undefined;
  EmpresaInfoMoneyScreen: undefined;
  ChangeEmpresaInfo: undefined;
  EmpresaInfoScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserScreen: React.FC = () => {
  const { db } = StartFirebase();
  const navigation = useNavigation<NavigationProp>();
  const [userData, setUserData] = useState<any>(null);
  const [favoritos, setFavoritos] = useState<{ id: string; foto: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setAll } = useEmpresaContext();
  const {
    nome: nomeGlobal,
    senha: senhaGlobal,
    usuarioGlobal,
    cidade: cidadeGlobal,
    endereco: enderecoGlobal,
    numero: numeroGlobal,
    numeroTelefone: telefoneGlobal,
    email: emailGlobal,
    id: userId,
    fotoPerfil: fotoPerfilGlobal
  } = useUserGlobalContext();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      console.log("Buscando dados para userId:", userId);
      const userGlobalRef = doc(db, "users", userId);
      const userGlobalSnap = await getDoc(userGlobalRef);
      
      if (userGlobalSnap.exists()) {
        const userData = userGlobalSnap.data();
        console.log("Dados do usuário:", userData);
        console.log("Favoritos:", userData.favoritos);
        
        setUserData(userData);
        setFavoritos(userData.favoritos || []);
      } else {
        console.log("Usuário não encontrado");
        setFavoritos([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("Iniciando busca para userId:", userId);
      fetchUserData();
    }
  }, [userId]);

  const handleClickEngrenagem = () => {
    if (usuarioGlobal === "Cliente") {
      navigation.navigate("ClienteConfig");
    }
    if (usuarioGlobal === "Empresa") {
      navigation.navigate("EmpresaInfoMoneyScreen");
    }
  };

  const handleEmpresaClick = async (empresa: EmpresaData) => {
    try {
      console.log("Buscando empresa com ID:", empresa.userId);
      const empresasRef = collection(db, "empresas");
      const empresaDoc = await getDoc(doc(db, "empresas", empresa.userId));
      
      if (empresaDoc.exists()) {
        const empresaData = empresaDoc.data();
        
        // Buscar dados do usuário para pegar a foto de perfil e endereço
        const usersRef = collection(db, "users");
        const userDoc = await getDocs(query(usersRef, where("__name__", "==", empresaData.userId)));
        const userData = userDoc.docs[0]?.data() || {};
        const fotoPerfil = userData.fotoPerfil || empresa.fotoPerfil || '';
        const enderecoData = userData.endereco || {};
        
        console.log("Dados brutos do Firebase:", empresaData);
        console.log("Dados do usuário:", userData);
        console.log("Dados do endereço:", enderecoData);
        
        const dadosAtualizados = {
          id: empresaDoc.id,
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

        console.log("Dados atualizados da empresa:", dadosAtualizados);
        setAll(dadosAtualizados);
        navigation.navigate('EmpresaInfoScreen');
      } else {
        console.error("Empresa não encontrada");
      }
    } catch (error) {
      console.error("Erro ao buscar dados da empresa:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={UserScreenStyle.containerTitle}>
          <Text style={UserScreenStyle.textTitle}>Perfil</Text>
        </View>
        <View style={UserScreenStyle.containerRest}>
          <View style={UserScreenStyle.userBox}>
            <View style={UserScreenStyle.userImage}>
              {userId ? (
                <ProfileImage 
                  userId={userId}
                  size={65}
                  onImageUpdate={fetchUserData}
                  initialImageUrl={fotoPerfilGlobal}
                />
              ) : (
                <Image 
                  source={defaultProfileImg}
                  style={[
                    UserScreenStyle.userImage,
                    { width: 65, height: 65, borderRadius: 32.5 }
                  ]}
                />
              )}
            </View>
            <View>
              <Text style={UserScreenStyle.userName}>
                {nomeGlobal
                  ? nomeGlobal.split(' ').length > 1
                    ? nomeGlobal.split(' ')[0] + ' ' + nomeGlobal.split(' ').slice(-1)
                    : nomeGlobal
                  : ''}
              </Text>
              <Text style={UserScreenStyle.userEmail}>
                {emailGlobal}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClickEngrenagem}>
              <Image
                source={EngrenagemImg}
                style={UserScreenStyle.engrenagemImg}
              />
            </TouchableOpacity>
          </View>
          <View style={UserScreenStyle.line} />
          <View style={UserScreenStyle.meusDadosContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                ...(usuarioGlobal === "Empresa" && {
                  justifyContent: "space-between",
                }),
              }}
            >
              <Text style={UserScreenStyle.textTitle}>Meus Dados:</Text>
              {usuarioGlobal === "Empresa" && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ChangeEmpresaInfo")}
                >
                  <Image source={lapisImg} style={UserScreenStyle.lapisImg} />
                </TouchableOpacity>
              )}
            </View>
            <View style={UserScreenStyle.meusDadosContainerBox}>
              <View>
                <Text style={UserScreenStyle.userInfo}>Endereço:</Text>
                <View style={UserScreenStyle.userInfoBox}>
                  <Text style={UserScreenStyle.userInfoDentro}>
                    {enderecoGlobal} {numeroGlobal} - {cidadeGlobal}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={UserScreenStyle.userInfo}>Celular:</Text>
                <View style={UserScreenStyle.userInfoBox}>
                  <Text style={UserScreenStyle.userInfoDentro}>
                    {userData?.telefone || telefoneGlobal}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={UserScreenStyle.userInfo}>Email:</Text>
                <View style={UserScreenStyle.userInfoBox}>
                  <Text style={UserScreenStyle.userInfoDentro}>
                    {emailGlobal}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={UserScreenStyle.userInfo}>Favoritos:</Text>
                <ScrollView
                  horizontal={true}
                  style={UserScreenStyle.userInfoBoxFavorito}
                >
                  {isLoading ? (
                    <Text style={{ color: 'white' }}>Carregando favoritos...</Text>
                  ) : favoritos.length > 0 ? (
                    favoritos.map((fav, idx) => (
                      <View key={fav.id} style={UserScreenStyle.viewImageFavoritos}>
                        <TouchableOpacity onPress={() => handleEmpresaClick({ userId: fav.id, fotoPerfil: fav.foto })}>
                          <Image
                            source={fav.foto ? { uri: fav.foto } : defaultProfileImg}
                            style={[
                              UserScreenStyle.imageFavoritos,
                              { width: 50, height: 50, borderRadius: 25 }
                            ]}
                            onError={(e) => console.log("Erro ao carregar imagem:", fav.foto)}
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <View style={UserScreenStyle.viewImageFavoritos}>
                      <Image
                        source={defaultProfileImg}
                        style={[
                          UserScreenStyle.imageFavoritos,
                          { width: 50, height: 50, borderRadius: 25 }
                        ]}
                      />
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <HomeNavBar />
    </View>
  );
};

export default UserScreen;