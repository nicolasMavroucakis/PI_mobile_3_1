// import { collection, addDoc, getFirestore, Timestamp, getDocs, query, where, DocumentData } from "firebase/firestore";
// import StartFirebase from "./firebaseConfig";

// const seedAgendamentos = async () => {
//     const { db } = StartFirebase();

//     // Criar a coleção de agendamentos se não existir
//     try {
//         console.log("Verificando/criando coleção de agendamentos...");
//         const agendamentosRef = collection(db, "agendamentos");
//         const agendamentosSnapshot = await getDocs(agendamentosRef);
        
//         if (agendamentosSnapshot.empty) {
//             console.log("Coleção de agendamentos criada com sucesso!");
//         } else {
//             console.log("Coleção de agendamentos já existe!");
//         }
//     } catch (error) {
//         console.error("Erro ao verificar/criar coleção de agendamentos:", error);
//         throw error;
//     }

//     // Função auxiliar para gerar datas aleatórias nos próximos 30 dias
//     const getRandomDate = () => {
//         const now = new Date();
//         const futureDate = new Date(now);
//         futureDate.setDate(now.getDate() + Math.floor(Math.random() * 30));
//         futureDate.setHours(9 + Math.floor(Math.random() * 8)); // Horários entre 9h e 17h
//         futureDate.setMinutes(Math.random() < 0.5 ? 0 : 30); // Horários em intervalos de 30min
//         return Timestamp.fromDate(futureDate);
//     };

//     const servicos = [
//         {
//             nome: "Corte de cabelo",
//             preco: 30.00,
//             duracao: 30
//         },
//         {
//             nome: "Barba",
//             preco: 20.00,
//             duracao: 20
//         },
//         {
//             nome: "Corte + Barba",
//             preco: 45.00,
//             duracao: 50
//         },
//         {
//             nome: "Hidratação",
//             preco: 40.00,
//             duracao: 40
//         }
//     ];

//     const status = ["agendado", "confirmado", "em_andamento", "concluido"];

//     try {
//         console.log("Iniciando seed de agendamentos...");

//         // Buscar IDs existentes
//         const empresasRef = collection(db, "empresas");
//         const funcionariosRef = collection(db, "funcionarios");
//         const usersRef = collection(db, "users");
//         const clientesQuery = query(usersRef, where("tipoUsuario", "==", "Cliente"));

//         const [empresasSnapshot, funcionariosSnapshot, clientesSnapshot] = await Promise.all([
//             getDocs(empresasRef),
//             getDocs(funcionariosRef),
//             getDocs(clientesQuery)
//         ]);

//         if (empresasSnapshot.empty || funcionariosSnapshot.empty || clientesSnapshot.empty) {
//             throw new Error("Não foi possível encontrar empresas, funcionários ou clientes no banco de dados");
//         }

//         const empresaId = empresasSnapshot.docs[0].id;
//         const funcionarioId = funcionariosSnapshot.docs[0].id;
//         const clienteIds = clientesSnapshot.docs.map((doc: DocumentData) => doc.id);

//         // Criar 20 agendamentos
//         for (let i = 0; i < 20; i++) {
//             const agendamento = {
//                 clienteId: clienteIds[Math.floor(Math.random() * clienteIds.length)],
//                 empresaId: empresaId,
//                 funcionarioId: funcionarioId,
//                 servico: servicos[Math.floor(Math.random() * servicos.length)],
//                 data: getRandomDate(),
//                 status: status[Math.floor(Math.random() * status.length)],
//                 createdAt: Timestamp.fromDate(new Date()),
//                 updatedAt: Timestamp.fromDate(new Date())
//             };

//             try {
//                 console.log(`Criando agendamento ${i + 1}/20`);
//                 await addDoc(collection(db, "agendamentos"), agendamento);
//                 console.log(`Agendamento ${i + 1} criado com sucesso`);
//             } catch (error) {
//                 console.error(`Erro ao criar agendamento ${i + 1}:`, error);
//             }
//         }

//         console.log("Seed de agendamentos concluído com sucesso!");
//     } catch (error) {
//         console.error("Erro ao fazer seed de agendamentos:", error);
//         throw error;
//     }
// };

// // Executar o seed
// seedAgendamentos().then(() => {
//     console.log('Seeding de agendamentos completed');
//     process.exit(0);
// }).catch((error) => {
//     console.error('Seeding de agendamentos failed:', error);
//     process.exit(1);
// }); 