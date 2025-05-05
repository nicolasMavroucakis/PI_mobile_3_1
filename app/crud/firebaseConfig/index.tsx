import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

function StartFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyCvoKcCLr5IqAujT2cIvsRAfy4Dkvh9azo",
        authDomain: "pi20251.firebaseapp.com",
        projectId: "pi20251",
        storageBucket: "pi20251.firebasestorage.app",
        messagingSenderId: "652437593102",
        appId: "1:652437593102:web:ec10d188783f4af0ddf05f",
        measurementId: "G-2W1HSKJY1F"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return db
}

export default StartFirebase


