import React, { createContext, useState, useEffect, Dispatch, SetStateAction, ReactNode, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserGlobalContextType {
    endereco: boolean;
    setEndereco: Dispatch<SetStateAction<boolean>>;
    usuarioGlobal: string;
    setUsuarioGlobal: Dispatch<SetStateAction<string>>;
    senha: string;
    setSenha: Dispatch<SetStateAction<string>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    nome: string;
    setNome: Dispatch<SetStateAction<string>>;
    cidade: boolean;
    setCidade: Dispatch<SetStateAction<boolean>>;
    setNumero: Dispatch<SetStateAction<string>>;
    numero: string;
    complemento: string;
    setComplemento: Dispatch<SetStateAction<string>>
    numeroTelefone: string;
    setNumeroTelefone: Dispatch<SetStateAction<string>>;
    id: string;
    setId: Dispatch<SetStateAction<string>>;
    fotoPerfil: string;
    setFotoPerfil: Dispatch<SetStateAction<string>>;
}

export const UserGlobalContext = createContext<UserGlobalContextType>({
    endereco: false,
    setEndereco: () => {},
    usuarioGlobal: '',
    setUsuarioGlobal: () => {},
    email: '',
    setEmail: () => {},
    senha: '',
    setSenha: () => {},
    nome: '',
    setNome: () => {},
    cidade: false,
    setCidade: () => {},
    numero: '',
    setNumero: () => {},
    complemento: '',
    setComplemento: () => {},
    numeroTelefone: '',
    setNumeroTelefone: () => {},
    id: '',
    setId: () => {},
    fotoPerfil: '',
    setFotoPerfil: () => {}
});

export const UserGlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [endereco, setEndereco] = useState<boolean>(false);
    const [usuarioGlobal, setUsuarioGlobal] = useState<string>('Empresa');
    const [senha, setSenha] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [cidade, setCidade] = useState<boolean>(false);
    const [numero, setNumero] = useState<string>('');
    const [complemento, setComplemento] = useState<string>('')
    const [numeroTelefone, setNumeroTelefone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [fotoPerfil, setFotoPerfil] = useState<string>('');

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
        console.log(numeroTelefone)
        console.log(email)
        console.log(id)
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
            setComplemento,
            numeroTelefone,
            setNumeroTelefone,
            email,
            setEmail,
            id,
            setId,
            fotoPerfil,
            setFotoPerfil
        }}>
            {children}
        </UserGlobalContext.Provider>
    );
};

export const useUserGlobalContext = () => useContext(UserGlobalContext);