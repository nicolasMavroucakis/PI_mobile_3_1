import React from "react"; // Certifique-se de importar React
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import HomeNavBar from "@/components/HomeNavBar";
import UserScreenStyle from "./UserScreenStyle";
import UserImg from "../../../../assets/images/user.jpeg";
import EngrenagemImg from "../../../../assets/images/engrenage.png";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useUserGlobalContext } from "@/app/GlobalContext/UserGlobalContext";
import lapisImg from "../../../../assets/images/lapis.png";

type RootStackParamList = {
  ClienteConfig: undefined;
  EmpresaInfoMoneyScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
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
                    {enderecoGlobal} {numeroGlobal} - {cidadeGlobal}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={UserScreenStyle.userInfo}>Celular:</Text>
                <View style={UserScreenStyle.userInfoBox}>
                  <Text style={UserScreenStyle.userInfoDentro}>
                    {telefoneGlobal}
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