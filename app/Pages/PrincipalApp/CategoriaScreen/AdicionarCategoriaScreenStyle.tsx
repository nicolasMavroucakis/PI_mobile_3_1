import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const AdicionarCategoriaStyle = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#717171',
        display: 'flex',
        flexDirection: 'column',
        height: 1100
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    width: width - 30,
    textAlign: "center",
    position: "relative",
  },
  input: {
    width: width * 0.9,
    height: 70,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#00C20A',
    backgroundColor: '#717171',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center', 
    color: '#717171',
    
  },
  botao: {
    width: width * 0.9,
    height: 70,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#00C20A',
    backgroundColor: '#00C20A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginLeft:20,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  botaoHover: {
    backgroundColor: "#4CAF50", 
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  containerTopTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width,
    height: 100
  }
});

export default AdicionarCategoriaStyle;