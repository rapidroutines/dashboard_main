import { useState } from "react";
import { useSavedExercises } from "@/contexts/saved-exercises-context";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";
import { Dumbbell, ChevronRight, Trash2, InfoIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { useMediaQuery } from "@uidotdev/usehooks";

export const SavedExercises = ({ maxItems = 4 }) => {
    const { savedExercises, removeSavedExercise, isLoading } = useSavedExercises();
    const { isAuthenticated } = useAuth();
    const [expandedView, setExpandedView] = useState(false);
    const isMobile = useMediaQuery("(max-width: 640px)");

    const exercisesToDisplay = expandedView
        ? savedExercises
        : savedExercises.slice(0, maxItems);

    const handleRemove = (e, exerciseId) => {
        e.stopPropagation();
        e.preventDefault();

        if (confirm("Are you sure you want to remove this exercise from your saved list?")) {
            removeSavedExercise(exerciseId);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            calisthenics: "bg-blue-100 text-blue-600",
            core: "bg-green-100 text-green-600",
            mobility: "bg-yellow-100 text-yellow-600",
        };
        return colors[category] || "bg-slate-100 text-slate-600";
    };

    if (isLoading) {
        return (
            <div className="flex h-32 sm:h-40 items-center justify-center rounded-lg bg-white p-4 sm:p-6">
                <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e628c]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6">
                <h2 className="mb-4 text-lg sm:text-xl font-bold">Saved Exercises</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-4 sm:p-6 text-center">
                    <InfoIcon className="mb-2 h-8 w-8 sm:h-12 sm:w-12 text-slate-400" />
                    <p className="text-sm sm:text-base text-slate-600">Sign in to save and track your favorite exercises</p>
                    <div className="mt-4 flex gap-2">
                        <Link to="/signin" className="rounded-lg bg-[#1e628c] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white">
                            Sign In
                        </Link>
                        <Link to="/signup" className="rounded-lg border border-slate-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!savedExercises || savedExercises.length === 0) {
        return (
            <div className="rounded-xl bg-white p-4 sm:p-6">
                <h2 className="mb-4 text-lg sm:text-xl font-bold">Saved Exercises</h2>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-4 sm:p-6 text-center">
                    <Dumbbell className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    <p className="text-sm sm:text-base text-slate-600">You haven't saved any exercises yet.</p>
                    <Link to="/library" className="mt-3 text-xs sm:text-sm font-medium text-[#1e628c] hover:underline">
                        Explore exercise library
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold">Saved Exercises</h2>
                {savedExercises.length > maxItems && (
                    <button
                        onClick={() => setExpandedView(!expandedView)}
                        className="flex items-center gap-1 text-xs sm:text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        {expandedView ? "Show Less" : "View All"}
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" strokeWidth={2} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                {exercisesToDisplay.map((exercise) => (
                    <Link
                        key={exercise.id}
                        to="/library"
                        className="group relative flex overflow-hidden rounded-lg border border-slate-100 transition-shadow hover:shadow-md"
                    >
                        <div className="relative h-[70px] sm:h-[80px] min-w-[70px] sm:min-w-[80px] overflow-hidden">
                            <img
                                src={exercise.image}
                                alt={exercise.title}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-2 sm:p-3">
                            <div>
                                <div className="flex justify-between">
                                    <h3 className="text-sm sm:text-base font-medium text-slate-800 truncate">{exercise.title}</h3>
                                    <button
                                        onClick={(e) => handleRemove(e, exercise.id)}
                                        className="ml-1 opacity-0 transition-opacity group-hover:opacity-100 sm:ml-2"
                                        aria-label="Remove from saved"
                                    >
                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                                    </button>
                                </div>
                                <p className="mt-0.5 sm:mt-1 line-clamp-1 text-xs text-slate-600">
                                    {exercise.description}
                                </p>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <span
                                    className={cn(
                                        "inline-block rounded-full px-1.5 py-0.5 text-xs font-medium",
                                        getCategoryColor(exercise.category)
                                    )}
                                >
                                    {exercise.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3].map((level) => (
                                        <span
                                            key={level}
                                            className={cn(
                                                "h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full",
                                                level <= exercise.difficulty ? "bg-[#1e628c]" : "bg-slate-300"
                                            )}
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
                    className="mt-4 w-full rounded-lg border border-slate-200 py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                    Show All ({savedExercises.length}) Saved Exercises
                </button>
            )}

            {savedExercises.length > 0 && (
                <div className="mt-4 text-center">
                    <Link
                        to="/library"
                        className="text-xs sm:text-sm font-medium text-[#1e628c] hover:underline"
                    >
                        Explore more exercises
                    </Link>
                </div>
            )}
        </div>
    );
};
