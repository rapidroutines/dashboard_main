import React from "react";
import { Play, BarChart2, TrendingUp, LucideActivity, User, Lock, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

const DashboardPage = () => {
  const brandColor = "#1e628c";
  const { isAuthenticated, user } = useAuth();

  // Mock user metrics/stats data
  const userMetrics = {
    workoutsCompleted: 24,
    currentStreak: 7,
    totalMinutes: 648,
    monthlyProgress: 78,
  };
  
  return (
    <div className="relative">
      {/* Entire Dashboard Content - Blurred when not authenticated */}
      <div className={`flex flex-col gap-6 p-4 ${!isAuthenticated ? "blur-md" : ""}`}>
        {/* Welcome Banner */}
        <div className="rounded-xl py-8 px-6 text-white" style={{ backgroundColor: brandColor }}>
          <h1 className="text-3xl font-bold">Welcome to RapidRoutines AI</h1>
          {isAuthenticated && user?.name && (
            <p className="mt-2 text-xl">Hello, {user.name}!</p>
          )}
        </div>

        {/* User Metrics Section */}
        <div className="rounded-xl bg-white shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Fitness Metrics</h2>
            
            {isAuthenticated && (
              <div className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700">
                <span className="font-medium">{user?.email}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Workouts Completed */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Workouts Completed</p>
                <div className="bg-green-100 p-2 rounded-full">
                  <BarChart2 size={18} className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{userMetrics.workoutsCompleted}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +12% from last month
              </p>
            </div>
            
            {/* Current Streak */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Current Streak</p>
                <div className="bg-orange-100 p-2 rounded-full">
                  <LucideActivity size={18} className="text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{userMetrics.currentStreak} days</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                Keep it up!
              </p>
            </div>
            
            {/* Total Minutes */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Total Minutes</p>
                <div className="bg-blue-100 p-2 rounded-full">
                  <BarChart2 size={18} className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{userMetrics.totalMinutes}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <TrendingUp size={14} className="mr-1" />
                +48 this week
              </p>
            </div>
            
            {/* Monthly Progress */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">Monthly Goal</p>
                <div className="bg-purple-100 p-2 rounded-full">
                  <User size={18} className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-2">{userMetrics.monthlyProgress}%</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${userMetrics.monthlyProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* User Profile Summary - Only visible when authenticated */}
          {isAuthenticated && (
            <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h3 className="font-medium text-slate-900 mb-2">Your Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="font-medium">{user?.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Member since</p>
                  <p className="font-medium">{user?.joined ? new Date(user.joined).toLocaleDateString() : "Today"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last sign in</p>
                  <p className="font-medium">{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="rounded-xl bg-white shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CalendarClock size={18} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium">Completed Push-Up Challenge</p>
                <p className="text-sm text-slate-500">Yesterday at 5:30 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <CalendarClock size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Achieved New Personal Best</p>
                <p className="text-sm text-slate-500">2 days ago at 6:15 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <CalendarClock size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Started Core Strength Program</p>
                <p className="text-sm text-slate-500">3 days ago at 7:45 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-3xl">
            <div className="relative rounded-xl overflow-hidden shadow-md border border-slate-200">
              <div className="aspect-video bg-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 flex items-center justify-center">
                  <button 
                    className="bg-white/90 hover:bg-white rounded-full w-14 h-14 flex items-center justify-center transition-all hover:scale-105"
                    style={{ boxShadow: `0 0 0 3px ${brandColor}40` }}
                  >
                    <Play size={28} style={{ color: brandColor, fill: brandColor }} />
                  </button>
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-white text-lg font-bold">Discover AI-Assisted Fitness</h2>
                  <p className="text-white/70 text-sm">Transform your workout with our intelligent tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sign-in overlay - Only shown when not authenticated */}
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md text-center">
            <div className="bg-[#1e628c]/10 p-4 rounded-full inline-block mb-4">
              <Lock size={32} className="text-[#1e628c]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sign in to Access Your Dashboard</h3>
            <p className="text-slate-600 mb-6">
              Create an account or sign in to view your personalized fitness metrics, track your progress, and access all features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/signin" 
                className="px-6 py-3 bg-[#1e628c] text-white rounded-lg font-medium hover:bg-[#174e70] w-full"
              >
                Sign in
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 w-full"
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