import React, { useState } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import EmpresaInfoScreenStyle from "@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle";
import imageExp from "../../assets/images/imageExemplo.png"

const EmpresaServicos = () => {
  const [exibirView, setExibirView] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleTouchableOpacityPress = () => {
    setExibirView(!exibirView);
    setRotation(prevRotation => prevRotation + 180);
  };

  const arrowStyle = {
    ...EmpresaInfoScreenStyle.arrowImage,
    transform: [{ rotate: `${rotation}deg` }],
  };

  return (
    <View style={EmpresaInfoScreenStyle.styleContainerServico}>
      <TouchableOpacity
        onPress={handleTouchableOpacityPress}
        style={EmpresaInfoScreenStyle.moduloServicoButton}
      >
        <Text style={EmpresaInfoScreenStyle.moduloServico}>Manuteção Preventiva</Text>
        <Image source={require("../assets/Images/Arrow.png")} style={arrowStyle} />
      </TouchableOpacity>
      {exibirView && (
        <View style={EmpresaInfoScreenStyle.moduloContainer}>
            <View style={EmpresaInfoScreenStyle.servicoContainer}>
                <View style={EmpresaInfoScreenStyle.servicoContainerText}>
                    <Text style={EmpresaInfoScreenStyle.titleDentroServico}>
                        Vistoria pré-compra
                    </Text>
                    <Text style={EmpresaInfoScreenStyle.subtitleDentroServico}>
                        Realizamos uma avaliação completa do veículo antes da compra...
                    </Text>
                    <View>
                        <Image source={imageExp} style={EmpresaInfoScreenStyle.imgDentroServico}/>
                    </View>
                </View>
                <View style={EmpresaInfoScreenStyle.servicoContainerReserva}>
                    <TouchableOpacity style={EmpresaInfoScreenStyle.buttonReservar}>
                        <Text  style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
                            Reservar
                        </Text>
                    </TouchableOpacity>
                    <View style={EmpresaInfoScreenStyle.containerTextPrice}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
                            R$ 120,00
                        </Text>
                        <Text style={{color: 'rgba(255, 255, 255, 0.65)', fontWeight: 'bold', fontSize: 10}}>
                            1h
                        </Text>
                    </View>
                </View>
            </View> 
        </View>
      )}
    </View>
  );
};

export default EmpresaServicos;
