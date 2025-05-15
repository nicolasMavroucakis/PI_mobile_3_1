import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Endereco {
  cep: string;
  cidade: string;
  complemento: string;
  numero: string;
  rua: string;
}

interface Servico {
  createdAt: Date;
  duracao: number;
  nome: string;
  preco: number;
  updatedAt: Date;
}

interface EmpresaContextData {
  id: string;
  createdAt: Date | null;
  email: string;
  endereco: Endereco;
  funcionarios: string[];
  nome: string;
  servicos: Servico[];
  telefone: string;
  updatedAt: Date | null;
  userId: string;
  
  setId: (id: string) => void;
  setCreatedAt: (date: Date | null) => void;
  setEmail: (email: string) => void;
  setEndereco: (endereco: Endereco) => void;
  setFuncionarios: (funcionarios: string[]) => void;
  setNome: (nome: string) => void;
  setServicos: (servicos: Servico[]) => void;
  setTelefone: (telefone: string) => void;
  setUpdatedAt: (date: Date | null) => void;
  setUserId: (userId: string) => void;
  setAll: (data: Partial<EmpresaContextData>) => void;
}

const EmpresaContext = createContext<EmpresaContextData>({} as EmpresaContextData);

interface EmpresaProviderProps {
  children: ReactNode;
}

export const EmpresaProvider: React.FC<EmpresaProviderProps> = ({ children }) => {
  const [id, setId] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [email, setEmail] = useState<string>('');
  const [endereco, setEndereco] = useState<Endereco>({
    cep: '',
    cidade: '',
    complemento: '',
    numero: '',
    rua: '',
  });
  const [funcionarios, setFuncionarios] = useState<string[]>([]);
  const [nome, setNome] = useState<string>('');
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [telefone, setTelefone] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [userId, setUserId] = useState<string>('');

  const setAll = (data: Partial<EmpresaContextData>) => {
    if (data.id !== undefined) setId(data.id);
    if (data.createdAt !== undefined) setCreatedAt(data.createdAt);
    if (data.email !== undefined) setEmail(data.email);
    if (data.endereco !== undefined) setEndereco(data.endereco);
    if (data.funcionarios !== undefined) setFuncionarios(data.funcionarios);
    if (data.nome !== undefined) setNome(data.nome);
    if (data.servicos !== undefined) setServicos(data.servicos);
    if (data.telefone !== undefined) setTelefone(data.telefone);
    if (data.updatedAt !== undefined) setUpdatedAt(data.updatedAt);
    if (data.userId !== undefined) setUserId(data.userId);
  };

  return (
    <EmpresaContext.Provider
      value={{
        id,
        createdAt,
        email,
        endereco,
        funcionarios,
        nome,
        servicos,
        telefone,
        updatedAt,
        userId,
        setId,
        setCreatedAt,
        setEmail,
        setEndereco,
        setFuncionarios,
        setNome,
        setServicos,
        setTelefone,
        setUpdatedAt,
        setUserId,
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
