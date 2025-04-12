import { useState, useRef, useEffect } from "react";
import { ChevronsLeft, LogOut, User, Settings, Menu } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/utils/cn";
import profileImg from "@/assets/user.png";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const isMobile = useMediaQuery("(max-width: 640px)");
    
    useClickOutside([profileMenuRef], () => {
        setProfileMenuOpen(false);
    });

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Close menu when navigating
    useEffect(() => {
        return () => setProfileMenuOpen(false);
    }, [navigate]);

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-3 sm:px-4 shadow-md">
            <div className="flex items-center gap-x-2 sm:gap-x-3">
                <button
                    className="btn-ghost size-9 sm:size-10 flex items-center justify-center"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isMobile ? (
                        <Menu className="h-5 w-5" />
                    ) : (
                        <ChevronsLeft className={collapsed ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"} />
                    )}
                </button>
            </div>
            <div className="flex items-center gap-x-2 sm:gap-x-3">
                {isAuthenticated ? (
                    <div className="relative">
                        <button 
                            className="size-8 sm:size-10 overflow-hidden rounded-full border-2 border-slate-200"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            aria-label="Open profile menu"
                        >
                            <img
                                src={profileImg}
                                alt="Profile"
                                className="size-full object-cover"
                            />
                        </button>
                        
                        {profileMenuOpen && (
                            <div 
                                ref={profileMenuRef}
                                className={cn(
                                    "absolute right-0 mt-2 w-48 sm:w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5",
                                    isMobile && "-right-2"
                                )}
                            >
                                <div className="border-b border-slate-100 px-4 py-2">
                                    <p className="text-sm font-medium text-slate-900">{user?.name || "User"}</p>
                                    {user?.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
                                </div>
                                <div className="py-1">
                                    <button 
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            navigate("/profile?tab=settings");
                                        }}
                                        className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </button>
                                </div>
                                <div className="border-t border-slate-100 py-1">
                                    <button 
                                        onClick={handleLogout}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2">
                        <Link 
                            to="/signin" 
                            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-[#1e628c]"
                        >
                            Sign in
                        </Link>
                        <Link 
                            to="/signup" 
                            className="rounded-md bg-[#1e628c] px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#174e70]"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
