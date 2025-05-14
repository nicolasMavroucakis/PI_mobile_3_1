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
import { UserGlobalContext } from "./UserGlobalContext";

// Firebase
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import StartFirebase from "../crud/firebaseConfig";
import { start } from "repl";

interface EmpresaGlobalContextType {
    categorias: any[];
    setCategorias: Dispatch<SetStateAction<any[]>>;
    servicos: any[];
    setServicos: Dispatch<SetStateAction<any[]>>;
    funcionarios: any[];
    setFuncionarios: Dispatch<SetStateAction<any[]>>;
}

export const EmpresaGlobalContext = createContext<EmpresaGlobalContextType>({
    categorias: [],
    setCategorias: () => {},
    servicos: [],
    setServicos: () => {},
    funcionarios: [],
    setFuncionarios: () => {},
});

export const EmpresaGlobalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const [funcionarios, setFuncionarios] = useState<any[]>([]);
    const { id: userId } = useContext(UserGlobalContext);
    const { db } = StartFirebase();

    useEffect(() => {
        const syncCategoriaComFirestore = async () => {
            if (categorias.length === 0 || !userId) return;

            const novaCategoria = categorias[categorias.length - 1];

            try {
                const empresasRef = collection(db, "empresas");
                const q = query(empresasRef, where("userId", "==", userId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const empresaDoc = querySnapshot.docs[0];
                    const empresaRef = doc(db, "empresas", empresaDoc.id);
                    const empresaData = empresaDoc.data();

                    const categoriasAtuais = empresaData.categorias || [];

                    if (!categoriasAtuais.includes(novaCategoria)) {
                        await updateDoc(empresaRef, {
                            categorias: [...categoriasAtuais, novaCategoria],
                        });
                        console.log("Categoria sincronizada com Firestore.");
                    }
                } else {
                    console.warn("Empresa não encontrada.");
                }
            } catch (error) {
                console.error("Erro ao sincronizar categoria:", error);
            }
        };

        syncCategoriaComFirestore();
    }, [categorias]);

    return (
        <EmpresaGlobalContext.Provider
            value={{
                categorias,
                setCategorias,
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