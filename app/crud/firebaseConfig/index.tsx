import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

function StartFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyCvoKcCLr5IqAujT2cIvsRAfy4Dkvh9azo",
        authDomain: "pi20251.firebaseapp.com",
        projectId: "pi20251",
        storageBucket: "pi20251.appspot.com",
        messagingSenderId: "652437593102",
        appId: "1:652437593102:web:ec10d188783f4af0ddf05f",
        measurementId: "G-2W1HSKJY1F"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    return { db, storage };
}

export default StartFirebase


