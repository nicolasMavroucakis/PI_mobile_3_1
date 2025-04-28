import { StyleSheet, Dimensions, ScrollView } from 'react-native';

const { height, width } = Dimensions.get('window');

const ClienteConfigPageStyle = StyleSheet.create({
    ScrollViewPrincipal: {
        width: width,
        height: 1000, 
        backgroundColor: '#000'
    },
    setaTouch: {
        width: 60,
        height: 60,
        marginLeft: 15,
        marginTop: 15
    }, 
    setaImg: {
        width: 60,
        height: 60,
    }, 
    setaView: {
        width: width,
        height: 100
    }, 
    textInputAll: {
        width: width * 0.84,
        marginLeft: width * 0.08,
        height: 60,
        backgroundColor: '#474747',
        borderRadius: 6, 
        paddingLeft: 10
    }, 
    textInput: {
        fontSize: 17, 
        color: 'white', 
        fontWeight: 'bold', 
        marginLeft: width * 0.08, 
        marginBottom: 10
    },
    salvarAlteracao: {
        width: width * 0.60, 
        height: 50,
        backgroundColor: '#00C20A',
        marginLeft: width * 0.2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    }, 
    textButtonGreen: {
        fontSize: 17, 
        color: 'white', 
        fontWeight: 'bold', 
    },
    sair: {
        width: width * 0.60, 
        height: 20,
        marginLeft: width * 0.2,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    textButtonRed: {
        fontSize: 17, 
        color: '#FF5959', 
        fontWeight: 'bold', 
    }
})

export default ClienteConfigPageStyle