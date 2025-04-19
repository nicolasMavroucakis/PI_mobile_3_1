import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const HomeNavBarStyle = StyleSheet.create({
    containerNavBar: {
        width: width * 0.97,
        height: 90, 
        backgroundColor: '#4D4D4D', 
        margin: 'auto',
        borderRadius: 12
    }
})

export default HomeNavBarStyle