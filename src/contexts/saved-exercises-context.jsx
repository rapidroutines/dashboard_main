import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";

// Create saved exercises context
const SavedExercisesContext = createContext({
    savedExercises: [],
    addSavedExercise: () => {},
    removeSavedExercise: () => {},
    isSaved: () => false,
    isLoading: false,
});

export const SavedExercisesProvider = ({ children }) => {
    const [savedExercises, setSavedExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Load saved exercises from localStorage on initial render
    useEffect(() => {
        const loadSavedExercisesFromStorage = () => {
            try {
                if (isAuthenticated && user) {
                    const userId = user.email; // Use email as unique identifier
                    const storedExercises = localStorage.getItem(`savedExercises_${userId}`);
                    
                    if (storedExercises) {
                        const parsedExercises = JSON.parse(storedExercises);
                        setSavedExercises(parsedExercises);
                        console.log("Loaded saved exercises from storage:", parsedExercises.length);
                    } else {
                        console.log("No stored saved exercises found for user:", userId);
                        setSavedExercises([]);
                    }
                } else {
                    console.log("User not authenticated, no saved exercises loaded");
                }
            } catch (error) {
                console.error("Error loading saved exercises from storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedExercisesFromStorage();
    }, [isAuthenticated, user]);

    // Save exercises to localStorage whenever they change
    useEffect(() => {
        const saveSavedExercisesToStorage = () => {
            try {
                if (isAuthenticated && user) {
                    const userId = user.email;
                    localStorage.setItem(`savedExercises_${userId}`, JSON.stringify(savedExercises));
                    console.log("Saved exercises to storage:", savedExercises.length);
                }
            } catch (error) {
                console.error("Error saving exercises to storage:", error);
            }
        };

        if (!isLoading) {
            saveSavedExercisesToStorage();
        }
    }, [savedExercises, isAuthenticated, user, isLoading]);

    // Add a new saved exercise
    const addSavedExercise = (exerciseData) => {
        if (!isAuthenticated || !user) {
            console.log("User not authenticated, can't save exercise");
            return false;
        }

        if (!exerciseData.id) {
            console.error("Exercise data missing ID");
            return false;
        }

        // Check if already saved
        if (savedExercises.some(ex => ex.id === exerciseData.id)) {
            console.log("Exercise already saved");
            return false;
        }

        console.log("Adding saved exercise:", exerciseData);
        
        setSavedExercises(prevExercises => {
            const updatedExercises = [...prevExercises, exerciseData];
            
            // Also update in localStorage immediately for redundancy
            try {
                const userId = user.email;
                localStorage.setItem(`savedExercises_${userId}`, JSON.stringify(updatedExercises));
                console.log("Updated saved exercises in storage:", updatedExercises.length);
            } catch (error) {
                console.error("Error immediately saving exercise to storage:", error);
            }
            
            return updatedExercises;
        });
        
        return true;
    };

    // Remove a saved exercise
    const removeSavedExercise = (exerciseId) => {
        if (!isAuthenticated || !user) {
            console.log("User not authenticated, can't remove saved exercise");
            return false;
        }

        setSavedExercises(prevExercises => {
            const updatedExercises = prevExercises.filter(ex => ex.id !== exerciseId);
            
            // Also update in localStorage immediately
            try {
                const userId = user.email;
                localStorage.setItem(`savedExercises_${userId}`, JSON.stringify(updatedExercises));
                console.log("Updated saved exercises in storage after removal:", updatedExercises.length);
            } catch (error) {
                console.error("Error saving updated exercises to storage:", error);
            }
            
            return updatedExercises;
        });
        
        return true;
    };

    // Check if an exercise is saved
    const isSaved = (exerciseId) => {
        return savedExercises.some(ex => ex.id === exerciseId);
    };

    return (
        <SavedExercisesContext.Provider
            value={{
                savedExercises,
                addSavedExercise,
                removeSavedExercise,
                isSaved,
                isLoading,
            }}
        >
            {children}
        </SavedExercisesContext.Provider>
    );
};

SavedExercisesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useSavedExercises = () => {
    const context = useContext(SavedExercisesContext);
    
    if (context === undefined) {
        throw new Error("useSavedExercises must be used within a SavedExercisesProvider");
    }
    
    return context;
};
