import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const stylesSingLog = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#717171',
        display: 'flex',
        flexDirection: 'column',
    },
    containerImage: {
        width: '100%',
        height: '30%'
    },
    Logo: {
        height: height * 0.2, 
        width: width
    },
    containerInput:{
        width: width,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#717171'
    },
    input: {
        height: 40,
        backgroundColor: '#fff',
        width: '90%'
    },
    inputContainerOneInput: {
        width: width * 0.9,
        height: 70,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#00C20A',
        backgroundColor: '#717171',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 10, 
        color: '#717171'
    },
    inpuitDeBaixo: {
        marginTop: 15
    },
    cadastreseText: {
        width: width,
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    botaoCadastro: {
        width: width * 0.9,
        height: 70,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#00C20A',
        backgroundColor: '#00C20A',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold'
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#00C20A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    botaoCrie: {
        width: width * 0.9,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#008B07',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    esqueceuSenha: {
        width: width,
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 20,
        marginTop: 10
    },
    buttonSenha: {
        paddingHorizontal: 3,
        paddingVertical: 10,
        alignItems: 'center',
    },
    Title:{
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center'
    },
    containerTitle: {
        width: width,
        height: '20%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center', 
        marginTop: '20%' 
    },
    imgTipo: {
        height: 60, 
        width: 60
    },
    imgTipoContainer: {
        width: width * 0.8,
        flex: 1
    },
    containerRegistrar:{
        width: width,
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    TouchableOpacityContainer: {
        height: 125,
        width: width * 0.5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    square: {
        width: 30,
        height: 30,
        backgroundColor: '#D9D9D9',
        borderRadius: 5
    },
    squareActive: {
        width: 30,
        height: 30,
        backgroundColor: '#03B800',
        borderRadius: 5
    },
    botaoFinal: {
        width: width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerMaisCliente: {
        height: 1100
    },
    containerTitleOther: {
        width: width,
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center', 
        marginTop: '20%' 
    }
  });

export default stylesSingLog