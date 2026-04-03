import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { OAuthProvider } from "react-native-appwrite";
import { account } from "../lib/appwrite";
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

type User = {
    $id: string;
    email: string;
    name: string;
};

type AuthContextType = {
    user: User | null;
    isInitialising: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialising, setIsInitialising] = useState(true);

    // Restore existing session on app start
    useEffect(() => {
        account
            .get()
            .then((u) => setUser({ $id: u.$id, email: u.email, name: u.name }))
            .catch(() => setUser(null))
            .finally(() => setIsInitialising(false));
    }, []);

    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        const u = await account.get();
        setUser({ $id: u.$id, email: u.email, name: u.name });
    };

    const register = async (name: string, email: string, password: string) => {
        await account.create("unique()", email, password, name);
        await account.createEmailPasswordSession(email, password);
        const u = await account.get();
        setUser({ $id: u.$id, email: u.email, name: u.name });
    };

    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
    };

    const loginWithGoogle = async () => {
        const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
        const scheme = `${deepLink.protocol}//`;

        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${deepLink}`,
            `${deepLink}`,
            ["profile", "email", "openid"]
        );

        const result = await WebBrowser.openAuthSessionAsync(`${loginUrl}`, scheme);

        if (result.type === 'success' && result.url) {
            const url = new URL(result.url);
            const secret = url.searchParams.get('secret');
            const userId = url.searchParams.get('userId');

            if (secret && userId) {
                await account.createSession(userId, secret);
                const u = await account.get();
                setUser({ $id: u.$id, email: u.email, name: u.name });
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, isInitialising, login, register, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
