import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const ReservaScreenStyle = StyleSheet.create({
    containerTituloPagina: {
        width: width,
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    containerSetaTituloPagina: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerReservaConfig: {
        width: width,
        height: height - 120,
    },
    containerReservaValoresTempo: {
        height: 120,
        width: width,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#323232',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },
    TocuhbleContinuar: {
        width: 130,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#008B07'
    },
    containerSelecionarFuncionario: {
        width: width,
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    containerSelecionarFuncionarioImagemTexto: {
        width: 90,
        height: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
    },
    funcionarioSelecionado: {
        backgroundColor: '#008B07',
        borderRadius: 10,
        padding: 5,
    },
    linha: {
        width: 2,
        height: 100,
        backgroundColor: 'white'
    },
    ScrollViewFuncionarios: {
        width: width,
        paddingHorizontal: 20,
    },
    containerFuncionarios: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    containerSelecionaDataEHoraEsquerda: {
        width: width * 0.45,
        marginLeft: width * 0.05,
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    containerSelecionaDataEHoraDireita: {
        width: width * 0.45,
        marginRight: width * 0.05,
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    textDataeHora: {
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#fff',
    },
    textDataeHoraEsquerda: {
        textAlign: 'left',
        marginLeft: width * 0.05
    },
    textDataeHoraDireita: {
        textAlign: 'right',
        marginRight: width * 0.05
    }
})
export default ReservaScreenStyle