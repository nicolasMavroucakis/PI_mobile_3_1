import EmpresaInfoScreenStyle from '@/app/Pages/PrincipalApp/EmpresaInfoScreen/EmpresaInfoScreenStyle';
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  return (
    <View style={[EmpresaInfoScreenStyle.styleContainerServico,{paddingLeft: 0, paddingTop: 0}]}>
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
    </View>
  );
}