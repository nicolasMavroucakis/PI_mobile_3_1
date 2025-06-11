import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const AdicionarServicoStyle = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#717171',
  },

  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    alignSelf: "center",
  },

  input: {
    borderWidth: 2,
    borderColor: "#00C20A",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: "#00C20A",
    fontSize: 16,
   height: 70,
  },

  linkTexto: {
    textAlign: "right",
    color: "#fff",
    fontSize: 15,
    marginBottom: 20,
    marginTop: 10,
  },

  subtitulo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: 'center',
  },

  linha: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  metade: {
    width: (width - 50) / 2,
    height: 70,
    
  },

  textDescricao: {
    height: 180,
    textAlignVertical: "top",
    width: 387,
  },

  textArea: {
    height: 180,
    textAlignVertical: "top",
    width: 387,
  },

  botao: {
    backgroundColor: "#00C20A",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
  },
  containerTituloPagina: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainerTwoInputs: {
    width: width * 0.43,
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
  containerTipoServico: {
    width: width * 0.9,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 110,
    marginTop: 20,
    marginBottom: 20,
  },
  botaoTipoServico: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'trasparent',
  },
  containerTipoServicoMetade: {
    width: width * 0.43,
    height: 80,
    alignItems: 'center',
    gap: 20
  },
  inputContainerBig: {
    width: width * 0.9, // Garante que o container ocupe toda a largura disponível
    height: 170,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#00C20A",
    backgroundColor: "#717171",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Garante que o conteúdo não ultrapasse os limites
  },
  selectButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00C20A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default AdicionarServicoStyle;
