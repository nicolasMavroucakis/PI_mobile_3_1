import { TouchableOpacity, View, Image, Text } from "react-native"
import HomeNavBarStyle from "./HomeNavBarStyle"
import HomeImg from "./assets/Images/Home.png"
import BuscaImg from "./assets/Images/Busca.png"
import UserImg from "./assets/Images/User.png"
import CalendarioImg from "./assets/Images/Calendario.png"

const HomeNavBar = () => {
    return(
        <View style={HomeNavBarStyle.containerNavBar}>
            <TouchableOpacity>
                <Image source={HomeImg}/>
                <Text>

                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={BuscaImg}/>
                <Text>

                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={UserImg}/>
                <Text>

                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={CalendarioImg}/>
                <Text>

                </Text>
            </TouchableOpacity>
        </View>
    )
}
export default HomeNavBar