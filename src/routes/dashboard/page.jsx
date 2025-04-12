import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ExerciseLog } from "@/components/exercise-log";
import { SavedExercises } from "@/components/saved-exercises";
import { RecentChatbotChats } from "@/components/recent-chatbot-chats";

const DashboardPage = () => {
  const brandColor = "#1e628c";
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="relative">
      {/* Entire Dashboard Content - Blurred when not authenticated */}
      <div className={`flex flex-col gap-6 ${!isAuthenticated ? "blur-md" : ""}`}>
        {/* Welcome Banner */}
        <div className="rounded-xl py-8 px-6 text-white" style={{ backgroundColor: brandColor }}>
          <h1 className="text-3xl font-bold">Welcome to RapidRoutines AI</h1>
          {isAuthenticated && user?.name && (
            <p className="mt-2 text-xl">Hello, {user.name}!</p>
          )}
          <p className="mt-4 text-white/90">
            The all-in-one place for tracking your workouts with our RepBot, saving your favorite exercises from the library, and viewing your ChatBot history.
          </p>
        </div>

        {/* Grid layout for main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Exercise Log Section - only show when authenticated */}
          {isAuthenticated && (
            <div className="rounded-xl border-2 border-slate-400 bg-white">
              <ExerciseLog maxItems={6} />
            </div>
          )}
          
          {/* Saved Exercises Section */}
          <div className="rounded-xl border-2 border-slate-400 bg-white">
            <SavedExercises maxItems={6} />
          </div>
        </div>
        
        {/* Recent Chatbot Chats Section */}
        <div className="rounded-xl border-2 border-slate-400 bg-white">
          <RecentChatbotChats maxItems={2} />
        </div>
      </div>
      
      {/* Sign-in overlay - Only shown when not authenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="max-w-md rounded-xl bg-white p-8 text-center border-2 border-slate-400">
            <div className="mb-4 inline-block rounded-full bg-[#1e628c]/10 p-4">
              <Lock size={32} className="text-[#1e628c]" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">Sign in to Access Your Dashboard</h3>
            <p className="mb-6 text-slate-600">
              Create an account or sign in to manage your saved exercises and track your workouts.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link 
                to="/signin" 
                className="w-full rounded-lg bg-[#1e628c] px-6 py-3 font-medium text-white hover:bg-[#174e70]"
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className="w-full rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;