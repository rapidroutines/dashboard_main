import { useExercises } from "@/contexts/exercise-context";
import { DumbbellIcon, Calendar, Activity, ChevronRight, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export const ExerciseLog = ({ maxItems = 5 }) => {
    const { getExercises, isLoading } = useExercises();
    const [expandedView, setExpandedView] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Get exercises and update when new ones are added
    useEffect(() => {
        setExercises(getExercises(expandedView ? undefined : maxItems));
        
        // Set up an interval to refresh the exercise list
        const refreshInterval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 5000); // Check every 5 seconds
        
        return () => clearInterval(refreshInterval);
    }, [getExercises, expandedView, maxItems, refreshKey]);
    
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
    
    // Get color based on exercise type
    const getExerciseColor = (exerciseType) => {
        const colors = {
            bicepCurl: "bg-blue-100 text-blue-600",
            squat: "bg-green-100 text-green-600",
            pushup: "bg-red-100 text-red-600",
            shoulderPress: "bg-purple-100 text-purple-600",
            tricepExtension: "bg-yellow-100 text-yellow-600",
            lunge: "bg-orange-100 text-orange-600",
            russianTwist: "bg-indigo-100 text-indigo-600",
            default: "bg-slate-100 text-slate-600"
        };
        
        return colors[exerciseType] || colors.default;
    };
    
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
    
    // Manual refresh function
    const handleRefresh = () => {
        setExercises(getExercises(expandedView ? undefined : maxItems));
    };
    
    if (isLoading) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg bg-white p-6 shadow-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }
    
    if (!exercises || exercises.length === 0) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Exercise Log</h2>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        <RefreshCw className="h-4 w-4" strokeWidth={2} />
                        Refresh
                    </button>
                </div>
                <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-slate-50 p-6 text-center">
                    <DumbbellIcon className="mb-2 h-8 w-8 text-slate-400" />
                    <p className="text-slate-600">No exercise records found.</p>
                    <p className="text-sm text-slate-500">Complete exercises with RepBot to see your activity here.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Exercise Log</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                        title="Refresh exercise list"
                    >
                        <RefreshCw className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => setExpandedView(!expandedView)}
                        className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        {expandedView ? "Show Less" : "View All"}
                        <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </div>
            
            <div className="space-y-4">
                {exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0">
                        <div className={`rounded-full p-2 ${getExerciseColor(exercise.exerciseType)}`}>
                            <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <p className="font-medium">
                                    {exercise.count} {exercise.count === 1 ? 'rep' : 'reps'} of {formatExerciseType(exercise.exerciseType)}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(exercise.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {exercises.length > 0 && !expandedView && exercises.length >= maxItems && (
                <button
                    onClick={() => setExpandedView(true)}
                    className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({getExercises().length}) Exercises
                </button>
            )}
        </div>
    );
};
