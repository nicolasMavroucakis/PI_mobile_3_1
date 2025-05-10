import { ScrollView, View, Image, TextInput, TouchableOpacity, Text } from "react-native"
import HomeNavBar from "@/components/HomeNavBar"
import HomeScreenStyle from "../HomeScreen/HomeScreenStyle"
import BuscaImg from "../../../../components/assets/Images/Busca.png";
import CalendarioImg from "../../../../components/assets/Images/Calendario.png";
import LocationImg from "../../../../assets/images/location.png"
import SearchScreenStyle from "./SearchScreenStyle";
import Mecanico from "../../../../assets/images/mecanico.png"
import Cabelereiro from "../../../../assets/images/cabelereiro.png"


const SearchScreen = () => {
    return(
        <View style={{flex:1}}>
            <ScrollView style={HomeScreenStyle.container}>
                <View style={SearchScreenStyle.containerAllInputs}>
                    <View style={[SearchScreenStyle.inputBox, SearchScreenStyle.inputBoxBig]}>
                        <Image source={BuscaImg} style={SearchScreenStyle.ImagesTextInput}/>
                        <TextInput style={{flex: 1}} placeholder="Pesquise serviços ou empresas" placeholderTextColor="#4F4F4F"/>
                    </View>
                    <View style={SearchScreenStyle.containerSmallInputs}>
                        <View style={[SearchScreenStyle.inputBox, SearchScreenStyle.inputBoxSmall]}>
                            <Image source={LocationImg} style={SearchScreenStyle.ImagesTextInput}/>
                            <TextInput style={{flex: 1}} placeholder="A onde?" placeholderTextColor="#4F4F4F"/>
                        </View>
                        <View style={[SearchScreenStyle.inputBox, SearchScreenStyle.inputBoxSmall]}>
                            <Image source={CalendarioImg} style={SearchScreenStyle.ImagesTextInput}/>
                            <TextInput style={{flex: 1}} placeholder="Quando?" placeholderTextColor="#4F4F4F"/>
                        </View>
                    </View>
                </View>
                <ScrollView style={SearchScreenStyle.containerCategorias}>
                    <View style={SearchScreenStyle.containerCategoriasContent}>
                        <TouchableOpacity style={[SearchScreenStyle.buttonCategoria, { backgroundColor: '#4228AD' }]}>
                            <Text style={SearchScreenStyle.textCategoria}>Mecânico</Text>
                            <Image source={Mecanico} style={SearchScreenStyle.ImagemCategoria}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[SearchScreenStyle.buttonCategoria, { backgroundColor: '#AD8928' }]}>
                            <Text style={SearchScreenStyle.textCategoria}>Cabeleireiro</Text>
                            <Image source={Cabelereiro}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[SearchScreenStyle.buttonCategoria, { backgroundColor: '#AD8928' }]}>
                            <Text style={SearchScreenStyle.textCategoria}>Cabeleireiro</Text>
                            <Image source={Cabelereiro}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[SearchScreenStyle.buttonCategoria, { backgroundColor: '#AD8928' }]}>
                            <Text style={SearchScreenStyle.textCategoria}>Cabeleireiro</Text>
                            <Image source={Cabelereiro}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[SearchScreenStyle.buttonCategoria, { backgroundColor: '#AD8928' }]}>
                            <Text style={SearchScreenStyle.textCategoria}>Cabeleireiro</Text>
                            <Image source={Cabelereiro}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[SearchScreenStyle.buttonCategoria, { backgroundColor: '#AD8928' }]}>
                            <Text style={SearchScreenStyle.textCategoria}>Cabeleireiro</Text>
                            <Image source={Cabelereiro}/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ScrollView>
            <HomeNavBar/>
        </View>
    )
}

export default SearchScreen