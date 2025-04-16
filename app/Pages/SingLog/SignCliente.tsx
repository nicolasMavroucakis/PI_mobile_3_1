import { TextInput, View, Text, TouchableOpacity, ScrollView } from "react-native"
import stylesSingLog from "./SignLogStyle"
import { useState } from "react"
import { useNavigation } from '@react-navigation/native'

const SignCliente = () => {
    const navigation = useNavigation();
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')
    const [email, setEmail] = useState('')
    const [cep, setCep] = useState('')
    const [cidade, setCidade] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')

    const handleCadastro = () => {
        navigation.navigate("SignIn"); 
    };

    return (
        <ScrollView style={[stylesSingLog.container, stylesSingLog.containerMaisCliente]}>
            <View style={[stylesSingLog.container, stylesSingLog.containerMaisCliente]}>
                <View style={stylesSingLog.containerTitleOther}>
                    <Text style={stylesSingLog.Title}>
                        Adicione suas Informações
                    </Text>
                </View>
                <View style={stylesSingLog.containerInput}>
                    {[
                        { label: 'Email', value: email, set: setEmail },
                        { label: 'Senha', value: senha, set: setSenha, secure: true },
                        { label: 'Nome Completo', value: nome, set: setNome },
                        { label: 'CEP', value: cep, set: setCep },
                        { label: 'Cidade', value: cidade, set: setCidade },
                        { label: 'Rua', value: rua, set: setRua },
                        { label: 'Numero', value: numero, set: setNumero },
                        { label: 'Complemento', value: complemento, set: setComplemento },
                    ].map((input, index) => (
                        <View
                            key={index}
                            style={[
                                stylesSingLog.inputContainerOneInput,
                                { backgroundColor: 'transparent' },
                                stylesSingLog.inpuitDeBaixo
                            ]}
                        >
                            <Text style={{ color: '#00C20A' }}>{input.label}</Text>
                            <TextInput
                                style={[stylesSingLog.input, { backgroundColor: 'transparent' }]}
                                placeholder=""
                                placeholderTextColor="#ccc"
                                secureTextEntry={input.secure}
                                value={input.value}
                                onChangeText={input.set}
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={stylesSingLog.botaoCadastro} onPress={handleCadastro}>
                        <Text style={stylesSingLog.botaoTexto}>Entre</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SignCliente;