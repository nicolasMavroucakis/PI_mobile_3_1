import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import StartFirebase from '@/app/crud/firebaseConfig';
import { useUserGlobalContext } from '@/app/GlobalContext/UserGlobalContext';
import EmpresaInfoMoneyScreenStyle from './EmpresaInfoMoneyScreenStyle';
import UserScreenStyle from '../../PrincipalApp/UserScreen/UserScreenStyle';
import setaImg from '../../../../assets/images/seta.png';

type RootStackParamList = {
    ConfigEmpresaInfo: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FecharAgendaDia = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    const [date, setDate] = useState(new Date());

    const handleSubmit = async () => {
        try {
            const empresasRef = collection(db, "empresas");
            const empresaQuery = await getDocs(query(empresasRef, where("userId", "==", userId)));

            if (empresaQuery.empty) {
                console.error("Empresa não encontrada");
                return;
            }

            const empresaDoc = empresaQuery.docs[0];
            const empresaId = empresaDoc.id;

            const empresaRef = doc(db, 'empresas', empresaId);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const formattedDate = localDate.toISOString().split('T')[0];

            await updateDoc(empresaRef, {
                'configuracoes.diasFeriados': arrayUnion(formattedDate)
            });

            navigation.navigate('ConfigEmpresaInfo');
        } catch (error) {
            console.error('Erro ao fechar agenda:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={EmpresaInfoMoneyScreenStyle.containerTitle}>
                <TouchableOpacity onPress={() => navigation.navigate('ConfigEmpresaInfo')}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Fechar Agenda</Text>
                <View style={{ width: 30, height: 30, marginRight: 10 }} />
            </View>

            <View style={[UserScreenStyle.containerRest, { alignItems: 'center', justifyContent: 'center' }]}>
                <View style={{ backgroundColor: '#1C1C1C', padding: 20, borderRadius: 10, width: '90%' }}>
                    <Text style={{ color: 'white', fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                        Selecione a data para fechar a agenda
                    </Text>
                    
                    <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) setDate(selectedDate);
                            }}
                            minimumDate={new Date()}
                            textColor="black"
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#00C20A',
                            padding: 15,
                            borderRadius: 8,
                            alignItems: 'center'
                        }}
                        onPress={handleSubmit}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                            Confirmar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default FecharAgendaDia; 