'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, User as IUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { Box, CircularProgress } from '@mui/material';
import { User as OUser } from "@/types";
import { doc, getDoc } from 'firebase/firestore';

type User = OUser & {
    email: IUser['email']
}
interface AuthContextProps {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getUserData = async (uid: string) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { ...docSnap.data(), id: uid } as OUser;
        }
        return null;
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser?.uid) return;
            const userData = await getUserData(firebaseUser?.uid);
            setUser({ name: firebaseUser.displayName, email: firebaseUser.email, ...userData } as User);
            setLoading(false);

            if (!firebaseUser) {
                router.replace('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                bgcolor="background.default">
                <CircularProgress size={48} thickness={4} />
            </Box>
        );
    }


    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
