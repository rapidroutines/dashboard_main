import { useState } from "react";
import { MessageSquare, Sparkles, Info } from "lucide-react";
import { useChatbot } from "@/contexts/chatbot-context";
import { useAuth } from "@/contexts/auth-context";
import { useMediaQuery } from "@uidotdev/usehooks";

export const RecentChatbotChats = ({ maxItems = 2 }) => {
    const { getChatHistory, isLoading } = useChatbot();
    const { isAuthenticated } = useAuth();
    const [expandedView, setExpandedView] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");
    
    // Get the chats to display based on expanded state
    const chatsToDisplay = expandedView 
        ? getChatHistory() 
        : getChatHistory(maxItems);
    
    // Format date nicely with responsive options
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: isMobile ? undefined : 'numeric',
            minute: isMobile ? undefined : 'numeric',
            hour12: true
        }).format(date);
    };
    
    // If loading, show loading state
    if (isLoading) {
        return (
            <div className="flex h-32 sm:h-40 items-center justify-center rounded-lg bg-white p-4 sm:p-6 shadow-md">
                <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }
    
    // If not authenticated, show sign-in prompt
    if (!isAuthenticated) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-md">
                <h2 className="mb-4 text-lg sm:text-xl font-bold">Recent Chatbot Chats</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-4 sm:p-6 text-center">
                    <Info className="mb-2 h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
                    <p className="text-sm sm:text-base text-slate-700">Sign in to see your recent chat history</p>
                </div>
            </div>
        );
    }
    
    // If no chats, show empty state
    if (!chatsToDisplay || chatsToDisplay.length === 0) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-md">
                <h2 className="mb-4 text-lg sm:text-xl font-bold">Recent Chatbot Chats</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-4 sm:p-6 text-center">
                    <MessageSquare className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    <p className="text-sm sm:text-base text-slate-600">You haven't had any chats with the AI assistant yet.</p>
                </div>
            </div>
        );
    }
    
    // Display chat history
    return (
        <div className="rounded-xl bg-white p-4 sm:p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold">Recent Chatbot Chats</h2>
                {getChatHistory().length > maxItems && (
                    <button
                        onClick={() => setExpandedView(!expandedView)}
                        className="flex items-center gap-1 text-xs sm:text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        {expandedView ? "Show Less" : "View All"}
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                {chatsToDisplay.map((chat) => (
                    <div 
                        key={chat.id} 
                        className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4 transition-all hover:border-slate-300 hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-medium text-slate-900 line-clamp-1">{chat.summary.title}</h3>
                                    <p className="mt-0.5 sm:mt-1 text-xs text-slate-500">
                                        {formatDate(chat.timestamp)} • {chat.summary.messageCount} messages
                                    </p>
                                </div>
                            </div>
                            
                            {/* Show conversation stats as badges - responsive sizes */}
                            <div className="ml-2 flex-shrink-0 flex gap-1 sm:gap-2">
                                <span className="flex items-center gap-0.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-700">
                                    <span>{chat.summary.userMsgCount}</span> 
                                </span>
                                <span className="flex items-center gap-0.5 rounded-full bg-[#1e628c]/10 px-1.5 py-0.5 text-xs font-medium text-[#1e628c]">
                                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    <span>{chat.summary.botMsgCount}</span>
                                </span>
                            </div>
                        </div>
                        
                        {/* Preview of conversation (first few messages) - only show on larger screens */}
                        {chat.messages && chat.messages.length > 0 && (
                            <div className="mt-2 sm:mt-3 max-h-12 sm:max-h-20 overflow-hidden text-ellipsis border-t border-slate-200 pt-2 text-xs sm:text-sm text-slate-600">
                                <div className="line-clamp-2">
                                    {chat.messages[0].content.length > (isMobile ? 60 : 100)
                                        ? chat.messages[0].content.substring(0, isMobile ? 60 : 100) + "..." 
                                        : chat.messages[0].content}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {!expandedView && getChatHistory().length > maxItems && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({getChatHistory().length}) Chat Sessions
                </button>
            )}
        </div>
    );
};
