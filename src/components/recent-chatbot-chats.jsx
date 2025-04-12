import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ChevronRight, Sparkles, Info } from "lucide-react";
import { useChatbot } from "@/contexts/chatbot-context";
import { useAuth } from "@/contexts/auth-context";

export const RecentChatbotChats = ({ maxItems = 2 }) => {
    const { getChatHistory, isLoading } = useChatbot();
    const { isAuthenticated } = useAuth();
    const [expandedView, setExpandedView] = useState(false);
    
    // Get the chats to display based on expanded state
    const chatsToDisplay = expandedView 
        ? getChatHistory() 
        : getChatHistory(maxItems);
    
    // Format date nicely
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };
    
    // If loading, show loading state
    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white p-6 shadow-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }
    
    // If not authenticated, show sign-in prompt
    if (!isAuthenticated) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold">Recent Chatbot Chats</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <Info className="mb-2 h-12 w-12 text-slate-400" />
                    <p className="text-slate-700">Sign in to see your recent chat history</p>
                    <div className="mt-4 flex gap-2">
                        <Link to="/signin" className="rounded-lg bg-[#1e628c] px-4 py-2 text-sm font-medium text-white hover:bg-[#174e70]">
                            Sign In
                        </Link>
                        <Link to="/signup" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    // If no chats, show empty state
    if (!chatsToDisplay || chatsToDisplay.length === 0) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold">Recent Chatbot Chats</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <MessageSquare className="mb-2 h-8 w-8 text-slate-400" />
                    <p className="text-slate-600">You haven't had any chats with the AI assistant yet.</p>
                    <Link to="/chatbot" className="mt-3 text-sm font-medium text-[#1e628c] hover:underline">
                        Start a new conversation
                    </Link>
                </div>
            </div>
        );
    }
    
    // Display chat history
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Chatbot Chats</h2>
                {getChatHistory().length > maxItems && (
                    <button
                        onClick={() => setExpandedView(!expandedView)}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        {expandedView ? "Show Less" : "View All"}
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                )}
            </div>
            
            <div className="space-y-4">
                {chatsToDisplay.map((chat) => (
                    <div 
                        key={chat.id} 
                        className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-slate-900">{chat.summary.title}</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {formatDate(chat.timestamp)} • {chat.summary.messageCount} messages
                                    </p>
                                </div>
                            </div>
                            
                            {/* Show conversation stats as badges */}
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
                                    <span>{chat.summary.userMsgCount}</span> 
                                    <span className="hidden sm:inline">questions</span>
                                </span>
                                <span className="flex items-center gap-1 rounded-full bg-[#1e628c]/10 px-2 py-1 text-xs font-medium text-[#1e628c]">
                                    <Sparkles className="h-3 w-3" />
                                    <span>{chat.summary.botMsgCount}</span>
                                    <span className="hidden sm:inline">responses</span>
                                </span>
                            </div>
                        </div>
                        
                        {/* Preview of conversation (first few messages) */}
                        {chat.messages && chat.messages.length > 0 && (
                            <div className="mt-3 max-h-20 overflow-hidden text-ellipsis border-t border-slate-200 pt-2 text-sm text-slate-600">
                                <div className="line-clamp-2">
                                    {chat.messages[0].content.length > 100 
                                        ? chat.messages[0].content.substring(0, 100) + "..." 
                                        : chat.messages[0].content}
                                </div>
                            </div>
                        )}
                        
                        {/* Link to chatbot - Update with conversationId */}
                        <div className="mt-3 flex justify-end">
                            <Link 
                                to={`/chatbot?conversationId=${chat.id}`}
                                className="text-xs font-medium text-[#1e628c] hover:underline"
                            >
                                Continue conversation →
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            
            {!expandedView && getChatHistory().length > maxItems && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({getChatHistory().length}) Chat Sessions
                </button>
            )}
            
            <div className="mt-4 text-center">
                <Link 
                    to="/chatbot"
                    className="text-sm font-medium text-[#1e628c] hover:underline"
                >
                    Start a new conversation
                </Link>
            </div>
        </div>
    );
};