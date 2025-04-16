import stylesSingLog from "./SignLogStyle"
import { View, Text, TouchableOpacity, Image } from "react-native"

const SignIn = () => {
    return (
        <View style={stylesSingLog.container}>
            <View style={stylesSingLog.containerTitle}>
                <Text style={stylesSingLog.Title}>
                    Quer se registrar como:
                </Text>
            </View>
            <View>
                <TouchableOpacity>
                    <View>
                        <Image source={require("../../../assets/images/cliente.png")} style={stylesSingLog.imgTipo} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>

                </TouchableOpacity>
                <TouchableOpacity>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignIn