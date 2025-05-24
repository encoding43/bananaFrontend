import { createContext, useEffect, useState } from "react";
import { TOKEN_NAME } from "../constants";





export const AuthContext = createContext(null)

const AuthContextProvider = ({ children }) => {
    // const [token, setToken] = useContext(AuthContext)
    const [token, setToken] = useState(() => {
        const storeToken = localStorage.getItem(TOKEN_NAME)
        return storeToken
    })
    // console.log('token', token)
    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_NAME, token);
        } else {
            //remove token
            // localStorage.removeItem(TOKEN_NAME);
        }
    }, [token])

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContextProvider
