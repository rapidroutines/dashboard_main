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
