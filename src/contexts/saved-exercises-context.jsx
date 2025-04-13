import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

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

    // Load saved exercises from localStorage on initial render
    useEffect(() => {
        const loadSavedExercisesFromStorage = () => {
            try {
                const storedExercises = localStorage.getItem(`savedExercises_data`);
                
                if (storedExercises) {
                    const parsedExercises = JSON.parse(storedExercises);
                    setSavedExercises(parsedExercises);
                    console.log("Loaded saved exercises from storage:", parsedExercises.length);
                } else {
                    console.log("No stored saved exercises found");
                    setSavedExercises([]);
                }
            } catch (error) {
                console.error("Error loading saved exercises from storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedExercisesFromStorage();
    }, []);

    // Save exercises to localStorage whenever they change
    useEffect(() => {
        const saveSavedExercisesToStorage = () => {
            try {
                localStorage.setItem(`savedExercises_data`, JSON.stringify(savedExercises));
                console.log("Saved exercises to storage:", savedExercises.length);
            } catch (error) {
                console.error("Error saving exercises to storage:", error);
            }
        };

        if (!isLoading) {
            saveSavedExercisesToStorage();
        }
    }, [savedExercises, isLoading]);

    // Add a new saved exercise
    const addSavedExercise = (exerciseData) => {
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
                localStorage.setItem(`savedExercises_data`, JSON.stringify(updatedExercises));
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
        setSavedExercises(prevExercises => {
            const updatedExercises = prevExercises.filter(ex => ex.id !== exerciseId);
            
            // Also update in localStorage immediately
            try {
                localStorage.setItem(`savedExercises_data`, JSON.stringify(updatedExercises));
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
