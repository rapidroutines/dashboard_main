import { useState, useEffect, useRef } from "react";
import { Loader2, Info, Check } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useExercises } from "@/contexts/exercise-context";

const RepBotPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const { isAuthenticated } = useAuth();
    const { addExercise } = useExercises();
    const iframeRef = useRef(null);
    
    // Listen for messages from the iframe
    useEffect(() => {
        if (!isAuthenticated) return; // Only track for authenticated users
        
        const handleMessage = (event) => {
            // Only accept messages from our iframe source domains
            if (
                event.origin !== "https://render-repbot.vercel.app" && 
                event.origin !== "https://render-repbot.onrender.com"
            ) {
                return;
            }
            
            // Check if it's an exercise completion message
            if (event.data && event.data.type === "exerciseCompleted") {
                const { exerciseType, repCount } = event.data;
                
                // Log the exercise to the user's history
                const success = addExercise({
                    exerciseType: exerciseType,
                    count: repCount
                });
                
                if (success) {
                    showNotification("success", `${repCount} rep${repCount !== 1 ? "s" : ""} of ${formatExerciseType(exerciseType)} saved to your log!`);
                }
            }
        };
        
        // Add the event listener
        window.addEventListener("message", handleMessage);
        
        // Clean up
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [isAuthenticated, addExercise]);
    
    // For backwards compatibility, check localStorage as a fallback
    useEffect(() => {
        if (!isAuthenticated) return;
        
        const checkLocalStorageForExercises = () => {
            try {
                const repbotExerciseKey = "repbot_lastExercise";
                const storedExercise = localStorage.getItem(repbotExerciseKey);
                
                if (storedExercise) {
                    // Parse the stored exercise data
                    const exerciseData = JSON.parse(storedExercise);
                    
                    // Check if this is a new exercise (hasn't been processed yet)
                    if (!exerciseData.processed) {
                        // Log the exercise
                        const success = addExercise({
                            exerciseType: exerciseData.type,
                            count: exerciseData.count
                        });
                        
                        if (success) {
                            showNotification("success", `${exerciseData.count} rep(s) of ${formatExerciseType(exerciseData.type)} saved to your log!`);
                            
                            // Mark as processed and save back to localStorage
                            localStorage.setItem(repbotExerciseKey, JSON.stringify({
                                ...exerciseData,
                                processed: true
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking localStorage for exercises:", error);
            }
        };
        
        // Check for exercises periodically
        const interval = setInterval(checkLocalStorageForExercises, 1000);
        
        // Also check when the component mounts
        checkLocalStorageForExercises();
        
        return () => clearInterval(interval);
    }, [isAuthenticated, addExercise]);
    
    // Format exercise type name nicely
    const formatExerciseType = (exerciseType) => {
        const names = {
            bicepCurl: "Bicep Curl",
            squat: "Squat",
            pushup: "Push-up",
            shoulderPress: "Shoulder Press",
            tricepExtension: "Tricep Extension",
            lunge: "Lunge",
            russianTwist: "Russian Twist"
        };
        
        return names[exerciseType] || exerciseType;
    };
    
    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-60px)]">
            {/* Notification */}
            {notification && (
                <div 
                    className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-3 pr-4 shadow-md transition-all max-w-md ${
                        notification.type === "success" ? "bg-green-100 text-green-800" : 
                        notification.type === "error" ? "bg-red-100 text-red-800" : 
                        "bg-blue-100 text-blue-800"
                    }`}
                >
                    {notification.type === "success" ? (
                        <Check className="h-5 w-5 flex-shrink-0" />
                    ) : (
                        <Info className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}
            
            <div className="relative flex-1 w-full overflow-hidden bg-white dark:bg-slate-950 rounded-lg shadow-sm">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#1e628c]" />
                            <p className="mt-2 text-slate-600 dark:text-slate-300">Loading RepBot...</p>
                        </div>
                    </div>
                )}
                
                <iframe 
                    ref={iframeRef}
                    src="https://render-repbot.vercel.app/" 
                    className="w-full h-full border-0"
                    title="RepBot AI Exercise Counter"
                    onLoad={() => setIsLoading(false)}
                    allow="camera; microphone; accelerometer; gyroscope; fullscreen"
                    allowFullScreen
                    style={{ borderRadius: '0.5rem' }}
                />
                
                {isAuthenticated ? (
                    <div className="absolute bottom-4 left-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm flex items-center">
                        <Check className="h-4 w-4 mr-2" /> Your completed exercises will be saved to your account
                    </div>
                ) : (
                    <div className="absolute bottom-4 left-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm flex items-center">
                        <Info className="h-4 w-4 mr-2" /> Sign in to save your exercise progress
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepBotPage;
