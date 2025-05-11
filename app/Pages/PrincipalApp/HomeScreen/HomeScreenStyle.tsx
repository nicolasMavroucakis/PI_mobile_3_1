import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage } from "react-native-responsive-fontsize";

const { height, width } = Dimensions.get('window');

const HomeScreenStyle = StyleSheet.create({
    container:{
        width: width,
        backgroundColor: '#000000'
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    }, 
    topNav: {
        width: width,
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itensTop: {
        width: width * 0.33,
    },
    topPageCategorias: {
        width: width,
        height: 200
    },
    topPageCategoriasContainer: {
        width: width,
        height: 90,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    topPageCategoriasContainerButton: {
        width: width * 0.2,
        backgroundColor: '#373737',
        height: 80,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    MeusAgendamentosInput: {
        width: width * 0.92,
        height: 100,
        backgroundColor: '#A5A5A5',
        borderRadius: 10,
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    MeusAgendamentosInputDentro: {
        width: (width * 0.92) - 10, 
        height: 100 - 10,          
        backgroundColor: '#D9D9D9', 
        borderRadius: 8,            
        alignSelf: 'center',        
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    containersDentroAgendamento: {
        width: width * 0.306,
        flex: 1,
        justifyContent: 'center',
    },
    containersDentroAgendamentoLocHora: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    containerMeusAgendamentos:{
        width: width,
        height: 210
    },
    containerUltimosServicos: {
        width: width * 0.9,
        height: 120,
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto'
    },
    containerUltimosServicosDentro: {
        width: 80,
        height: 110, 
        backgroundColor: '#373737',
        borderRadius: 15, 
        marginRight: 10
    },
    ImgUltServi: {
        width: 40,
        height: 40,
        borderRadius: 30,
        marginTop: 15
    }, 
    ImgUltServiView: {
        width: 80,
        height: 55,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerDesconto: {
        width: width * 0.95,
        flexDirection: 'row',
        flexWrap: 'wrap', // <-- ESSENCIAL para quebrar linha
        justifyContent: 'space-around',
        alignSelf: 'center', // ou marginHorizontal: 'auto' pra centralizar
        paddingBottom: 200
    },
    containerDescontoDentro: {
        width: width * 0.43,
        height: 300, 
        marginBottom: 40
    },
    containerDescontoDentroImg: {
        width: width * 0.40,
        aspectRatio: 0.9, // exemplo: largura 1.5x maior que a altura
        resizeMode: 'cover', // opcional, para o ajuste da imagem
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto'
    },
    descontoContainer: {
        width:width * 0.4, 
        height: 30,
        backgroundColor: '#006E21',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        margin: 'auto'
    }
})

export default HomeScreenStyle