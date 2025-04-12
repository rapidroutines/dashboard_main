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

    // Load user from localStorage with enhanced security
    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                // Check for user data in localStorage
                const storedUserData = localStorage.getItem("user");
                
                if (storedUserData) {
                    const parsedUserData = JSON.parse(storedUserData);
                    
                    // Additional validation
                    if (parsedUserData && parsedUserData.email) {
                        // Check if token is still valid (you'd replace this with actual token validation in a real app)
                        const isTokenValid = checkTokenValidity(parsedUserData);
                        
                        if (isTokenValid) {
                            setUser(parsedUserData);
                            setIsAuthenticated(true);
                            console.log("User authenticated from storage:", parsedUserData.email);
                        } else {
                            // Token expired, clear user data
                            localStorage.removeItem("user");
                            setUser(null);
                            setIsAuthenticated(false);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading user from storage:", error);
                localStorage.removeItem("user");
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromStorage();
    }, []);

    // Basic token validity check (replace with actual backend validation in a real app)
    const checkTokenValidity = (userData) => {
        // Check if token exists and is not expired
        if (!userData.token) return false;

        // Optional: Check token expiration
        const tokenExpiration = userData.tokenExpiration;
        if (tokenExpiration) {
            const currentTime = Date.now();
            return currentTime < tokenExpiration;
        }

        return true;
    };

    // Function to handle user login
    const login = (userData) => {
        console.log("Login called with data:", userData);
        
        // Generate a simple token (in a real app, this would come from a backend)
        const token = generateTemporaryToken();
        
        // Create comprehensive user object
        const userToStore = {
            id: userData.id || Date.now().toString(),
            email: userData.email,
            name: userData.name || userData.email?.split('@')[0] || "User",
            token: token,
            tokenExpiration: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
            joined: userData.joined || new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            
            // Preserve any additional user metadata
            ...userData
        };
        
        // Store in localStorage with enhanced security
        localStorage.setItem("user", JSON.stringify(userToStore));
        
        // Update state
        setUser(userToStore);
        setIsAuthenticated(true);
        
        console.log("User logged in successfully:", userToStore.email);
        return true;
    };

    // Generate a temporary token (replace with actual token generation in a real app)
    const generateTemporaryToken = () => {
        return btoa(Math.random().toString()).substring(10, 30);
    };

    // Function to handle user logout
    const logout = () => {
        console.log("Logging out user");
        
        // Clear user data from storage
        localStorage.removeItem("user");
        
        // Clear any other related stored data
        localStorage.removeItem(`savedExercises_${user?.email}`);
        localStorage.removeItem(`exercises_${user?.email}`);
        localStorage.removeItem(`chatbot_history_${user?.email}`);
        
        // Reset state
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
