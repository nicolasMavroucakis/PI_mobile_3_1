import EmpresaInfoScreenStyle from '@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
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
import estacionamentoImg from "../../assets/images/estacionamento.png"
import arCondicionadoImg from "../../assets/images/ar-condicionado.png"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import StartFirebase from "@/app/crud/firebaseConfig";
import { EmpresaContextData } from "@/app/GlobalContext/EmpresaReservaGlobalContext";

export default function EmpresaDetalhes({ empresa }: { empresa: EmpresaContextData }) {
  console.log('Empresa recebida:', empresa);
  const endereco = empresa.endereco || {};
  const userId = empresa.userId || empresa.id;

  const [coordenadas, setCoordenadas] = useState({
    latitude: -23.55052, // valor padrão (São Paulo)
    longitude: -46.633308,
  });
  const [sobreNos, setSobreNos] = useState("");
  const [funcionariosData, setFuncionariosData] = useState<{ id: string, nome: string, fotoPerfil?: string }[]>([]);
  const [horarioFuncionamento, setHorarioFuncionamento] = useState<any>({});

  useEffect(() => {
    const enderecoCompleto = `${endereco.rua || ''} ${endereco.numero || ''}, ${endereco.cidade || ''}, ${endereco.cep || ''}`;
    if (endereco.rua && endereco.cidade) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setCoordenadas({
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon),
            });
          }
        })
        .catch(err => {
          console.log("Erro ao buscar coordenadas:", err);
        });
    }

    // Buscar o campo sobre_nos e horarioFuncionamento do Firestore
    const fetchEmpresaInfo = async () => {
      const { db } = StartFirebase();
      if (!userId) return;
      const empresasRef = collection(db, "empresas");
      const q = query(empresasRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setSobreNos(data.sobre_nos || "");
        setHorarioFuncionamento(data.horarioFuncionamento || {});
      }
    };
    fetchEmpresaInfo();

    // Buscar dados dos funcionários
    const fetchFuncionarios = async () => {
      const { db } = StartFirebase();
      if (!empresa.funcionarios || empresa.funcionarios.length === 0) {
        setFuncionariosData([]);
        return;
      }
      const promises = empresa.funcionarios.map(async (funcId: string) => {
        try {
          const userRef = doc(db, "users", funcId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            return { id: funcId, nome: data.nome || "Sem nome", fotoPerfil: data.fotoPerfil || null };
          }
        } catch (e) {}
        return { id: funcId, nome: "Funcionário não encontrado", fotoPerfil: null };
      });
      const results = await Promise.all(promises);
      setFuncionariosData(results);
    };
    fetchFuncionarios();
  }, [userId, endereco.rua, endereco.numero, endereco.cidade, endereco.cep, empresa.funcionarios]);

  const getValidUrl = (url?: string) => {
    if (!url) return undefined;
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <View style={[EmpresaInfoScreenStyle.styleContainerServico,{paddingLeft: 0, paddingTop: 0, paddingBottom: 400}]}>
      <MapView
        style={EmpresaInfoScreenStyle.map}
        initialRegion={{
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: coordenadas.latitude, longitude: coordenadas.longitude }}
          title={endereco.cidade}
          description={`${endereco.rua}, ${endereco.numero}`}
        />
      </MapView>
      <View style={EmpresaInfoScreenStyle.containerTudoMenosMaps}>
        <View>
          <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
            Sobre Nos
          </Text>
          <Text style={{fontSize: 12, color: 'white'}}>
            {sobreNos || "nenhum texto sobre nos adicionado"}
          </Text>
        </View>
        <View>
          <View>
            <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
              Funcionarios
            </Text>
          </View>
          <ScrollView horizontal={true} style={EmpresaInfoScreenStyle.conteinerFuncionarios}>
            {funcionariosData.length > 0 ? (
              funcionariosData.map((func, idx) => (
                <View key={func.id} style={EmpresaInfoScreenStyle.funcionariosConteinerImg}>
                  <Image
                    source={func.fotoPerfil ? { uri: func.fotoPerfil } : userImg}
                    style={EmpresaInfoScreenStyle.funcionariosImg}
                  />
                  <Text style={{fontSize: 10, fontWeight: 'bold', color: 'white'}}>
                    {func.nome.split(' ')[0]}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{color: 'white', fontSize: 15}}>Nenhum funcionário cadastrado</Text>
            )}
          </ScrollView>
        </View>
        <View>
          <Text style={EmpresaInfoScreenStyle.tituloDetalhe}>
            Horário de Atendimento
          </Text>
          {[
            { key: 'segunda', label: 'Segunda-Feira' },
            { key: 'terca', label: 'Terça-Feira' },
            { key: 'quarta', label: 'Quarta-Feira' },
            { key: 'quinta', label: 'Quinta-Feira' },
            { key: 'sexta', label: 'Sexta-Feira' },
            { key: 'sabado', label: 'Sábado' },
            { key: 'domingo', label: 'Domingo' },
          ].map(dia => {
            const info = horarioFuncionamento[dia.key];
            if (!info) return null;
            return (
              <View key={dia.key} style={EmpresaInfoScreenStyle.boxDiaAberto}>
                <Text style={{color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold'}}>
                  {dia.label}
                </Text>
                {info.aberto ? (
                  <View>
                    {info.horarios && info.horarios.length > 0 ? (() => {
                      const inicios = info.horarios.map((h: any) => h.inicio).filter(Boolean);
                      const fins = info.horarios.map((h: any) => h.fim).filter(Boolean);
                      const menorInicio = inicios.length > 0 ? inicios.sort()[0] : '--:--';
                      const maiorFim = fins.length > 0 ? fins.sort().sort()[1] : '--:--';
                      return (
                        <Text style={{color: 'white', fontWeight: 'bold'}}>
                          {menorInicio} - {maiorFim}
                        </Text>
                      );
                    })() : (
                      <Text style={{color: 'white', fontWeight: 'bold'}}>Sem horário</Text>
                    )}
                  </View>
                ) : (
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Fechado</Text>
                )}
              </View>
            );
          })}
        </View>
        <View style={EmpresaInfoScreenStyle.containerPhone}>
          <View style={EmpresaInfoScreenStyle.containerPhoneLeft}>
            <Image source={telefoneImg} style={{width: 30, height: 30}}/>
            <Text style={{fontWeight:'bold', color: 'rgba(255, 255, 255, 0.6)', fontSize: 20}}>
              {empresa.telefone || '(00)00000-0000'}
            </Text>
          </View>
          <TouchableOpacity
            style={EmpresaInfoScreenStyle.buttonLigar}
            onPress={() => {
              if (empresa.telefone) {
                Linking.openURL(`tel:${empresa.telefone.replace(/[^0-9]/g, '')}`);
              }
            }}
          >
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
            <TouchableOpacity
              style={EmpresaInfoScreenStyle.widthButton}
              onPress={() => {
                console.log('Instagram link bruto:', empresa.linkInstagram);
                const url = getValidUrl(empresa.linkInstagram);
                console.log('Instagram link final:', url);
                if (url) {
                  Linking.openURL(url)
                    .then(() => console.log('Abriu Instagram:', url))
                    .catch((err) => {
                      console.log('Erro ao abrir Instagram:', err);
                      alert('Não foi possível abrir o Instagram');
                    });
                } else {
                  console.log('URL do Instagram inválida');
                }
              }}
            >
              <Image source={instagramImg} style={EmpresaInfoScreenStyle.ImgMidiasSociais}/>
              <Text style={{fontSize:13, color: 'white', fontWeight:'bold'}}>
                Instagram
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={EmpresaInfoScreenStyle.widthButton}
              onPress={() => {
                console.log('Site link bruto:', empresa.linkSite);
                const url = getValidUrl(empresa.linkSite);
                console.log('Site link final:', url);
                if (url) {
                  Linking.openURL(url)
                    .then(() => console.log('Abriu site:', url))
                    .catch((err) => {
                      console.log('Erro ao abrir site:', err);
                      alert('Não foi possível abrir o site');
                    });
                } else {
                  console.log('URL do site inválida');
                }
              }}
            >
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
            <View style={EmpresaInfoScreenStyle.containerTipoComodidades}>
              <Image source={estacionamentoImg} style={EmpresaInfoScreenStyle.imgComodidades}/>
              <Text style={EmpresaInfoScreenStyle.textComodidades}>
                Estacionamento
              </Text>
            </View>
            <View style={EmpresaInfoScreenStyle.containerTipoComodidades}>
              <Image source={arCondicionadoImg} style={EmpresaInfoScreenStyle.imgComodidades}/>
              <Text style={EmpresaInfoScreenStyle.textComodidades}>
                Ar-condicionado
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}