import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Footer } from "@/layouts/footer";
import { MessageSquare, AlertCircle, Check, XCircle } from "lucide-react";
import { useChatbot } from "@/contexts/chatbot-context";
import { sendMessageToIframe, createIframeMessageHandler, loadChatHistory } from "@/utils/iframe-message-utils";

const ChatbotPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [chatEnded, setChatEnded] = useState(false);
    const [notification, setNotification] = useState(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const iframeRef = useRef(null);
    const { addChatSession, getChatHistory, deleteChatSession } = useChatbot();
    
    // Get conversation ID from URL if it exists
    const conversationId = searchParams.get('conversationId');
    
    // Keep track of current conversation
    const currentConversation = useRef([]);
    
    // Handle chat end (component unmounting or explicit end)
    const handleChatEnd = () => {
        if (chatEnded) return; // Prevent duplicate saves
        
        // Only save if there are actual messages
        if (currentConversation.current.length > 0) {
            console.log("Saving chat conversation:", currentConversation.current);
            
            // Add to chat history
            addChatSession({
                messages: currentConversation.current
            });
            
            // Show notification
            showNotification("success", "Chat conversation saved!");
            
            // Reset current conversation
            setChatEnded(true);
        }
    };
    
    // Load previous conversation if ID is provided
    useEffect(() => {
        const loadPreviousConversation = async () => {
            if (!conversationId || !iframeLoaded || !iframeRef.current) return;
            
            // Find the conversation in history
            const chatHistory = getChatHistory();
            const conversation = chatHistory.find(chat => chat.id.toString() === conversationId);
            
            if (conversation && conversation.messages && conversation.messages.length > 0) {
                console.log("Loading previous conversation:", conversation);
                
                // Set the current conversation for tracking
                currentConversation.current = [...conversation.messages];
                
                // Give the iframe a moment to initialize
                setTimeout(async () => {
                    // Load the conversation messages into the iframe
                    const success = await loadChatHistory(iframeRef.current, conversation.messages);
                    
                    if (success) {
                        console.log("Successfully loaded conversation history");
                    } else {
                        console.error("Failed to load conversation history");
                    }
                }, 1500);
            } else {
                // Conversation not found, clear the conversationId from URL
                if (conversationId) {
                    showNotification("error", "Conversation not found. Starting a new conversation.");
                    setSearchParams({});
                }
            }
        };
        
        loadPreviousConversation();
    }, [conversationId, getChatHistory, iframeLoaded, setSearchParams]);
    
    // Handle delete conversation
    const handleDeleteConversation = () => {
        if (!conversationId) return;
        
        if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
            // Delete the conversation
            const success = deleteChatSession(parseInt(conversationId));
            
            if (success) {
                showNotification("success", "Conversation deleted successfully");
                
                // Clear the URL parameter and redirect to a new chat
                setTimeout(() => {
                    setSearchParams({});
                    window.location.reload(); // Force reload to start fresh
                }, 1500);
            }
        }
    };
    
    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };
    
    // Check for chat end when component unmounts
    useEffect(() => {
        return () => {
            handleChatEnd();
        };
    }, []);
    
    // Set up the message handler for iframe communication
    useEffect(() => {
        const allowedOrigins = [
            "https://render-chatbot-di08.onrender.com",
            "https://render-chatbot.vercel.app",
            "https://render-chatbot.onrender.com"
        ];
        
        const messageHandlers = {
            chatMessage: (data) => {
                const { role, content } = data;
                
                // Add to current conversation
                currentConversation.current.push({
                    role,
                    content,
                    timestamp: new Date().toISOString()
                });
                
                console.log("Received chat message:", { role, content });
            },
            chatEnded: () => {
                handleChatEnd();
            }
        };
        
        const handleMessage = createIframeMessageHandler(allowedOrigins, messageHandlers);
        
        // Add event listener
        window.addEventListener("message", handleMessage);
        
        // Clean up
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [addChatSession]);

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
                <h1 className="title">AI Fitness Assistant</h1>
                
                {conversationId && (
                    <button
                        onClick={handleDeleteConversation}
                        className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                    >
                        <XCircle className="h-4 w-4" />
                        Delete Conversation
                    </button>
                )}
            </div>
            
            {/* Notification */}
            {notification && (
                <div 
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : 
                        notification.type === "error" ? "bg-red-100 text-red-800" : 
                        "bg-blue-100 text-blue-800"
                    }`}
                >
                    {notification.type === "success" ? (
                        <Check className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="relative w-full h-[700px] rounded-xl overflow-hidden bg-white dark:bg-slate-950 shadow-md">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent dark:border-blue-400"></div>
                    </div>
                )}
                
                <div className="h-full w-full p-0">
                    <iframe 
                        ref={iframeRef}
                        src="https://render-chatbot-di08.onrender.com" 
                        className="h-full w-full border-0"
                        onLoad={() => {
                            setIsLoading(false);
                            setIframeLoaded(true);
                            setChatEnded(false); // Reset chat ended flag on new load
                            
                            // Don't reset conversation if we're loading a previous one
                            if (!conversationId) {
                                currentConversation.current = []; // Reset conversation
                            }
                        }}
                        title="Chatbot Interface"
                        style={{ borderRadius: '0.75rem' }}
                    ></iframe>
                </div>
            </div>
            
            <div className="text-center text-sm text-slate-600">
                <p>Your chat conversations are automatically saved when you finish chatting.</p>
            </div>

            <Footer />
        </div>
    );
};

export default ChatbotPage;
