// 1. UPDATED EXERCISE CONTEXT (replaces src/contexts/exercise-context.jsx)
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

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

// 2. UPDATED CHATBOT CONTEXT (replaces src/contexts/chatbot-context.jsx)
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

// Create chatbot history context
const ChatbotContext = createContext({
    chatHistory: [],
    addChatSession: () => {},
    getChatHistory: () => [],
    isLoading: false,
});

export const ChatbotProvider = ({ children }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load chat history from localStorage on initial render
    useEffect(() => {
        const loadChatHistoryFromStorage = () => {
            try {
                const storedHistory = localStorage.getItem(`chatbot_history_data`);
                
                if (storedHistory) {
                    const parsedHistory = JSON.parse(storedHistory);
                    setChatHistory(parsedHistory);
                    console.log("Loaded chatbot history from storage:", parsedHistory.length);
                } else {
                    console.log("No stored chatbot history found");
                    setChatHistory([]);
                }
            } catch (error) {
                console.error("Error loading chatbot history from storage:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChatHistoryFromStorage();
    }, []);

    // Save chat history to localStorage whenever it changes
    useEffect(() => {
        const saveChatHistoryToStorage = () => {
            try {
                if (chatHistory.length > 0) {
                    localStorage.setItem(`chatbot_history_data`, JSON.stringify(chatHistory));
                    console.log("Saved chatbot history to storage:", chatHistory.length);
                }
            } catch (error) {
                console.error("Error saving chatbot history to storage:", error);
            }
        };

        if (!isLoading) {
            saveChatHistoryToStorage();
        }
    }, [chatHistory, isLoading]);

    // Generate a summary based on conversation
    const generateSummary = (messages) => {
        // Simple summary generator - uses first user message for title
        // and counts messages to determine length
        if (!messages || messages.length === 0) return "";
        
        // Find first user message for title
        const firstUserMessage = messages.find(m => m.role === "user")?.content || "Chat session";
        
        // Create a title from first user message (limited to 40 chars)
        let title = firstUserMessage.length > 40 
            ? firstUserMessage.substring(0, 40) + "..." 
            : firstUserMessage;
            
        // Count messages
        const userMsgCount = messages.filter(m => m.role === "user").length;
        const botMsgCount = messages.filter(m => m.role === "assistant").length;
        
        return {
            title,
            messageCount: messages.length,
            userMsgCount,
            botMsgCount
        };
    };

    // Add a new chat session
    const addChatSession = (sessionData) => {
        const newSession = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            messages: sessionData.messages || [],
            summary: generateSummary(sessionData.messages)
        };

        console.log("Adding new chat session:", newSession);
        
        setChatHistory(prevHistory => {
            const updatedHistory = [newSession, ...prevHistory];
            
            // Also update in localStorage immediately for redundancy
            try {
                localStorage.setItem(`chatbot_history_data`, JSON.stringify(updatedHistory));
                console.log("Updated chatbot history in storage:", updatedHistory.length);
            } catch (error) {
                console.error("Error immediately saving chat history to storage:", error);
            }
            
            return updatedHistory;
        });
        
        return true;
    };

    // Get chat history with optional filtering
    const getChatHistory = (count = null) => {
        if (!chatHistory || chatHistory.length === 0) return [];
        
        // Return limited number if count is specified
        return count ? chatHistory.slice(0, count) : chatHistory;
    };

    return (
        <ChatbotContext.Provider
            value={{
                chatHistory,
                addChatSession,
                getChatHistory,
                isLoading,
            }}
        >
            {children}
        </ChatbotContext.Provider>
    );
};

ChatbotProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    
    if (context === undefined) {
        throw new Error("useChatbot must be used within a ChatbotProvider");
    }
    
    return context;
};

// 3. UPDATED SAVED EXERCISES CONTEXT (replaces src/contexts/saved-exercises-context.jsx)
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
