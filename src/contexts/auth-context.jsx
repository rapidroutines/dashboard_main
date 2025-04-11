import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

// Create the auth context with default values
const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    isLoading: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on initial render
    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const storedUser = localStorage.getItem("user");
                console.log("Loading stored user data:", storedUser);
                
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    console.log("User authenticated from storage:", parsedUser);
                } else {
                    console.log("No user found in storage");
                }
            } catch (error) {
                console.error("Error loading user from storage:", error);
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromStorage();
    }, []);

    // Function to handle user login
    const login = (userData) => {
        console.log("Login called with data:", userData);
        
        // Always ensure we're storing an object with essential user info
        const userToStore = {
            ...userData,
            email: userData.email || "user@example.com",
            name: userData.name || userData.email?.split('@')[0] || "User",
            lastLogin: new Date().toISOString()
        };
        
        // Store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userToStore));
        
        // Update state
        setUser(userToStore);
        setIsAuthenticated(true);
        
        console.log("User logged in successfully:", userToStore);
        return true;
    };

    // Function to handle user logout
    const logout = () => {
        console.log("Logging out user");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    
    return context;
};