import { SafeAreaView } from "react-native-safe-area-context"
import React, { useState } from 'react';
import { View, Image, Text, TextInput } from "react-native"
import stylesSingLog from "./SignLogStyle"

const LogInScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    return(
        <View style={stylesSingLog.container}>
            <View style={stylesSingLog.containerImage}>
                <Image source={require("../../../assets/images/image2.png")} style={stylesSingLog.Logo} />
            </View>
            <View style={stylesSingLog.containerInput}>
                <View style={stylesSingLog.inputContainerOneInput}>
                    <TextInput
                        style={stylesSingLog.input}
                        placeholder="Senha"
                        placeholderTextColor="#ccc"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>
        </View>
    )
}

export default LogInScreen