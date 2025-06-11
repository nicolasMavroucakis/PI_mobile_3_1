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
    justifyContent: 'flex-end',
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
    width: width * 0.3333,
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
  },
  funcionariosImg: {
    width: 50,
    height: 50,
    borderRadius: '50%'
  },
  funcionariosConteinerImg: {
    marginTop: 10,
    width: 60,
    height: 60,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    gap: 10
  },
  conteinerFuncionarios: {
    width: width,
    height: 80,
    gap: 30,
    display: 'flex',
  },
  tituloDetalhe:{
    fontSize:20,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10
  },
  containerTudoMenosMaps: {
    width: width * 0.9,
    margin: 'auto'
  },
  boxDiaAberto:{
    width: width * 0.9,
    height: 25,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerPhone: {
    width: width * 0.9,
    height: 60,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#656565',
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  containerPhoneLeft: {
    width: width * 0.6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-around',
    alignItems: 'center'
  },
  buttonLigar: {
    width: width * 0.2,
    height: 40,
    borderRadius: 8,
    borderColor: '#656565',
    borderWidth: 2,
    justifyContent:'center',
    alignItems: 'center',
    marginRight: 10
  },
  ImgMidiasSociais: {
    width: 50,
    height: 50
  },
  midiasSociasButtons:{
    width: width * 0.9,
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-around'
  },
  widthButton:{
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  imgComodidades: {
    width: 30,
    height: 30
  },
  textComodidades: {
    fontSize:13,
    color: 'white',
    fontWeight: 'bold'
  },
  containerTipoComodidades: {
    width: width * 0.9,
    height: 50,
    marginLeft: width * 0.025,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.5,  
    marginLeft: width * 0.09
  },
  ratingLabel: {
    width: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  barContainer: {
    width: width * 0.7,
    alignSelf: 'center',
    marginVertical: 4,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#D17A00',
  },
  ratingCount: {
    width: 30,
    color: 'white',
    textAlign: 'right',
  },
  totalAvaliacoes: {
    width: width * 0.9,
    height: 20,
    marginLeft: width * 0.025, 
    textAlign: 'center',
    color: "white", 
    marginBottom: 10
  },
  numeroTotalAvalaiações: {
    flexDirection: "row", 
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.9,
    height: 50,
    marginLeft: width * 0.025, 
  },
  userImg:{ 
    width:40,
    height: 40,
    borderRadius: '50%',
    marginRight: 10
  },
  containerUserImageName: {
    width: width * 0.8,
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  containerAvalaicaoUser: {
    width: width * 0.8,
    flexGrow: 1,
    margin: 'auto',
    backgroundColor: '#252525'
  },
  textInformationUser:{
    fontSize: 13,
    fontWeight: 'bold'
  },
  containerTudoAvalaicao: {
    width: width * 0.9,
    marginLeft: width * 0.025
  },
  textDaAvalaicao: {
    fontSize: 15,
    color: 'white',
    marginTop: 15, 
    width: width * 0.9
  },
  containerMembroServico: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5
  }
});

export default EmpresaInfoScreenStyle;