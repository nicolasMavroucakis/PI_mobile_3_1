import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native"
import HomeNavBar from "@/components/HomeNavBar"
import UserScreenStyle from "./UserScreenStyle"
import UserImg from "../../../../assets/images/user.jpeg"
import EngrenagemImg from "../../../../assets/images/engrenage.png"
import ClienteConfigPage from "../../UserInfo/Cliente/ClienteConfigPage"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useNavigation } from "expo-router"


type RootStackParamList = {
    ClienteConfig: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserScreen = () => {
const navigation = useNavigation<NavigationProp>();

    return(
        <View style={{ flex: 1, backgroundColor: "#000"  }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={UserScreenStyle.containerTitle}>
                    <Text style={UserScreenStyle.textTitle}>
                        Perfil
                    </Text>
                </View>
                <View style={UserScreenStyle.containerRest}>
                    <View style={UserScreenStyle.userBox}>
                        <View style={UserScreenStyle.userImage}>
                            <Image source={UserImg} style={{width: 65, height: 65, borderRadius: '50%'}}/>
                        </View>
                        <View>
                            <Text style={UserScreenStyle.userName}>
                                Heitor Miranda 
                            </Text>
                            <Text style={UserScreenStyle.userEmail}>
                                email12345@gmail.com
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ClienteConfig')}>
                            <Image source={EngrenagemImg} style={UserScreenStyle.engrenagemImg}/>
                        </TouchableOpacity>
                    </View>
                    <View style={UserScreenStyle.line}/>
                    <View style={UserScreenStyle.meusDadosContainer}>
                        <Text style={UserScreenStyle.textTitle}>
                            Meus Dados: 
                        </Text>
                        <View style={UserScreenStyle.meusDadosContainerBox}>
                            <View>
                                <Text style={UserScreenStyle.userInfo}>
                                    Endereço:
                                </Text>
                                <View style={UserScreenStyle.userInfoBox}>
                                    <Text style={UserScreenStyle.userInfoDentro}>
                                        Rua São Paulo 1234 - São Paulo ,SP
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={UserScreenStyle.userInfo}>
                                    Celular:
                                </Text>
                                <View style={UserScreenStyle.userInfoBox}>
                                    <Text style={UserScreenStyle.userInfoDentro}>
                                        Rua São Paulo 1234 - São Paulo ,SP
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={UserScreenStyle.userInfo}>
                                    Email:
                                </Text>
                                <View style={UserScreenStyle.userInfoBox}>
                                    <Text style={UserScreenStyle.userInfoDentro}>
                                        Rua São Paulo 1234 - São Paulo ,SP
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={UserScreenStyle.userInfo}>
                                    Favoritos:
                                </Text>
                                <ScrollView horizontal={true} style={UserScreenStyle.userInfoBoxFavorito}>
                                    <View style={UserScreenStyle.viewImageFavoritos}>
                                        <Image source={UserImg} style={UserScreenStyle.imageFavoritos}/>
                                    </View>
                                    <View style={UserScreenStyle.viewImageFavoritos}>
                                        <Image source={UserImg} style={UserScreenStyle.imageFavoritos}/>
                                    </View>
                                    <View style={UserScreenStyle.viewImageFavoritos}>
                                        <Image source={UserImg} style={UserScreenStyle.imageFavoritos}/>
                                    </View>
                                    <View style={UserScreenStyle.viewImageFavoritos}>
                                        <Image source={UserImg} style={UserScreenStyle.imageFavoritos}/>
                                    </View>
                                    <View style={UserScreenStyle.viewImageFavoritos}>
                                        <Image source={UserImg} style={UserScreenStyle.imageFavoritos}/>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <HomeNavBar/>
        </View>
    )
}

export default UserScreen