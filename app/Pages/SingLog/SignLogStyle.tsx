import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const stylesSingLog = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#717171'
    },
    containerImage: {
        width: '100%',
        height: '40%'
    },
    Logo: {
        height: height * 0.2, 
        width: width
    },
    containerInput:{
        width: width,
        flex: 1,
        display: 'flex',
        alignItems: 'center'
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
        borderWidth: 5,
        borderColor: '#00C20A',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
  });

export default stylesSingLog