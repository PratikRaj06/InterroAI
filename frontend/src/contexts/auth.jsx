import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdToken } from "firebase/auth";
import { auth } from "../firebase.jsx";
export const AuthContext = createContext({
    isAuthenticated: false,
    data: null,
    accessToken: null,
    loading: true,
});

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if (user) {
                const loginAt = user.metadata.lastSignInTime;
                const sevenDaysInMS = 7 * 24 * 60 * 60 * 1000;
                const currentTime = new Date().getTime();

                if (currentTime - new Date(loginAt).getTime() > sevenDaysInMS) {
                    signOut(auth).catch(error => alert("Error in signing out!"));
                    setIsAuthenticated(false);
                    setData(null)
                    setData(null)
                } else {
                    const token = await getIdToken(user);
                    setIsAuthenticated(true);
                    setData(user.providerData[0])
                    setAccessToken(token)
                }
            } else {
                setIsAuthenticated(false);
                setData(null)
                setAccessToken(null)
            }
            setLoading(false)

        });
        
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, data , accessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
