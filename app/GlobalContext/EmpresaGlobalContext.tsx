import React, {
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
    ReactNode,
    useContext,
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserGlobalContext, useUserGlobalContext } from "./UserGlobalContext";

// Firebase
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import StartFirebase from "../crud/firebaseConfig";
import { start } from "repl";

interface EmpresaData {
    id: string;
    userId: string;
    funcionarios: string[];
    categorias: string[];
    servicos: any[];
    [key: string]: any;
}

interface EmpresaGlobalContextType {
    empresa: EmpresaData | null;
    setEmpresa: Dispatch<SetStateAction<any>>;
    categorias: string[];
    setCategorias: Dispatch<SetStateAction<string[]>>;
    addCategoria: (categoria: string) => void;
    deleteCategoria: (categoria: string) => void;
    servicos: any[];
    setServicos: Dispatch<SetStateAction<any[]>>;
    funcionarios: any[];
    setFuncionarios: Dispatch<SetStateAction<any[]>>;
    carregarServicos: () => void;
    deleteServico: (servicos: string) => void;
    carregarEmpresa: () => Promise<void>;
}

export const EmpresaGlobalContext = createContext<EmpresaGlobalContextType>({
    empresa: null,
    setEmpresa: () => {},
    categorias: [],
    setCategorias: () => {},
    addCategoria: () => {},
    deleteCategoria: () => {},
    servicos: [],
    setServicos: () => {},
    funcionarios: [],
    setFuncionarios: () => {},
    carregarServicos: () => {},
    deleteServico: () => {},
    carregarEmpresa: async () => {},
});

export const EmpresaGlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [empresa, setEmpresa] = useState<any>(null);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const { id: userId } = useUserGlobalContext();
    const { db } = StartFirebase();

    const carregarEmpresa = async () => {
        if (!userId) return;
        
        try {
            const empresasRef = collection(db, "empresas");
            const q = query(empresasRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                const empresaData: EmpresaData = {
                    id: empresaDoc.id,
                    ...empresaDoc.data()
                } as EmpresaData;
                setEmpresa(empresaData);
                setCategorias(empresaData.categorias || []);
                setServicos(empresaData.servicos || []);
                setFuncionarios(empresaData.funcionarios || []);
                console.log("Empresa carregada:", empresaData);
            } else {
                console.log("Nenhuma empresa encontrada para o usuário.");
                setEmpresa(null);
            }
        } catch (error) {
            console.error("Erro ao carregar empresa:", error);
            setEmpresa(null);
        }
    };

    const addCategoria = async (categoria: string) => {
        if (!userId) return;

        const novaCategoria = categoria.trim();
        if (!novaCategoria || categorias.includes(novaCategoria)) return;

        setCategorias((prev) => [...prev, novaCategoria]);

        try {
            const empresasRef = collection(db, "empresas");
            const q = query(empresasRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                const empresaRef = doc(db, "empresas", empresaDoc.id);
                const categoriasAtuais = empresaDoc.data().categorias || [];
                await updateDoc(empresaRef, { categorias: [...categoriasAtuais, novaCategoria] });
                console.log("Categoria adicionada ao Firestore.");
            }
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
        }
    };

    const deleteCategoria = async (categoria: string) => {
        if (!userId) return;
        const novasCategorias = categorias.filter((cat) => cat !== categoria);
        setCategorias(novasCategorias);

        try {
            const empresasRef = collection(db, "empresas");
            const q = query(empresasRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                const empresaRef = doc(db, "empresas", empresaDoc.id);
                await updateDoc(empresaRef, { categorias: novasCategorias });
                console.log("Categoria removida do Firestore.");
            }
        } catch (error) {
            console.error("Erro ao remover categoria:", error);
        }
    };

    const carregarServicos = async () => {
        if (!userId) return;
        try {
            const empresasRef = collection(db, "empresas");
            const q = query(empresasRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                const servicosAtuais = empresaDoc.data().servicos || [];
                setServicos(servicosAtuais); 
                console.log("Serviços carregados:", servicosAtuais);
            } else {
                console.log("Nenhuma empresa encontrada para o usuário.");
            }
        } catch (error) {
            console.error("Erro ao carregar serviços:", error);
        }
    };

    const deleteServico = async (servicoId: string) => {
        if (!userId) return;
    
        try {
            const empresasRef = collection(db, "empresas");
            const q = query(empresasRef, where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                const empresaRef = doc(db, "empresas", empresaDoc.id);
                const servicosAtuais = empresaDoc.data().servicos || [];
                const novosServicos = servicosAtuais.filter((servico: any) => servico.id !== servicoId);
    
                // Atualiza o Firestore
                await updateDoc(empresaRef, { servicos: novosServicos });
    
                // Atualiza o estado local
                setServicos(novosServicos);
    
                console.log(`Serviço com ID ${servicoId} removido com sucesso.`);
            } else {
                console.log("Nenhuma empresa encontrada para o usuário.");
            }
        } catch (error) {
            console.error("Erro ao remover serviço:", error);
        }
    };
    
    useEffect(() => {
        carregarEmpresa();
    }, [userId]);

    return (
        <EmpresaGlobalContext.Provider
            value={{
                empresa,
                setEmpresa,
                categorias,
                setCategorias,
                addCategoria,
                deleteCategoria,
                servicos,
                setServicos,
                funcionarios,
                setFuncionarios,
                carregarServicos,
                deleteServico,
                carregarEmpresa
            }}
        >
            {children}
        </EmpresaGlobalContext.Provider>
    );
};

export const useEmpresaGlobalContext = () => useContext(EmpresaGlobalContext);