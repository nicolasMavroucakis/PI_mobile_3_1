import { ScrollView, TouchableOpacity, View, Image, Text, TextInput } from "react-native"
import ClienteConfigPageStyle from "./ClienteConfigPageStyle"
import SetaImg from "../../../../assets/images/seta.png"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";

type RootStackParamList = {
    UserScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ClienteConfigPage = () => {
    const navigation = useNavigation<NavigationProp>();

    return(
        <ScrollView style={ClienteConfigPageStyle.ScrollViewPrincipal}>
            <View style={ClienteConfigPageStyle.setaView}>
                <TouchableOpacity style={ClienteConfigPageStyle.setaTouch} onPress={() => navigation.navigate('UserScreen')}>
                    <Image source={SetaImg} style={ClienteConfigPageStyle.setaImg}/>
                </TouchableOpacity>
            </View>
            <View style={{gap: 10}}>
                <View>
                    <Text style={ClienteConfigPageStyle.textInput}>
                        Nome Completo:
                    </Text>
                    <TextInput style={ClienteConfigPageStyle.textInputAll}/>
                </View>
                <View>
                    <Text style={ClienteConfigPageStyle.textInput}>
                        Telefone
                    </Text>
                    <TextInput style={ClienteConfigPageStyle.textInputAll}/>
                </View>
                <View>
                    <Text style={ClienteConfigPageStyle.textInput}>
                        Data de nascimento
                    </Text>
                    <TextInput style={ClienteConfigPageStyle.textInputAll}/>
                </View>
                <View>
                    <Text style={ClienteConfigPageStyle.textInput}>
                        Email:
                    </Text>
                    <TextInput style={ClienteConfigPageStyle.textInputAll}/>
                </View>
                <View>
                    <Text style={ClienteConfigPageStyle.textInput}>
                        Endereço:
                    </Text>
                    <TextInput style={ClienteConfigPageStyle.textInputAll}/>
                </View>
                <TouchableOpacity style={ClienteConfigPageStyle.salvarAlteracao}>
                    <Text style={ClienteConfigPageStyle.textButtonGreen}>
                        Salvar Alterações
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={ClienteConfigPageStyle.sair}>
                    <Text style={ClienteConfigPageStyle.textButtonRed}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default ClienteConfigPage