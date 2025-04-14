import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

// Create exercise tracking context
const ExerciseContext = createContext({
    exercises: [],
    addExercise: () => {},
    getExercises: () => [],
    deleteExercise: () => {},
    deleteAllExercises: () => {},
    isLoading: false,
});

export const ExerciseProvider = ({ children }) => {
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load exercises from localStorage on initial render
    useEffect(() => {
        const loadExercisesFromStorage = () => {
            try {
                const storedExercises = localStorage.getItem(`exercises_data`);
                
                if (storedExercises) {
                    const parsedExercises = JSON.parse(storedExercises);
                    setExercises(parsedExercises);
                    console.log("Loaded exercises from storage:", parsedExercises.length);
                } else {
                    console.log("No stored exercises found");
                    setExercises([]);
                }
            } catch (error) {
                console.error("Error loading exercises from storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadExercisesFromStorage();
    }, []);

    // Save exercises to localStorage whenever they change
    useEffect(() => {
        const saveExercisesToStorage = () => {
            try {
                if (exercises.length > 0) {
                    localStorage.setItem(`exercises_data`, JSON.stringify(exercises));
                    console.log("Saved exercises to storage:", exercises.length);
                } else {
                    // Remove the item from localStorage if exercises are empty
                    localStorage.removeItem(`exercises_data`);
                    console.log("Removed exercises from storage (empty)");
                }
            } catch (error) {
                console.error("Error saving exercises to storage:", error);
            }
        };

        if (!isLoading) {
            saveExercisesToStorage();
        }
    }, [exercises, isLoading]);

    // Add a new exercise record
    const addExercise = (exerciseData) => {
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
                localStorage.setItem(`exercises_data`, JSON.stringify(updatedExercises));
                console.log("Updated exercises in storage:", updatedExercises.length);
            } catch (error) {
                console.error("Error immediately saving exercise to storage:", error);
            }
            
            return updatedExercises;
        });
        
        return true;
    };
    
    // Delete a specific exercise by ID
    const deleteExercise = (exerciseId) => {
        if (!exerciseId) return false;
        
        setExercises(prevExercises => {
            const updatedExercises = prevExercises.filter(exercise => exercise.id !== exerciseId);
            
            // Update in localStorage immediately
            try {
                if (updatedExercises.length > 0) {
                    localStorage.setItem(`exercises_data`, JSON.stringify(updatedExercises));
                } else {
                    localStorage.removeItem(`exercises_data`);
                }
                console.log("Updated exercises in storage after deletion:", updatedExercises.length);
            } catch (error) {
                console.error("Error saving updated exercises to storage:", error);
            }
            
            return updatedExercises;
        });
        
        return true;
    };
    
    // Delete all exercises
    const deleteAllExercises = () => {
        if (confirm("Are you sure you want to delete all exercise records? This action cannot be undone.")) {
            setExercises([]);
            
            // Remove from localStorage immediately
            try {
                localStorage.removeItem(`exercises_data`);
                console.log("Removed all exercises from storage");
            } catch (error) {
                console.error("Error removing exercises from storage:", error);
            }
            
            return true;
        }
        
        return false;
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
                deleteExercise,
                deleteAllExercises,
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
