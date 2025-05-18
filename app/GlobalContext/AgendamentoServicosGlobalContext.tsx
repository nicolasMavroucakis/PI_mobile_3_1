import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Timestamp } from 'firebase/firestore';

interface Servico {
    nome: string;
    preco: number;
    duracao: number;
}

interface Funcionario {
    id: string;
    nome: string;
    foto: string;
}

interface Agendamento {
    id: string;
    clienteId: string;
    empresaId: string;
    funcionarioId: string;
    servico: Servico;
    data: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'finalizado';
}

interface AgendamentoServicosContextData {
    servicosSelecionados: Servico[];
    funcionarioSelecionado: Funcionario | null;
    dataAgendamento: Date | null;
    horarioAgendamento: string | null;
    agendamentos: Agendamento[];
    adicionarServico: (servico: Servico) => void;
    removerServico: (servico: Servico) => void;
    selecionarFuncionario: (funcionario: Funcionario | null) => void;
    definirData: (data: Date) => void;
    definirHorario: (horario: string) => void;
    limparSelecao: () => void;
    adicionarAgendamento: (agendamento: Agendamento) => void;
    calcularValorTotal: () => number;
    calcularTempoTotal: () => { horas: number; minutos: number };
}

const AgendamentoServicosContext = createContext<AgendamentoServicosContextData>({} as AgendamentoServicosContextData);

export const useAgendamentoServicos = () => {
    const context = useContext(AgendamentoServicosContext);
    if (!context) {
        throw new Error('useAgendamentoServicos deve ser usado dentro de um AgendamentoServicosProvider');
    }
    return context;
};

interface AgendamentoServicosProviderProps {
    children: ReactNode;
}

export const AgendamentoServicosProvider = ({ children }: AgendamentoServicosProviderProps) => {
    const [servicosSelecionados, setServicosSelecionados] = useState<Servico[]>([]);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
    const [dataAgendamento, setDataAgendamento] = useState<Date | null>(null);
    const [horarioAgendamento, setHorarioAgendamento] = useState<string | null>(null);
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

    const adicionarServico = (servico: Servico) => {
        setServicosSelecionados(prev => [...prev, servico]);
    };

    const removerServico = (servico: Servico) => {
        setServicosSelecionados(prev => 
            prev.filter(s => 
                s.nome !== servico.nome || 
                s.preco !== servico.preco || 
                s.duracao !== servico.duracao
            )
        );
    };

    const selecionarFuncionario = (funcionario: Funcionario | null) => {
        setFuncionarioSelecionado(funcionario);
    };

    const definirData = (data: Date) => {
        setDataAgendamento(data);
    };

    const definirHorario = (horario: string) => {
        setHorarioAgendamento(horario);
    };

    const limparSelecao = () => {
        setServicosSelecionados([]);
        setFuncionarioSelecionado(null);
        setDataAgendamento(null);
        setHorarioAgendamento(null);
    };

    const adicionarAgendamento = (agendamento: Agendamento) => {
        setAgendamentos(prev => [...prev, agendamento]);
    };

    const calcularValorTotal = () => {
        return servicosSelecionados.reduce((total, servico) => total + servico.preco, 0);
    };

    const calcularTempoTotal = () => {
        const minutosTotais = servicosSelecionados.reduce((total, servico) => total + servico.duracao, 0);
        return {
            horas: Math.floor(minutosTotais / 60),
            minutos: minutosTotais % 60
        };
    };

    return (
        <AgendamentoServicosContext.Provider
            value={{
                servicosSelecionados,
                funcionarioSelecionado,
                dataAgendamento,
                horarioAgendamento,
                agendamentos,
                adicionarServico,
                removerServico,
                selecionarFuncionario,
                definirData,
                definirHorario,
                limparSelecao,
                adicionarAgendamento,
                calcularValorTotal,
                calcularTempoTotal,
            }}
        >
            {children}
        </AgendamentoServicosContext.Provider>
    );
};
