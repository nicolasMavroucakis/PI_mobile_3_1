import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const SearchScreenStyle = StyleSheet.create({
    inputBox: {
        backgroundColor: '#D9D9D9',
        height: 50, 
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    inputBoxBig: {
        width: width * 0.95
    }, 
    inputBoxSmall: {
        width: width * 0.46
    },
    ImagesTextInput: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 10
    },
    containerSmallInputs: {
        width: width * 0.95,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerAllInputs: {
        width: width, 
        height: 180,
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerCategorias: {
        width: width,
        height: height - 130,
        backgroundColor: '#323232',
        borderTopLeftRadius: 20,  
        borderTopRightRadius: 20,
    },
    containerCategoriasContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        gap: width * 0.02, 
    },
    buttonCategoria: {
        width: width * 0.46, 
        height: 55,
        borderRadius: 12, 
        justifyContent: 'space-around',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    ImagemCategoria: {
        width: 40,
        height: 40, 
        marginRight: 10
    },
    textCategoria: {
        color: '#FFF', 
        flex: 1, 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 15
    },
    TouchableOpacityPesquisa: {
        width: width * 0.95,
        height: 50,
        backgroundColor: '#00C20A',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SearchScreenStyle