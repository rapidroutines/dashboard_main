import { useState } from "react";
import { useSavedExercises } from "@/contexts/saved-exercises-context";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";
import { Dumbbell, ChevronRight, Trash2, InfoIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export const SavedExercises = ({ maxItems = 4 }) => {
    const { savedExercises, removeSavedExercise, isLoading } = useSavedExercises();
    const { isAuthenticated } = useAuth();
    const [expandedView, setExpandedView] = useState(false);
    
    // Get the exercises to display based on expanded state
    const exercisesToDisplay = expandedView 
        ? savedExercises 
        : savedExercises.slice(0, maxItems);
    
    // Handle exercise removal
    const handleRemove = (e, exerciseId) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (confirm("Are you sure you want to remove this exercise from your saved list?")) {
            removeSavedExercise(exerciseId);
        }
    };
    
    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            calisthenics: "bg-[#1e628c] text-white",
            core: "bg-[#f97316] text-white",
            mobility: "bg-[#10b981] text-white"
        };
        return colors[category] || "bg-slate-700 text-white";
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
                <h2 className="mb-4 text-xl font-bold">Saved Exercises</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <InfoIcon className="mb-2 h-12 w-12 text-slate-400" />
                    <p className="text-slate-700">Sign in to save and track your favorite exercises</p>
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
    
    // If no saved exercises, show empty state
    if (!savedExercises || savedExercises.length === 0) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-bold">Saved Exercises</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <Dumbbell className="mb-2 h-8 w-8 text-slate-400" />
                    <p className="text-slate-600">You haven't saved any exercises yet.</p>
                    <Link to="/library" className="mt-3 text-sm font-medium text-[#1e628c] hover:underline">
                        Explore exercise library
                    </Link>
                </div>
            </div>
        );
    }
    
    // Display saved exercises
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Saved Exercises</h2>
                {savedExercises.length > maxItems && (
                    <button
                        onClick={() => setExpandedView(!expandedView)}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        {expandedView ? "Show Less" : "View All"}
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {exercisesToDisplay.map((exercise) => (
                    <Link 
                        key={exercise.id} 
                        to="/library" 
                        className="group relative flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition-all hover:border-slate-300 hover:shadow-sm"
                    >
                        <div className="relative h-[80px] min-w-[80px] overflow-hidden">
                            <img 
                                src={exercise.image} 
                                alt={exercise.title}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-3">
                            <div>
                                <div className="flex justify-between">
                                    <h3 className="font-medium text-slate-900">{exercise.title}</h3>
                                    <button 
                                        onClick={(e) => handleRemove(e, exercise.id)}
                                        className="opacity-0 transition-opacity group-hover:opacity-100"
                                        aria-label="Remove from saved"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                                    </button>
                                </div>
                                <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                    {exercise.description}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <span className={cn(
                                    "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                                    getCategoryColor(exercise.category)
                                )}>
                                    {exercise.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <span 
                                            key={level}
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                level <= exercise.difficulty 
                                                    ? "bg-slate-500" 
                                                    : "bg-slate-200"
                                            )}
                                            style={{
                                                backgroundColor: level <= exercise.difficulty 
                                                    ? "#1e628c" 
                                                    : "#e2e8f0"
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {!expandedView && savedExercises.length > maxItems && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({savedExercises.length}) Saved Exercises
                </button>
            )}
            
            {savedExercises.length > 0 && (
                <div className="mt-4 text-center">
                    <Link 
                        to="/library"
                        className="text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        Explore more exercises
                    </Link>
                </div>
            )}
        </div>
    );
};
