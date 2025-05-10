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
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
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
});

export default AdicionarServicoStyle;
