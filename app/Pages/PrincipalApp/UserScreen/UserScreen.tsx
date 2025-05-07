import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import HomeNavBar from "@/components/HomeNavBar";
import UserScreenStyle from "./UserScreenStyle";
import UserImg from "../../../../assets/images/user.jpeg";
import EngrenagemImg from "../../../../assets/images/engrenage.png";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import lapisImg from "../../../../assets/images/lapis.png";
import { collection, query, where, getDocs } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";

type RootStackParamList = {
  ClienteConfig: undefined;
  EmpresaInfoMoneyScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const db = StartFirebase();
  const [userData, setUserData] = useState<any>(null);
  const {
    nome: nomeGlobal,
    senha: senhaGlobal,
    usuarioGlobal,
    cidade: cidadeGlobal,
    endereco: enderecoGlobal,
    numero: numeroGlobal,
    numeroTelefone: telefoneGlobal,
    email: emailGlobal,
  } = useUserGlobalContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const userQuery = await getDocs(query(usersRef, where("email", "==", emailGlobal)));
        
        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          const data = userDoc.data();
          setUserData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    if (emailGlobal) {
      fetchUserData();
    }
  }, [emailGlobal]);

  const handleClickEngrenagem = () => {
    if (usuarioGlobal === "Cliente") {
      navigation.navigate("ClienteConfig");
    }
    if (usuarioGlobal === "Empresa") {
      navigation.navigate("EmpresaInfoMoneyScreen");
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
              <Image
                source={UserImg}
                style={{ width: 65, height: 65, borderRadius: "50%" }}
              />
            </View>
            <View>
              <Text style={UserScreenStyle.userName}>{nomeGlobal}</Text>
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
                  onPress={() => console.log("Editar Meus Dados")}
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
                    {userData?.endereco?.rua} {userData?.endereco?.numero} - {userData?.endereco?.cidade}
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
                  <View style={UserScreenStyle.viewImageFavoritos}>
                    <Image
                      source={UserImg}
                      style={UserScreenStyle.imageFavoritos}
                    />
                  </View>
                  <View style={UserScreenStyle.viewImageFavoritos}>
                    <Image
                      source={UserImg}
                      style={UserScreenStyle.imageFavoritos}
                    />
                  </View>
                  <View style={UserScreenStyle.viewImageFavoritos}>
                    <Image
                      source={UserImg}
                      style={UserScreenStyle.imageFavoritos}
                    />
                  </View>
                  <View style={UserScreenStyle.viewImageFavoritos}>
                    <Image
                      source={UserImg}
                      style={UserScreenStyle.imageFavoritos}
                    />
                  </View>
                  <View style={UserScreenStyle.viewImageFavoritos}>
                    <Image
                      source={UserImg}
                      style={UserScreenStyle.imageFavoritos}
                    />
                  </View>
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