import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ExerciseLog } from "@/components/exercise-log";
import { SavedExercises } from "@/components/saved-exercises";
import { RecentChatbotChats } from "@/components/recent-chatbot-chats";
import { useMediaQuery } from "@uidotdev/usehooks";

const DashboardPage = () => {
  const brandColor = "#1e628c";
  const { isAuthenticated, user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1023px)");
  
  return (
    <div className="relative">
      {/* Entire Dashboard Content - Blurred when not authenticated */}
      <div className={`flex flex-col gap-4 sm:gap-6 ${!isAuthenticated ? "blur-md" : ""}`}>
        {/* Welcome Banner - Responsive text sizes */}
        <div className="rounded-xl py-6 px-4 sm:py-8 sm:px-6 text-white" style={{ backgroundColor: brandColor }}>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to RapidRoutines AI</h1>
          {isAuthenticated && user?.name && (
            <p className="mt-2 text-lg sm:text-xl">Hello, {user.name}!</p>
          )}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/90">
            The all-in-one place for tracking your workouts with our RepBot, saving your favorite exercises from the library, and viewing your ChatBot history.
          </p>
        </div>

        {/* Grid layout for main content - Responsive grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Exercise Log Section - only show when authenticated */}
          {isAuthenticated && (
            <div className="rounded-xl border-2 border-slate-400 bg-white shadow-sm">
              <ExerciseLog maxItems={isMobile ? 3 : (isTablet ? 4 : 6)} />
            </div>
          )}
          
          {/* Saved Exercises Section */}
          <div className="rounded-xl border-2 border-slate-400 bg-white shadow-sm">
            <SavedExercises maxItems={isMobile ? 2 : (isTablet ? 4 : 6)} />
          </div>
        </div>
        
        {/* Recent Chatbot Chats Section */}
        <div className="rounded-xl border-2 border-slate-400 bg-white shadow-sm">
          <RecentChatbotChats maxItems={isMobile ? 1 : 2} />
        </div>
      </div>
      
      {/* Sign-in overlay - Only shown when not authenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm p-4">
          <div className="max-w-md rounded-xl bg-white p-6 sm:p-8 text-center border-2 border-slate-400 shadow-lg">
            <div className="mb-4 inline-block rounded-full bg-[#1e628c]/10 p-3 sm:p-4">
              <Lock size={isMobile ? 24 : 32} className="text-[#1e628c]" />
            </div>
            <h3 className="mb-2 text-xl sm:text-2xl font-bold text-slate-900">Sign in to Access Your Dashboard</h3>
            <p className="mb-6 text-sm sm:text-base text-slate-600">
              Create an account or sign in to manage your saved exercises and track your workouts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link 
                to="/signin" 
                className="w-full rounded-lg bg-[#1e628c] px-4 sm:px-6 py-2 sm:py-3 font-medium text-white hover:bg-[#174e70] transition-colors"
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className="w-full rounded-lg border border-slate-300 px-4 sm:px-6 py-2 sm:py-3 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
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
