import { BookOpen, Dumbbell, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { ExerciseLog } from "@/components/exercise-log";
import { SavedExercises } from "@/components/saved-exercises";

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
            Track your workouts, save your favorite exercises, and manage your fitness journey all in one place.
          </p>
        </div>

        {/* Grid layout for main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Exercise Log Section - only show when authenticated */}
          {isAuthenticated && <ExerciseLog maxItems={6} />}
          
          {/* Saved Exercises Section */}
          <SavedExercises maxItems={6} />
        </div>

        {/* Quick Access Section */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Quick Access</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link 
              to="/library" 
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e628c]/10">
                <BookOpen className="h-5 w-5 text-[#1e628c]" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Exercise Library</p>
                <p className="text-sm text-slate-500">Browse exercises and save favorites</p>
              </div>
            </Link>

            <Link 
              to="/repbot" 
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e628c]/10">
                <Dumbbell className="h-5 w-5 text-[#1e628c]" />
              </div>
              <div>
                <p className="font-medium text-slate-900">RepBot</p>
                <p className="text-sm text-slate-500">Log workouts with AI form tracking</p>
              </div>
            </Link>

            <Link 
              to="/rapidtree" 
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e628c]/10">
                <svg className="h-5 w-5 text-[#1e628c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-900">Progression Tree</p>
                <p className="text-sm text-slate-500">Track your exercise progression</p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* User Profile Section - Only visible when authenticated */}
        {isAuthenticated && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Your Profile</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium">{user?.name || "Not provided"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="font-medium">{user?.joined ? new Date(user.joined).toLocaleDateString() : "Today"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Last sign in</p>
                <p className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Sign-in overlay - Only shown when not authenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
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
