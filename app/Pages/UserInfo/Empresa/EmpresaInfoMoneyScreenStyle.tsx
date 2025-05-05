import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const EmpresaInfoMoneyScreenStyle = StyleSheet.create({
    containerTitle: {
        width: width,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    tamanhoImagensContainerTitle: {
        width: 30,
        height: 30,
        marginLeft: 10,
        marginRight: 10
    },
    continerAgendamentos: {
        width: width,
        height: 110,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    continerAgendamentosMetade: {
        width: width * 0.4,
        height: 110,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textAgendamentos: {
        textAlign: 'center', 
        fontSize: 21, 
        color: 'white',
        fontWeight: 'bold'
    },
    containerServicoReservado: {
        width: width,
        height: 260,
    },
    titleSecundarios: {
        width: width,
        textAlign: 'center',
        color: "#fff", 
        fontSize: 22, 
        marginBottom: 10,
        marginTop: 10,
        fontWeight: 'bold'
    },
    containerFilterEsquerda: {
        width: width * 0.4,
        height: 80,  
    },
    imgFiltros: {
        width: 40,
        height: 40,
    },
    containerFilterFiltrosEsquerda: {
        width: width * 0.4,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: 'white'
    },
    containerServicoReservadosfiltros: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    containerFilterDireita: {
        width: width * 0.4,
        height: 80
    },
    textFiltros: {
        color: '#fff',
        fontSize: 14,
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: "#0057C2",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#000",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#000000aa",
        justifyContent: "center",
        alignItems: "center",
    },
    tabelaValorResultadoFiltros: {
        width: width * 0.84,
        height: 100,
        margin: 'auto', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        marginTop: 20
    },
    tabelaValorResultadoFiltrosMenorMenor: {
        width: width * 0.42,
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderColor: 'white',
        borderWidth: 1
    },
    tabelaValorResultadoFiltrosMenor: {
        width: width * 0.42,
        height: 50, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainerOneInput: {
        width: width * 0.7,
        height: 70,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#00C20A',
        backgroundColor: '#717171',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 10, 
        color: '#717171'
    },
    contianerImgFuncionarios:{
        width: width * 0.25,
        alignItems: 'center',
    },
    imgFuncionarios: {
        width: 60,
        height: 60,
    },
    containerInputFotoFuncionarios: {
        width: width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        marginRight: 40,
    }
});

export default EmpresaInfoMoneyScreenStyle;