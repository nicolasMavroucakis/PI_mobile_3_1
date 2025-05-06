import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import StartFirebase from './firebaseConfig';

const db = StartFirebase();

// User Operations
export const createUser = async (userId: string, userData: any) => {
    try {
        await setDoc(doc(db, "users", userId), userData);
        return true;
    } catch (error) {
        console.error("Error creating user:", error);
        return false;
    }
};

// Company Operations
export const createCompany = async (companyId: string, companyData: any) => {
    try {
        await setDoc(doc(db, "empresas", companyId), companyData);
        return true;
    } catch (error) {
        console.error("Error creating company:", error);
        return false;
    }
};

export const addServiceToCompany = async (companyId: string, serviceData: any) => {
    try {
        const companyRef = doc(db, "empresas", companyId);
        const companyDoc = await getDoc(companyRef);
        
        if (companyDoc.exists()) {
            const companyData = companyDoc.data();
            const services = companyData.servicos || [];
            services.push(serviceData);
            
            await updateDoc(companyRef, { servicos: services });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error adding service:", error);
        return false;
    }
};

// Employee Operations
export const createEmployee = async (employeeId: string, employeeData: any) => {
    try {
        await setDoc(doc(db, "funcionarios", employeeId), employeeData);
        return true;
    } catch (error) {
        console.error("Error creating employee:", error);
        return false;
    }
};

// Appointment Operations
export const createAppointment = async (appointmentId: string, appointmentData: any) => {
    try {
        await setDoc(doc(db, "agendamentos", appointmentId), {
            ...appointmentData,
            status: "pendente",
            createdAt: new Date()
        });
        return true;
    } catch (error) {
        console.error("Error creating appointment:", error);
        return false;
    }
};

export const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
        const appointmentRef = doc(db, "agendamentos", appointmentId);
        await updateDoc(appointmentRef, { status: newStatus });
        return true;
    } catch (error) {
        console.error("Error updating appointment status:", error);
        return false;
    }
};

// Query Operations
export const getCompanyAppointments = async (companyId: string) => {
    try {
        const q = query(collection(db, "agendamentos"), where("empresaId", "==", companyId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting company appointments:", error);
        return [];
    }
};

export const getUserAppointments = async (userId: string) => {
    try {
        const q = query(collection(db, "agendamentos"), where("clienteId", "==", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting user appointments:", error);
        return [];
    }
};

export const getCompanyServices = async (companyId: string) => {
    try {
        const companyRef = doc(db, "empresas", companyId);
        const companyDoc = await getDoc(companyRef);
        if (companyDoc.exists()) {
            return companyDoc.data().servicos || [];
        }
        return [];
    } catch (error) {
        console.error("Error getting company services:", error);
        return [];
    }
}; 