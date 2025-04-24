import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const UserScreenStyle = StyleSheet.create({
    textTitle: {
        fontSize: 20,
        fontWeight: 'bold', 
        color: 'white'
    },
    containerTitle: {
        width: width,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerRest: {
        width: width,
        height: 750,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#323232',
        paddingBottom: 30
    }, 
    userBox: {
        width: width,
        height: 60,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    },
    userImage: {
        width: 65,
        height: 65, 
        borderRadius: '50%', 
        marginLeft: 10,
        marginTop: 10
    },
    engrenagemImg: {
        width: 45,
        height: 45
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    userEmail:{
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
    line: {
        width: width,
        height: 2, 
        backgroundColor: '#D9D9D9',
        marginTop: 20
    }, 
    meusDadosContainer: {
        width: width * 0.84, 
        marginLeft: width * 0.07,
        marginTop: width * 0.07
    },
    meusDadosContainerBox: {
        width: width * 0.70,
        marginLeft: width * 0.07, 
        backgroundColor: '#636363',
        height: 400,
        marginTop: 30, 
        borderRadius: 8
    },
    userInfo:{
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: width * 0.07,
        marginTop: 20, 
        marginBottom: 10
    },
    userInfoBox: {
        width: width * 0.65,
        height: 40, 
        backgroundColor: '#474747',
        margin: 'auto', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 4
    }, 
    userInfoDentro: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    }, 
    userInfoBoxFavorito: {
        width: width * 0.65,
        height: 90,
        backgroundColor: '#474747',
        margin: 'auto', 
        display: 'flex',
        flexDirection: 'row'
    },
    viewImageFavoritos: {
        width: 50,
        height: 50, 
        borderRadius: '50%',
        marginLeft: 10,
        marginRight: 10,
        marginTop:20
    },
    imageFavoritos: {
        width: 50, 
        height: 50,
        borderRadius: '50%'
    }
})

export default UserScreenStyle