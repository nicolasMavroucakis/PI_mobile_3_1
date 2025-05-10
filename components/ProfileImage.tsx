import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getProfileImage } from '../app/crud/imageStorage';
import * as ImagePicker from 'expo-image-picker';
import { uploadProfileImage } from '../app/crud/imageStorage';
import { doc, updateDoc } from 'firebase/firestore';
import StartFirebase from '../app/crud/firebaseConfig';

const { db } = StartFirebase();

interface ProfileImageProps {
    userId: string;
    size?: number;
    onImageUpdate?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ userId, size = 100, onImageUpdate }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        loadImage();
    }, [userId]);

    const loadImage = async () => {
        try {
            const url = await getProfileImage(userId);
            setImageUrl(url);
        } catch (error) {
            console.error('Erro ao carregar imagem:', error);
        }
    };

    const pickImage = async () => {
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

            if (!result.canceled) {
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
        }
    };

    return (
        <TouchableOpacity onPress={pickImage}>
            <Image 
                source={imageUrl ? { uri: imageUrl } : require('../assets/images/user.jpeg')}
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