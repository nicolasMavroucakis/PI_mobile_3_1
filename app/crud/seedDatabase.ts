import { collection, addDoc, getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";

const seedDatabase = async () => {
    const { db } = StartFirebase();

    const users = [
        {
            nome: "João Silva",
            email: "joao@email.com",
            senha: "123456",
            tipoUsuario: "Cliente",
            telefone: "11999999999",
            endereco: {
                rua: "Rua das Flores",
                numero: "123",
                cidade: "São Paulo",
                cep: "12345-678",
                complemento: "Apto 45"
            },
            fotoPerfil: "",
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        },
        {
            nome: "Maria Santos",
            email: "maria@email.com",
            senha: "123456",
            tipoUsuario: "Funcionario",
            telefone: "11988888888",
            endereco: {
                rua: "Avenida Principal",
                numero: "456",
                cidade: "São Paulo",
                cep: "87654-321",
                complemento: "Sala 10"
            },
            fotoPerfil: "",
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        },
        {
            nome: "Barbearia do Zé",
            email: "ze@email.com",
            senha: "123456",
            tipoUsuario: "Empresa",
            telefone: "11977777777",
            endereco: {
                rua: "Rua do Comércio",
                numero: "789",
                cidade: "São Paulo",
                cep: "54321-987",
                complemento: "Loja 5"
            },
            fotoPerfil: "",
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }
    ];

    const empresas = [
        {
            nome: "Barbearia do Zé",
            endereco: {
                rua: "Rua do Comércio",
                numero: "789",
                cidade: "São Paulo",
                cep: "54321-987",
                complemento: "Loja 5"
            },
            telefone: "11977777777",
            email: "ze@email.com",
            fotoPerfil: "",
            servicos: [
                {
                    nome: "Corte de cabelo",
                    preco: 30.00,
                    duracao: 30,
                    createdAt: Timestamp.fromDate(new Date()),
                    updatedAt: Timestamp.fromDate(new Date())
                },
                {
                    nome: "Barba",
                    preco: 20.00,
                    duracao: 20,
                    createdAt: Timestamp.fromDate(new Date()),
                    updatedAt: Timestamp.fromDate(new Date())
                }
            ],
            funcionarios: [],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }
    ];

    const funcionarios = [
        {
            nome: "Maria Santos",
            email: "maria@email.com",
            telefone: "11988888888",
            endereco: {
                rua: "Avenida Principal",
                numero: "456",
                cidade: "São Paulo",
                cep: "87654-321",
                complemento: "Sala 10"
            },
            fotoPerfil: "",
            empresaId: "",
            servicos: [],
            horarios: {
                segunda: { inicio: "09:00", fim: "18:00" },
                terca: { inicio: "09:00", fim: "18:00" },
                quarta: { inicio: "09:00", fim: "18:00" },
                quinta: { inicio: "09:00", fim: "18:00" },
                sexta: { inicio: "09:00", fim: "18:00" },
                sabado: { inicio: "09:00", fim: "13:00" },
                domingo: { inicio: "", fim: "" }
            },
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }
    ];

    const agendamentos = [
        {
            clienteId: "",
            empresaId: "",
            funcionarioId: "",
            servico: {
                nome: "Corte de cabelo",
                preco: 30.00,
                duracao: 30
            },
            data: Timestamp.fromDate(new Date()),
            status: "agendado",
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }
    ];

    try {
        console.log("Iniciando seed do banco de dados...");

        for (const user of users) {
            try {
                console.log(`Criando usuário no Firestore: ${user.email}`);
                const userDoc = await addDoc(collection(db, "users"), user);
                console.log(`Usuário criado no Firestore com ID: ${userDoc.id}`);

                if (user.tipoUsuario === "Empresa") {
                    const empresa = empresas.find(e => e.email === user.email);
                    if (empresa) {
                        console.log(`Criando empresa: ${empresa.nome}`);
                        const empresaDoc = await addDoc(collection(db, "empresas"), {
                            ...empresa,
                            userId: userDoc.id
                        });
                        console.log(`Empresa criada com ID: ${empresaDoc.id}`);

                        const funcionario = funcionarios[0];
                        console.log(`Criando funcionário: ${funcionario.nome}`);
                        const funcionarioDoc = await addDoc(collection(db, "funcionarios"), {
                            ...funcionario,
                            empresaId: empresaDoc.id
                        });
                        console.log(`Funcionário criado com ID: ${funcionarioDoc.id}`);

                        const agendamento = agendamentos[0];
                        console.log("Criando agendamento");
                        await addDoc(collection(db, "agendamentos"), {
                            ...agendamento,
                            clienteId: userDoc.id,
                            empresaId: empresaDoc.id,
                            funcionarioId: funcionarioDoc.id
                        });
                        console.log("Agendamento criado");
                    }
                }
            } catch (error) {
                console.error(`Erro ao criar usuário ${user.email}:`, error);
            }
        }

        console.log("Seed do banco de dados concluído com sucesso!");
    } catch (error) {
        console.error("Erro ao fazer seed do banco de dados:", error);
        throw error;
    }
};

seedDatabase().then(() => {
    console.log('Seeding completed');
    process.exit(0);
}).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
}); 