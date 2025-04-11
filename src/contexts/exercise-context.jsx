import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./auth-context";

// Create exercise tracking context
const ExerciseContext = createContext({
    exercises: [],
    addExercise: () => {},
    getExercises: () => [],
    isLoading: false,
});

export const ExerciseProvider = ({ children }) => {
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Load exercises from localStorage on initial render
    useEffect(() => {
        const loadExercisesFromStorage = () => {
            try {
                if (isAuthenticated && user) {
                    const userId = user.email; // Use email as unique identifier
                    const storedExercises = localStorage.getItem(`exercises_${userId}`);
                    
                    if (storedExercises) {
                        const parsedExercises = JSON.parse(storedExercises);
                        setExercises(parsedExercises);
                        console.log("Loaded exercises from storage:", parsedExercises.length);
                    } else {
                        console.log("No stored exercises found for user:", userId);
                        setExercises([]);
                    }
                } else {
                    console.log("User not authenticated, no exercises loaded");
                }
            } catch (error) {
                console.error("Error loading exercises from storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadExercisesFromStorage();
    }, [isAuthenticated, user]);

    // Save exercises to localStorage whenever they change
    useEffect(() => {
        const saveExercisesToStorage = () => {
            try {
                if (isAuthenticated && user && exercises.length > 0) {
                    const userId = user.email;
                    localStorage.setItem(`exercises_${userId}`, JSON.stringify(exercises));
                    console.log("Saved exercises to storage:", exercises.length);
                }
            } catch (error) {
                console.error("Error saving exercises to storage:", error);
            }
        };

        if (!isLoading) {
            saveExercisesToStorage();
        }
    }, [exercises, isAuthenticated, user, isLoading]);

    // Add a new exercise record
    const addExercise = (exerciseData) => {
        if (!isAuthenticated || !user) {
            console.log("User not authenticated, can't add exercise");
            return false;
        }

        const newExercise = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...exerciseData
        };

        console.log("Adding new exercise:", newExercise);
        
        setExercises(prevExercises => {
            const updatedExercises = [...prevExercises, newExercise];
            
            // Also update in localStorage immediately for redundancy
            try {
                const userId = user.email;
                localStorage.setItem(`exercises_${userId}`, JSON.stringify(updatedExercises));
                console.log("Updated exercises in storage:", updatedExercises.length);
            } catch (error) {
                console.error("Error immediately saving exercise to storage:", error);
            }
            
            return updatedExercises;
        });
        
        return true;
    };

    // Get exercises with optional filtering
    const getExercises = (count = null) => {
        if (!exercises || exercises.length === 0) return [];
        
        // Sort by timestamp (newest first)
        const sortedExercises = [...exercises].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Return limited number if count is specified
        return count ? sortedExercises.slice(0, count) : sortedExercises;
    };

    return (
        <ExerciseContext.Provider
            value={{
                exercises,
                addExercise,
                getExercises,
                isLoading,
            }}
        >
            {children}
        </ExerciseContext.Provider>
    );
};

ExerciseProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useExercises = () => {
    const context = useContext(ExerciseContext);
    
    if (context === undefined) {
        throw new Error("useExercises must be used within an ExerciseProvider");
    }
    
    return context;
};
