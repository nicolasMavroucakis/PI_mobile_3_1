import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const EmpresaInfoScreenStyle = StyleSheet.create({
  principalImage: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginTop: 16,
    marginLeft: 16
  },
  containerAvaliacao: {
    position: 'absolute',
    top: 25,
    right: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avaliacaoNota: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  avaliacaoTexto: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  imgComp: {
    width: 30,
    height: 30,
  },
  containerFavoritoCompText: {
    width: width,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 16
  },
  containerFavoritoComp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    height: 60,
    gap: 20,
  },
  containerText: {
    display: 'flex',
    alignItems: 'center',
    width: width * 0.6,
    height: 60,
  },
  empresa: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    paddingBottom: 5,
  },
  empresaMenor: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'white',
  },
  tipoPagEmpresa: {
    width: width,
    height: 40,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  tepoPagEmpresaColor: {
    backgroundColor: '#252525',
  },
  tipoPagEmpresaButton: {
    width: width * 0.25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textPag: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  arrowImage: {
    width: 30,
    height: 30,
    left: -36,
  },
  moduloServico: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  moduloServicoButton: {
    width: width,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgDentroServico: {
    width: 40, 
    height: 40, 
    borderRadius: 4
  },
  styleContainerServico: {
    width: width,
    minHeight: 500,
    backgroundColor: '#252525',
    paddingLeft: 16,
    paddingTop: 10,
    flexGrow: 1
  },
  titleDentroServico: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2
  },
  subtitleDentroServico: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13
  },
  servicoContainer: {
    width: width * 0.86,
    display: 'flex',
    flexDirection: 'row'
  },
  servicoContainerText: {
    width: width * 0.56,
    alignItems:'flex-start',
    gap: 5
  },
  servicoContainerReserva: {
    width: width * 0.36,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 15
  },
  moduloContainer: {
    marginTop: 10,
    backgroundColor: '#252525'
  },
  buttonReservar: {
    width: 80,
    height: 30,
    alignItems: 'center',
    backgroundColor: '#00C20A',
    justifyContent: 'center',
    borderRadius: 4
  },
  containerTextPrice: {
    width: 100,
    alignItems: 'flex-end'
  },
  line:{
    width: width * 0.85,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: width * 0.037,
    marginTop: 10,
    marginBottom: 10
  },
  buttonPagSelecionada: {
    backgroundColor: '#252525',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12
  },
  containerCartaoPresente: {
    width: width * 0.9,
    height: 200,
    borderRadius: 12,
    margin: 'auto',
    marginTop: 0,
    marginBottom: 10
  },
  textoMenorCartaoPresente: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  containerCartaoPresenteImg: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    marginBottom: 5
  },
  textoDinheiroCartaoPresente: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold'
  },
  boxPrecoCartaoPresente: {
    width: (width * 0.9) - 10,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  boxPreco: {
    width: 150,
    height: 47,
    alignItems: 'flex-end',
  },
  boxServicoCartaoPresente: {
    height: 97,
    width: (width * 0.9) - 10,
    justifyContent: 'center'
  },
  containerCartaoPresenteImagem: {
    width: (width * 0.9) - 10,
    height: 47,
    justifyContent:'flex-start',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row', 
    gap: 10
  },
  textValePresente: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
  textServicoValePresente: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  map: {
    width: width,
    height: 250,
  }
});

export default EmpresaInfoScreenStyle;