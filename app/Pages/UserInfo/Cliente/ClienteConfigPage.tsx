import { ScrollView, TouchableOpacity, View, Image, Text, TextInput } from "react-native"
import ClienteConfigPageStyle from "./ClienteConfigPageStyle"
import SetaImg from "../../../../assets/images/seta.png"

const ClienteConfigPage = () => {
    return(
        <ScrollView style={ClienteConfigPageStyle.ScrollViewPrincipal}>
            <View style={ClienteConfigPageStyle.setaView}>
                <TouchableOpacity style={ClienteConfigPageStyle.setaTouch}>
                    <Image source={SetaImg} style={ClienteConfigPageStyle.setaImg}/>
                </TouchableOpacity>
            </View>
            <View>
                <View>
                    <Text style={ClienteConfigPageStyle.textInput}>
                        Nome Completo:
                    </Text>
                    <TextInput style={ClienteConfigPageStyle.textInputAll}/>
                </View>
            </View>
        </ScrollView>
    )
}

export default ClienteConfigPage