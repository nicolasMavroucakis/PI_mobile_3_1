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
    },
    ContainerCalendario: {
        width: width,
        backgroundColor: '#f5f5f0',
        marginTop: 20,
        paddingBottom: 20,
        flex: 1,
        minHeight: height - 300
    },
    linhaEntreHorarios: {
        height: 1,
        width: width - 40,
        backgroundColor: '#e0e0e0',
        zIndex: 1,
    },
    containerHoraLinha: {
        width: width,
        height: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        zIndex: 1,
    },
    espacoParaAgendamentos: {
        minHeight: 80,
        marginLeft: 40,
        flexDirection: 'row',
        paddingRight: 10,
        zIndex: 2,
    },
    boxAgendamento: {
        width: width - 60,
        backgroundColor: '#00C20A',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
        zIndex: 2,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    textAgendamento: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4
    },
    containerTextAgendamento: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default ReservaScreenStyle;