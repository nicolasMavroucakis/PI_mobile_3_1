import { collection, doc, setDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import StartFirebase from './firebaseConfig';

const db = StartFirebase();

export const seedDatabase = async () => {
    try {
        // 1. Create Users
        const users = [
            {
                id: 'user1',
                data: {
                    nome: 'João Silva',
                    email: 'joao@email.com',
                    senha: '123456',
                    tipoUsuario: 'Cliente',
                    telefone: '11999999999',
                    endereco: {
                        cep: '12345-678',
                        cidade: 'São Paulo',
                        rua: 'Rua das Flores',
                        numero: '123',
                        complemento: 'Apto 45'
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            },
            {
                id: 'user2',
                data: {
                    nome: 'Maria Santos',
                    email: 'maria@email.com',
                    senha: '123456',
                    tipoUsuario: 'Empresa',
                    telefone: '11988888888',
                    endereco: {
                        cep: '87654-321',
                        cidade: 'São Paulo',
                        rua: 'Avenida Principal',
                        numero: '456',
                        complemento: 'Sala 10'
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            },
            {
                id: 'user3',
                data: {
                    nome: 'Pedro Oliveira',
                    email: 'pedro@email.com',
                    senha: '123456',
                    tipoUsuario: 'Funcionario',
                    telefone: '11977777777',
                    endereco: {
                        cep: '54321-876',
                        cidade: 'São Paulo',
                        rua: 'Rua dos Funcionários',
                        numero: '789',
                        complemento: 'Casa'
                    },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
        ];

        // 2. Create Companies
        const empresas = [
            {
                id: 'empresa1',
                data: {
                    userId: 'user2',
                    nome: 'Salão da Maria',
                    categoria: 'Beleza',
                    horarioFuncionamento: {
                        inicio: '09:00',
                        fim: '18:00'
                    },
                    diasFuncionamento: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
                    servicos: [
                        {
                            servicoId: 'servico1',
                            nome: 'Corte de Cabelo',
                            descricao: 'Corte de cabelo feminino',
                            preco: 50.00,
                            duracao: 60,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        },
                        {
                            servicoId: 'servico2',
                            nome: 'Manicure',
                            descricao: 'Manicure completa',
                            preco: 35.00,
                            duracao: 45,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        }
                    ],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
        ];

        // 3. Create Employees
        const funcionarios = [
            {
                id: 'funcionario1',
                data: {
                    userId: 'user3',
                    empresaId: 'empresa1',
                    nome: 'Pedro Oliveira',
                    especialidades: ['Corte de Cabelo', 'Manicure'],
                    horarioTrabalho: {
                        inicio: '09:00',
                        fim: '18:00'
                    },
                    diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
        ];

        // 4. Create Appointments
        const agendamentos = [
            {
                id: 'agendamento1',
                data: {
                    clienteId: 'user1',
                    empresaId: 'empresa1',
                    funcionarioId: 'funcionario1',
                    servicoId: 'servico1',
                    data: Timestamp.fromDate(new Date('2024-03-20')),
                    horario: '10:00',
                    status: 'pendente',
                    valor: 50.00,
                    observacoes: 'Cliente preferencial',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
        ];

        // Insert Users
        for (const user of users) {
            await setDoc(doc(db, 'users', user.id), user.data);
            console.log(`User ${user.id} created successfully`);
        }

        // Insert Companies
        for (const empresa of empresas) {
            await setDoc(doc(db, 'empresas', empresa.id), empresa.data);
            console.log(`Company ${empresa.id} created successfully`);
        }

        // Insert Employees
        for (const funcionario of funcionarios) {
            await setDoc(doc(db, 'funcionarios', funcionario.id), funcionario.data);
            console.log(`Employee ${funcionario.id} created successfully`);
        }

        // Insert Appointments
        for (const agendamento of agendamentos) {
            await setDoc(doc(db, 'agendamentos', agendamento.id), agendamento.data);
            console.log(`Appointment ${agendamento.id} created successfully`);
        }

        console.log('Database seeded successfully!');
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
}; 