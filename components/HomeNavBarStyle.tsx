import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const HomeNavBarStyle = StyleSheet.create({
    containerNavBar: {
        width: width * 0.97,
        position: 'absolute',
        height: 90, 
        bottom: width * 0.03,
        left: '1.5%',
        zIndex: 100,
        backgroundColor: '#4D4D4D', 
        margin: 'auto',
        borderRadius: 12,
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center'
    }, 
    tamanhoImagem: {
        width: 60, 
        height: 60
    }, 
    tamanhoBotao: {
        width: 90,
        height: 60,
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold'
    }
})

export default HomeNavBarStyle