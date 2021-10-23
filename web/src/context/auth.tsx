import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string;
    login: string;
    name: string;
    avatar_url: string;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}
type AuthProvider = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);


export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=91debc9f3e782f171d98`

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        });

        const { user, token } = response.data;

        localStorage.setItem('@dowhile:token', token);
        api.defaults.headers.common.authorization =`Bearer ${token}`
        setUser(user);

    }

    function signOut() {
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if (token) {
            api.defaults.headers.common.authorization =`Bearer ${token}`
            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')
            window.history.pushState({}, '', urlWithoutCode);
            signIn(githubCode);

        }
    }, [])
    return(
        <AuthContext.Provider value={{ signInUrl, user, signOut}}>
            {props.children}
        </AuthContext.Provider>

    );
}