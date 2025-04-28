import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const stylesCategoriaScreenStyle = StyleSheet.create({
    textTitle: {
        fontSize: 23,
        color: 'white',
        fontWeight: 'bold'
    },
    textTitleContainer: {
        width: width,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerCategorias: {
        minHeight: 1000,
        width: width,
        backgroundColor: '#323232',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems:'center'
    },
    categoriaTouchbleOpacityText:{
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10
    }
});

export default stylesCategoriaScreenStyle;