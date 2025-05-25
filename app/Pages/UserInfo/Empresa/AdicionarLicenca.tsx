import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import StartFirebase from '@/app/crud/firebaseConfig';
import { useUserGlobalContext } from '@/app/GlobalContext/UserGlobalContext';
import EmpresaInfoMoneyScreenStyle from './EmpresaInfoMoneyScreenStyle';
import UserScreenStyle from '../../PrincipalApp/UserScreen/UserScreenStyle';
import setaImg from '../../../../assets/images/seta.png';

type RootStackParamList = {
    ConfigEmpresaInfo: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Funcionario {
    id: string;
    nome: string;
}

const AdicionarLicenca = () => {
    const navigation = useNavigation<NavigationProp>();
    const { db } = StartFirebase();
    const { id: userId } = useUserGlobalContext();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [selectedFuncionario, setSelectedFuncionario] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [motivo, setMotivo] = useState('');

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                // Buscar a empresa pelo userId
                const empresasRef = collection(db, "empresas");
                const empresaQuery = await getDocs(query(empresasRef, where("userId", "==", userId)));

                if (empresaQuery.empty) {
                    console.error("Empresa não encontrada");
                    return;
                }

                const empresaDoc = empresaQuery.docs[0];
                const funcionariosIds = empresaDoc.data().funcionarios || [];
                const funcionariosData: Funcionario[] = [];

                for (const id of funcionariosIds) {
                    const funcDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", id)));
                    if (!funcDoc.empty) {
                        const funcionarioData = funcDoc.docs[0].data();
                        funcionariosData.push({
                            id: funcDoc.docs[0].id,
                            nome: funcionarioData.nome
                        });
                    }
                }

                setFuncionarios(funcionariosData);
                if (funcionariosData.length > 0) {
                    setSelectedFuncionario(funcionariosData[0].id);
                }
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
            }
        };

        fetchFuncionarios();
    }, [db, userId]);

    const handleSubmit = async () => {
        if (!selectedFuncionario) return;

        try {
            const funcionarioRef = doc(db, 'users', selectedFuncionario);
            const localStartDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
            const localEndDate = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);
            
            const licencaPeriodo = {
                inicio: localStartDate.toISOString().split('T')[0],
                fim: localEndDate.toISOString().split('T')[0],
                motivo: motivo || 'Não especificado'
            };

            await updateDoc(funcionarioRef, {
                licencas: arrayUnion(licencaPeriodo)
            });

            navigation.navigate('ConfigEmpresaInfo');
        } catch (error) {
            console.error('Erro ao adicionar licença:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <View style={EmpresaInfoMoneyScreenStyle.containerTitle}>
                <TouchableOpacity onPress={() => navigation.navigate('ConfigEmpresaInfo')}>
                    <Image source={setaImg} style={EmpresaInfoMoneyScreenStyle.tamanhoImagensContainerTitle} />
                </TouchableOpacity>
                <Text style={UserScreenStyle.textTitle}>Adicionar Licença</Text>
                <View style={{ width: 30, height: 30, marginRight: 10 }} />
            </View>

            <View style={[UserScreenStyle.containerRest, { alignItems: 'center', justifyContent: 'center' }]}>
                <View style={{ backgroundColor: '#1C1C1C', padding: 20, borderRadius: 10, width: '90%' }}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            backgroundColor: '#333',
                            padding: 15,
                            borderRadius: 8,
                            marginBottom: 20
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            {funcionarios.find(f => f.id === selectedFuncionario)?.nome || 'Selecione um funcionário'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>Motivo da Licença</Text>
                    <View style={{
                        backgroundColor: '#333',
                        borderRadius: 8,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: '#00C20A'
                    }}>
                        <TextInput
                            style={{
                                color: 'white',
                                padding: 10,
                                height: 100,
                                textAlignVertical: 'top'
                            }}
                            placeholder="Digite o motivo da licença"
                            placeholderTextColor="#666"
                            multiline
                            value={motivo}
                            onChangeText={setMotivo}
                        />
                    </View>

                    <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>Data de Início</Text>
                    <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) setStartDate(selectedDate);
                            }}
                            minimumDate={new Date()}
                            textColor="black"
                        />
                    </View>

                    <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>Data de Fim</Text>
                    <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) setEndDate(selectedDate);
                            }}
                            minimumDate={startDate}
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

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={EmpresaInfoMoneyScreenStyle.modalContainer}>
                    <View style={EmpresaInfoMoneyScreenStyle.modalContent}>
                        <Text style={EmpresaInfoMoneyScreenStyle.modalTitle}>
                            Selecione o funcionário
                        </Text>
                        <View style={{ backgroundColor: '#f0f0f0', borderRadius: 8, width: '100%' }}>
                            <Picker
                                selectedValue={selectedFuncionario}
                                onValueChange={(itemValue) => {
                                    setSelectedFuncionario(itemValue);
                                    setModalVisible(false);
                                }}
                            >
                                {funcionarios.map((funcionario) => (
                                    <Picker.Item
                                        key={funcionario.id}
                                        label={funcionario.nome}
                                        value={funcionario.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={EmpresaInfoMoneyScreenStyle.modalButton}
                        >
                            <Text style={{ color: 'white' }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdicionarLicenca; 