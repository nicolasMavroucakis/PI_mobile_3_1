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

interface EmpresaGlobalContextType {
    categorias: string[];
    setCategorias: Dispatch<SetStateAction<string[]>>;
    addCategoria: (categoria: string) => void;
    deleteCategoria: (categoria: string) => void;
    servicos: any[];
    setServicos: Dispatch<SetStateAction<any[]>>;
    funcionarios: any[];
    setFuncionarios: Dispatch<SetStateAction<any[]>>;
}

export const EmpresaGlobalContext = createContext<EmpresaGlobalContextType>({
    categorias: [],
    setCategorias: () => {},
    addCategoria: () => {},
    deleteCategoria: () => {},
    servicos: [],
    setServicos: () => {},
    funcionarios: [],
    setFuncionarios: () => {},
});

export const EmpresaGlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categorias, setCategorias] = useState<string[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const { id: userId } = useUserGlobalContext();
    const { db } = StartFirebase();

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

    return (
        <EmpresaGlobalContext.Provider
            value={{
                categorias,
                setCategorias,
                addCategoria,
                deleteCategoria,
                servicos,
                setServicos,
                funcionarios,
                setFuncionarios,
            }}
        >
            {children}
        </EmpresaGlobalContext.Provider>
    );
};

export const useEmpresaGlobalContext = () => useContext(EmpresaGlobalContext);