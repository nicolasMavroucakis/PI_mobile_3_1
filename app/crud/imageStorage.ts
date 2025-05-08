import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import StartFirebase from './firebaseConfig';

const { storage } = StartFirebase();

export const uploadProfileImage = async (userId: string, imageUri: string): Promise<string> => {
    if (!userId || !imageUri) {
        throw new Error('ID do usuário e URI da imagem são obrigatórios');
    }

    try {
        console.log('Iniciando upload da imagem para o usuário:', userId);
        // Criar uma referência para o arquivo no Storage usando o ID do Firestore
        const storageRef = ref(storage, `profile_images/${userId}`);
        // Converter a URI da imagem para blob
        const response = await fetch(imageUri);
        if (!response.ok) {
            throw new Error(`Erro ao carregar a imagem: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        if (blob.size > 5 * 1024 * 1024) {
            throw new Error('A imagem é muito grande. O tamanho máximo permitido é 5MB.');
        }
        const metadata = {
            contentType: 'image/jpeg',
            customMetadata: {
                userId: userId,
                uploadedAt: new Date().toISOString()
            }
        };
        const uploadPromise = uploadBytes(storageRef, blob, metadata);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout no upload da imagem')), 30000);
        });
        const uploadResult = await Promise.race([uploadPromise, timeoutPromise]) as { metadata: any };
        console.log('Upload concluído:', uploadResult.metadata);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: any) {
        console.error('Erro detalhado ao fazer upload da imagem:', error);
        throw error;
    }
};

export const getProfileImage = async (userId: string): Promise<string> => {
    if (!userId) {
        throw new Error('ID do usuário é obrigatório');
    }
    try {
        const storageRef = ref(storage, `profile_images/${userId}`);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: any) {
        console.error('Erro ao obter a imagem:', error);
        if (error.code === 'storage/object-not-found') {
            return '';
        }
        throw error;
    }
}; 