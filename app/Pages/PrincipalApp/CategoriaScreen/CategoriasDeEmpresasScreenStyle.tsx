import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


const CategoriasDeEmpresasScreenStyle = StyleSheet.create({
    container: {
        width: width,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }, 
    conteinerDeCategorias: {
        width: width,
        height
    }
})

export default CategoriasDeEmpresasScreenStyle;