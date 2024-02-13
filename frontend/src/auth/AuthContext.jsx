import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    const login = () => {
        setLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear();
        setLoggedIn(false);
        toast.success('Logout Successful');
    };

    const nikhilKaLogin = localStorage.getItem("token") !== undefined && localStorage.getItem("token") !== null;

    return (
        <AuthContext.Provider value={{nikhilKaLogin , login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
