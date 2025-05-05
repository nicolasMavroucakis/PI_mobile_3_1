import React, { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserGlobalContextType {
    endereco: boolean;
    setEndereco: Dispatch<SetStateAction<boolean>>;
    usuarioGlobal: string;
    setUsuarioGlobal: Dispatch<SetStateAction<string>>;
    senha: string;
    setSenha: Dispatch<SetStateAction<string>>;
    nome: string;
    setNome: Dispatch<SetStateAction<string>>;
    cidade: boolean;
    setCidade: Dispatch<SetStateAction<boolean>>;
    setNumero: Dispatch<SetStateAction<string>>;
    numero: string;
    complemento: string;
    setComplemento: Dispatch<SetStateAction<string>>
}

export const UserGlobalContext = createContext<UserGlobalContextType>({
    endereco: false,
    setEndereco: () => {},
    usuarioGlobal: '',
    setUsuarioGlobal: () => {},
    senha: '',
    setSenha: () => {},
    nome: '',
    setNome: () => {},
    cidade: false,
    setCidade: () => {},
    numero: '',
    setNumero: () => {},
    complemento: '',
    setComplemento: () => {}
});

export const UserGlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [endereco, setEndereco] = useState<boolean>(false);
    const [usuarioGlobal, setUsuarioGlobal] = useState<string>('Empresa');
    const [senha, setSenha] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [cidade, setCidade] = useState<boolean>(false);
    const [numero, setNumero] = useState<string>('');
    const [complemento, setComplemento] = useState<string>('')

    useEffect(() => {
        const loadAsyncData = async () => {
            try {
                const savedendereco = await AsyncStorage.getItem('endereco');
                if (savedendereco !== null) {
                    setEndereco(JSON.parse(savedendereco));
                }
            } catch (error) {
                console.error('Erro ao carregar dados do AsyncStorage:', error);
            }
        };

        loadAsyncData();
    }, []);

    useEffect(() => {
        console.log(endereco)
        console.log(usuarioGlobal)
        console.log(senha)
        console.log(nome)
        console.log(cidade)
        console.log(numero)
        console.log(complemento)
    }, [endereco]);

    return (
        <UserGlobalContext.Provider value={{
            endereco,
            setEndereco,
            usuarioGlobal,
            setUsuarioGlobal,
            senha,
            setSenha,
            nome,
            setNome,
            cidade,
            setCidade,
            numero,
            setNumero,
            complemento,
            setComplemento
        }}>
            {children}
        </UserGlobalContext.Provider>
    );
};

export const useUserGlobalContext = () => useContext(UserGlobalContext);