import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Timestamp } from 'firebase/firestore';

interface Endereco {
  cep: string;
  cidade: string;
  complemento: string;
  numero: string;
  rua: string;
}

interface Servico {
  duracao: number;
  nome: string;
  preco: number;
  valorFinalMuda?: boolean;
  funcionariosIds: string[];
  categoria?: string;
  descricao?: string;
  imagensUrl?: string[];
  tipoServico?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EmpresaContextData {
  id: string;
  createdAt: Timestamp | null;
  email: string;
  endereco: Endereco;
  funcionarios: string[];
  nome: string;
  servicos: Servico[];
  telefone: string;
  updatedAt: Timestamp | null;
  userId: string;
  fotoPerfil: string;
  linkInstagram?: string;
  linkSite?: string;
  
  setId: (id: string) => void;
  setCreatedAt: (date: Timestamp | null) => void;
  setEmail: (email: string) => void;
  setEndereco: (endereco: Endereco) => void;
  setFuncionarios: (funcionarios: string[]) => void;
  setNome: (nome: string) => void;
  setServicos: (servicos: Servico[]) => void;
  setTelefone: (telefone: string) => void;
  setUpdatedAt: (date: Timestamp | null) => void;
  setUserId: (userId: string) => void;
  setFotoPerfil: (fotoPerfil: string) => void;
  setAll: (data: Partial<EmpresaContextData>) => void;
}

const EmpresaContext = createContext<EmpresaContextData>({} as EmpresaContextData);

interface EmpresaProviderProps {
  children: ReactNode;
}

interface EmpresaState {
  id: string;
  createdAt: Timestamp | null;
  email: string;
  endereco: Endereco;
  funcionarios: string[];
  nome: string;
  servicos: Servico[];
  telefone: string;
  updatedAt: Timestamp | null;
  userId: string;
  fotoPerfil: string;
  linkInstagram?: string;
  linkSite?: string;
}

export const EmpresaProvider: React.FC<EmpresaProviderProps> = ({ children }) => {
  const [state, setState] = useState<EmpresaState>({
    id: '',
    createdAt: null,
    email: '',
    endereco: {
    cep: '',
    cidade: '',
    complemento: '',
    numero: '',
    rua: '',
    },
    funcionarios: [],
    nome: '',
    servicos: [],
    telefone: '',
    updatedAt: null,
    userId: '',
    fotoPerfil: '',
    linkInstagram: '',
    linkSite: ''
  });

  const setAll = (data: Partial<EmpresaContextData>) => {
    console.log("Dados recebidos no setAll:", data);
    setState(prevState => {
      const newState = { ...prevState };
      if (data.id !== undefined) newState.id = data.id;
      if (data.createdAt !== undefined) newState.createdAt = data.createdAt;
      if (data.email !== undefined) newState.email = data.email;
      if (data.endereco !== undefined) newState.endereco = data.endereco;
      if (data.funcionarios !== undefined) newState.funcionarios = data.funcionarios;
      if (data.nome !== undefined) newState.nome = data.nome;
      if (data.servicos !== undefined) newState.servicos = data.servicos;
      if (data.telefone !== undefined) newState.telefone = data.telefone;
      if (data.updatedAt !== undefined) newState.updatedAt = data.updatedAt;
      if (data.userId !== undefined) newState.userId = data.userId;
      if (data.fotoPerfil !== undefined) newState.fotoPerfil = data.fotoPerfil;
      if (data.linkInstagram !== undefined) newState.linkInstagram = data.linkInstagram;
      if (data.linkSite !== undefined) newState.linkSite = data.linkSite;
      
      console.log('Estado atualizado:', newState);
      return newState;
    });
  };

  return (
    <EmpresaContext.Provider
      value={{
        ...state,
        setId: (id) => setState(prev => ({ ...prev, id })),
        setCreatedAt: (createdAt) => setState(prev => ({ ...prev, createdAt })),
        setEmail: (email) => setState(prev => ({ ...prev, email })),
        setEndereco: (endereco) => setState(prev => ({ ...prev, endereco })),
        setFuncionarios: (funcionarios) => setState(prev => ({ ...prev, funcionarios })),
        setNome: (nome) => setState(prev => ({ ...prev, nome })),
        setServicos: (servicos) => setState(prev => ({ ...prev, servicos })),
        setTelefone: (telefone) => setState(prev => ({ ...prev, telefone })),
        setUpdatedAt: (updatedAt) => setState(prev => ({ ...prev, updatedAt })),
        setUserId: (userId) => setState(prev => ({ ...prev, userId })),
        setFotoPerfil: (fotoPerfil) => setState(prev => ({ ...prev, fotoPerfil })),
        setAll,
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresaContext = (): EmpresaContextData => {
  const context = useContext(EmpresaContext);
  
  if (!context) {
    throw new Error('useEmpresaContext must be used within an EmpresaProvider');
  }
  
  return context;
};
