import { useState, useRef } from "react";
import { ChevronsLeft, User, Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
import profileImg from "@/assets/user.png";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    
    useClickOutside([profileMenuRef], () => {
        setProfileMenuOpen(false);
    });

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                </button>
            </div>
            <div className="flex items-center gap-x-3">
                <div className="relative">
                    <button 
                        className="size-10 overflow-hidden rounded-full border-2 border-slate-200"
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                        <img
                            src={profileImg}
                            alt="profile"
                            className="size-full object-cover"
                        />
                    </button>
                    
                    {profileMenuOpen && (
                        <div 
                            ref={profileMenuRef}
                            className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                            <div className="border-b border-slate-100 px-4 py-2">
                                <p className="text-sm font-medium text-slate-900">User</p>
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
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
