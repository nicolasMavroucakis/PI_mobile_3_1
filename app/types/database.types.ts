export interface User {
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: 'Cliente' | 'Empresa' | 'Funcionario';
    telefone: string;
    endereco: Endereco;
}

export interface Endereco {
    cep: string;
    cidade: string;
    rua: string;
    numero: string;
    complemento?: string;
}

export interface Empresa {
    userId: string;
    nome: string;
    categoria: string;
    horarioFuncionamento: HorarioFuncionamento;
    diasFuncionamento: string[];
    servicos: Servico[];
}

export interface HorarioFuncionamento {
    inicio: string;
    fim: string;
}

export interface Servico {
    servicoId: string;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number; // in minutes
}

export interface Funcionario {
    userId: string;
    empresaId: string;
    especialidades: string[];
    horarioTrabalho: HorarioFuncionamento;
    diasTrabalho: string[];
}

export interface Agendamento {
    clienteId: string;
    empresaId: string;
    funcionarioId: string;
    servicoId: string;
    data: Date;
    horario: string;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
    valor: number;
    observacoes?: string;
    createdAt: Date;
} 