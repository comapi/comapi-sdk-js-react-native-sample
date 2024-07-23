import React, { createContext, useState } from 'react'

export const TokenContext = createContext<any>({})

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState({})
    console.log(`TokenProvider::token: ${token}`);
    console.log(`TokenProvider::setToken: ${setToken}`);
    const value = {
        token,
        setToken,
    }

    return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}