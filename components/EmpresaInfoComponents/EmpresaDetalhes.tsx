import EmpresaInfoScreenStyle from '@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle';
import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import userImg from "../../assets/images/user.jpeg"
import telefoneImg from "../assets/Images/telefone.png"
import { Touchable } from 'react-native';
import instagramImg from "../assets/Images/Instagram.png"
import InternetImg from "../assets/Images/Internet.png"
import WifiImg from "../assets/Images/Wifi.png"
import PetsImg from "../assets/Images/pets.png"
import cartoesImg from "../assets/Images/cartoes.png"
import acessivelImg from "../assets/Images/acessivel.png"

export default function App() {
  return (
    <View style={[EmpresaInfoScreenStyle.styleContainerServico,{paddingLeft: 0, paddingTop: 0, paddingBottom: 400}]}>
      <MapView
        style={EmpresaInfoScreenStyle.map}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: -23.55052, longitude: -46.633308 }}
          title="São Paulo"
          description="Marco Zero"
        />
      </MapView>
      <View style={EmpresaInfoScreenStyle.containerTudoMenosMaps}>
        <View>
          <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
            Sobre Nos
          </Text>
          <Text style={{fontSize: 12, color: 'white'}}>
            Um Lugar onde voce pode fazer os melhores serviços automotivos de santana
          </Text>
        </View>
        <View>
          <View>
            <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
              Funcionarios
            </Text>
          </View>
          <ScrollView  horizontal={true} style={EmpresaInfoScreenStyle.conteinerFuncionarios}>
            <View style={EmpresaInfoScreenStyle.funcionariosConteinerImg}>
              <Image source={userImg} style={EmpresaInfoScreenStyle.funcionariosImg}/>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>
                Jose
              </Text>
            </View>
            <View style={EmpresaInfoScreenStyle.funcionariosConteinerImg}>
              <Image source={userImg} style={EmpresaInfoScreenStyle.funcionariosImg}/>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>
                Jose
              </Text>
            </View>
            <View style={EmpresaInfoScreenStyle.funcionariosConteinerImg}>
              <Image source={userImg} style={EmpresaInfoScreenStyle.funcionariosImg}/>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>
                Jose
              </Text>
            </View>
          </ScrollView>
        </View>
        <View>
          <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
            Contato e Horario de atendimento
          </Text>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
              <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
                Segunda-Feira
              </Text>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                09:00 - 20:00
              </Text>
          </View>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
              Terça-Feira
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              09:00 - 20:00
            </Text>
          </View>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
              Quarta-Feira
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              09:00 - 20:00
            </Text>
          </View>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
              Quinta-Feira
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              09:00 - 20:00
            </Text>
          </View>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
              Sexta-Feira
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              09:00 - 20:00
            </Text>
          </View>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
              Sabado
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              09:00 - 20:00
            </Text>
          </View>
          <View style={EmpresaInfoScreenStyle.boxDiaAberto}>
            <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
              Domingo
            </Text>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              Fechado
            </Text>
          </View>
        </View>
        <View style={EmpresaInfoScreenStyle.containerPhone}>
          <View style={EmpresaInfoScreenStyle.containerPhoneLeft}>
            <Image source={telefoneImg} style={{width: 30, height: 30}}/>
            <Text style={{fontWeight:'bold', color: 'rgba(255, 255, 255, 0.6)', fontSize: 20}}>
              (11)98777-3634
            </Text>
          </View>
          <TouchableOpacity style={EmpresaInfoScreenStyle.buttonLigar}>
            <Text style={{fontSize: 15, color: 'white', fontWeight: 'bold'}}>
              Ligar
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
            Midias Sociais
          </Text>
          <View style={EmpresaInfoScreenStyle.midiasSociasButtons}>
            <TouchableOpacity style={EmpresaInfoScreenStyle.widthButton}>
              <Image source={instagramImg} style={EmpresaInfoScreenStyle.ImgMidiasSociais}/>
              <Text style={{fontSize:13, color: 'white', fontWeight:'bold'}}>
                Instagram
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={EmpresaInfoScreenStyle.widthButton}>
              <Image source={InternetImg} style={EmpresaInfoScreenStyle.ImgMidiasSociais}/>
              <Text style={{fontSize:13, color: 'white', fontWeight:'bold'}}>
                Site
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
              Comodidades
            </Text>
            <View style={EmpresaInfoScreenStyle.containerTipoComodidades}>
              <Image source={WifiImg} style={EmpresaInfoScreenStyle.imgComodidades}/>
              <Text style={EmpresaInfoScreenStyle.textComodidades}>
                Wi-Fi
              </Text>
            </View>
            <View style={EmpresaInfoScreenStyle.containerTipoComodidades}>
              <Image source={cartoesImg} style={EmpresaInfoScreenStyle.imgComodidades}/>
              <Text style={EmpresaInfoScreenStyle.textComodidades}>
                Pagamento com catão
              </Text>
            </View>
            <View style={EmpresaInfoScreenStyle.containerTipoComodidades}>
              <Image source={acessivelImg} style={EmpresaInfoScreenStyle.imgComodidades}/>
              <Text style={EmpresaInfoScreenStyle.textComodidades}>
                Acessivel para pessoas deficientes
              </Text>
            </View>
            <View style={EmpresaInfoScreenStyle.containerTipoComodidades}>
              <Image source={PetsImg} style={EmpresaInfoScreenStyle.imgComodidades}/>
              <Text style={EmpresaInfoScreenStyle.textComodidades}>
                Permitida a entrada de Pets
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}