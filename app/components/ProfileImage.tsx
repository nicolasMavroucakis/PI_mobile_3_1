import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getProfileImage } from '../crud/imageStorage';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage } from '../crud/imageStorage';
import { doc, updateDoc } from 'firebase/firestore';
import StartFirebase from '../crud/firebaseConfig';
import defaultProfileImg from '../../assets/images/user.jpeg';

const { db } = StartFirebase();

interface ProfileImageProps {
    userId: string;
    size?: number;
    onImageUpdate?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ userId, size = 100, onImageUpdate }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadImage();
        }
    }, [userId]);

    const loadImage = async () => {
        if (!userId) return;
        
        try {
            setIsLoading(true);
            const url = await getProfileImage(userId);
            setImageUrl(url);
        } catch (error) {
            console.error('Erro ao carregar imagem:', error);
            setImageUrl(null);
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async () => {
        if (!userId) {
            alert('ID do usuário não encontrado');
            return;
        }

        try {
            // Solicitar permissão para acessar a galeria
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                alert('Desculpe, precisamos de permissão para acessar suas fotos!');
                return;
            }

            // Abrir o seletor de imagens
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                setIsLoading(true);
                // Fazer upload da nova imagem
                const newImageUrl = await uploadProfileImage(userId, result.assets[0].uri);
                
                // Atualizar o documento do usuário no Firestore
                await updateDoc(doc(db, 'users', userId), {
                    fotoPerfil: newImageUrl
                });

                // Atualizar o estado local
                setImageUrl(newImageUrl);
                
                // Notificar componente pai se necessário
                if (onImageUpdate) {
                    onImageUpdate();
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar foto de perfil:', error);
            alert('Erro ao atualizar foto de perfil');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity onPress={pickImage} disabled={isLoading}>
            <Image 
                source={imageUrl ? { uri: imageUrl } : defaultProfileImg}
                style={[
                    styles.image,
                    { width: size, height: size, borderRadius: size / 2 }
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: {
        backgroundColor: '#e1e1e1',
    }
});

export default ProfileImage; 