import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Footer } from "@/layouts/footer";
import { User, Mail, Clock, LogOut, Save, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

const ProfilePage = () => {
    const { user, logout, isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("profile");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    // Check for tab parameter in URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam === 'settings') {
            setActiveTab('settings');
        }
    }, [location]);
    
    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setDisplayName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);
    
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Function to save profile changes
    const saveProfileChanges = () => {
        // Create updated user object
        const updatedUser = {
            ...user,
            name: displayName,
            email: email,
            lastLogin: user?.lastLogin || new Date().toISOString()
        };
        
        // Update user data
        login(updatedUser);
        
        // Show success message and exit edit mode
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };
    
    if (!isAuthenticated) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-md">
                <h1 className="title mb-4">Profile</h1>
                <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-10 text-center">
                    <User className="mb-3 h-16 w-16 text-slate-400" />
                    <h2 className="mb-2 text-xl font-semibold text-slate-800">Sign in to view your profile</h2>
                    <p className="mb-6 text-slate-600">Create an account or sign in to access all features</p>
                    <div className="flex gap-4">
                        <Link 
                            to="/signin" 
                            className="rounded-lg bg-[#1e628c] px-4 py-2 font-medium text-white hover:bg-[#17516f]"
                        >
                            Sign In
                        </Link>
                        <Link 
                            to="/signup" 
                            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-y-6">
            <h1 className="title">Your Account</h1>
            
            {/* Success Message */}
            {successMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span>{successMessage}</span>
                </div>
            )}
            
            <div className="flex flex-col gap-4 md:flex-row">
                {/* Sidebar/Tabs */}
                <div className="w-full rounded-lg bg-white p-4 shadow-md md:w-64 md:flex-shrink-0">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium",
                                activeTab === "profile" 
                                    ? "bg-[#1e628c] text-white" 
                                    : "text-slate-700 hover:bg-slate-100"
                            )}
                        >
                            <User className="h-5 w-5" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium",
                                activeTab === "settings" 
                                    ? "bg-[#1e628c] text-white" 
                                    : "text-slate-700 hover:bg-slate-100"
                            )}
                        >
                            <Save className="h-5 w-5" />
                            Saved Data
                        </button>
                    </nav>
                    
                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 rounded-lg bg-white p-6 shadow-md">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-800">Profile Information</h2>
                                <button 
                                    onClick={() => setIsEditing(prev => !prev)}
                                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>
                            
                            {isEditing ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full rounded-md border border-slate-300 p-2 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        />
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-md border border-slate-300 p-2 focus:border-[#1e628c] focus:outline-none focus:ring-1 focus:ring-[#1e628c]"
                                        />
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Last Login</h3>
                                                <p className="font-medium text-slate-900">
                                                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <button 
                                            onClick={saveProfileChanges}
                                            className="rounded-lg bg-[#1e628c] px-4 py-2 font-medium text-white hover:bg-[#17516f]"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Display Name</h3>
                                                <p className="font-medium text-slate-900">{displayName || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Email Address</h3>
                                                <p className="font-medium text-slate-900">{email || "No email found"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c]/10 text-[#1e628c]">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-slate-500">Last Login</h3>
                                                <p className="font-medium text-slate-900">
                                                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Just now"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div>
                            <h2 className="mb-6 text-xl font-semibold text-slate-800">Data Management</h2>
                            
                            <div className="space-y-6">
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Saved Exercises</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage exercises you've saved to your library
                                    </p>
                                    <div className="flex gap-2">
                                        <Link
                                            to="/library"
                                            className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
                                        >
                                            View Saved Exercises
                                        </Link>
                                        <button 
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to clear all saved exercises? This cannot be undone.")) {
                                                    localStorage.removeItem(`savedExercises_${user.email}`);
                                                    setSuccessMessage("Saved exercises cleared successfully!");
                                                    setTimeout(() => {
                                                        setSuccessMessage("");
                                                        window.location.reload();
                                                    }, 1500);
                                                }
                                            }}
                                        >
                                            Clear All Saved Exercises
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Exercise History</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage your exercise tracking history
                                    </p>
                                    <div className="flex gap-2">
                                        <Link
                                            to="/"
                                            className="rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#17516f]"
                                        >
                                            View Exercise History
                                        </Link>
                                        <button 
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to clear your exercise history? This cannot be undone.")) {
                                                    localStorage.removeItem(`exercises_${user.email}`);
                                                    setSuccessMessage("Exercise history cleared successfully!");
                                                    setTimeout(() => {
                                                        setSuccessMessage("");
                                                        window.location.reload();
                                                    }, 1500);
                                                }
                                            }}
                                        >
                                            Clear Exercise History
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="rounded-lg border border-slate-200 p-5">
                                    <h3 className="mb-1 font-medium text-slate-900">Account Data</h3>
                                    <p className="mb-4 text-sm text-slate-500">
                                        Manage all data associated with your account
                                    </p>
                                    <button 
                                        className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete your account and all associated data? This cannot be undone.")) {
                                                // Clear all user data
                                                localStorage.removeItem(`savedExercises_${user.email}`);
                                                localStorage.removeItem(`exercises_${user.email}`);
                                                localStorage.removeItem("user");
                                                
                                                setSuccessMessage("Account deleted successfully. Redirecting...");
                                                setTimeout(() => {
                                                    logout();
                                                    navigate("/");
                                                }, 2000);
                                            }
                                        }}
                                    >
                                        Delete Account & All Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default ProfilePage;