// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import StartFirebase from './firebaseConfig';

// const db = StartFirebase();

// export const clearDatabase = async () => {
//     try {
//         // Collections to clear
//         const collections = ['users', 'empresas', 'funcionarios', 'agendamentos'];

//         for (const collectionName of collections) {
//             const querySnapshot = await getDocs(collection(db, collectionName));
            
//             // Delete each document in the collection
//             const deletePromises = querySnapshot.docs.map(doc => 
//                 deleteDoc(doc.ref)
//             );
            
//             await Promise.all(deletePromises);
//             console.log(`Cleared ${collectionName} collection`);
//         }

//         console.log('Database cleared successfully!');
//         return true;
//     } catch (error) {
//         console.error('Error clearing database:', error);
//         return false;
//     }
// }; 