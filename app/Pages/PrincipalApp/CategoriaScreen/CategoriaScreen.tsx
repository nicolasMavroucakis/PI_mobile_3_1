import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import stylesCategoriaScreenStyle from "./CategoriaSrceenStyle";
import HomeScreenStyle from "../HomeScreen/HomeScreenStyle";
import ImgExemplo from "../../../../assets/images/imageExemplo.png";
import DescontoImg from "../../../../assets/images/descontoImg.png";
import HomeNavBar from "@/components/HomeNavBar";

const CategoriaScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            <ScrollView>
                <View style={stylesCategoriaScreenStyle.textTitleContainer}>
                    <Text style={stylesCategoriaScreenStyle.textTitle}>
                    Cabelereiro
                    </Text>
                </View>
                <View style={stylesCategoriaScreenStyle.containerCategorias}>
                    {Array.from({ length: 6 }).map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[HomeScreenStyle.containerDescontoDentro, { width: '45%', marginBottom: 15 }]}
                    >
                        <Image
                        source={ImgExemplo}
                        style={HomeScreenStyle.containerDescontoDentroImg}
                        resizeMode="cover"
                        />
                        <Text style={
                            stylesCategoriaScreenStyle.categoriaTouchbleOpacityText
                        }>
                        Mecanico do seu Zé
                        </Text>
                        <Text style={{
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginBottom: 15,
                        marginTop: 1
                        }}>
                        Rua das bananeiras 320, São Paulo, São Paulo
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
            <HomeNavBar/>
        </View>
    );
};

export default CategoriaScreen;