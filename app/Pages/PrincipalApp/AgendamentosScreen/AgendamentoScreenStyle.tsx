import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const AgendamentoScreenStyle = StyleSheet.create({
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
        height: 850,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#323232',
        paddingBottom: 30
    },
    textTitleInside: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10
    },
    AgendamentosBox:{
        width: width * 0.9,
        height: 80,
        backgroundColor: '#A5A5A5',
        borderRadius: 8, 
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    agendamentosAtivosContainer: {
        width: width,
        height: 120,
        maxHeight: 240,
        paddingBottom: 20,
        paddingTop: 20,
        gap: 10,
        marginBottom: 20
    },
    AgendamentoBoxInside: {
        width: (width * 0.9) - 10,
        height: 80 - 10,
        backgroundColor: '#D9D9D9',
        borderRadius: 8
    },
    AgendamentoHistoricoBox: {
        width: width * 0.92,
        height: 180,
        backgroundColor: '#474747',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8, // quanto maior, mais "embaixo"
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 8,
    },
    AgendamentoContainerBoxes: {
        flexDirection: 'column',
        paddingBottom: 20,
        paddingTop: 10,
        gap: 70
    },
    AgendamentoContainerInside: {
        width: width,
        height: 150,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: width * 0.04,
        gap: 30
    },
    textTitleInsideHistorico: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white'
    },
    imgHisotricoBox: {
        width: 30,
        height: 30,
        marginLeft: 10,
        marginTop: 5,
        borderRadius: '50%'
    },
    imgHisotricoBoxOutside: {
        width: width * 0.92,
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    line: {
        width: width * 0.86,
        height: 3,
        backgroundColor: '#3A3A3A',
        marginLeft: width * 0.03
    }, 
    servicosBox: {
        width: width * 0.86,
        height: 40, 
        margin: 'auto'
    },
    servicosBoxInside: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5
    },
    ballService: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TouchableOpacity: {
        width: width * 0.86,
        margin: 'auto',
        height: 20,
        alignItems: 'center'
    },
    TouchableOpacityText: {
        color: '#D03E3E',
        fontWeight: 'bold',
        fontSize: 20
    }
})

export default AgendamentoScreenStyle