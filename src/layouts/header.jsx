import { useState, useRef } from "react";
import { ChevronsLeft } from "lucide-react";
import PropTypes from "prop-types";
import userImg from "@/assets/user.png";

export const Header = ({ collapsed, setCollapsed }) => {
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
            
            {/* User image in top-right corner */}
            <div className="flex items-center">
                <div className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-slate-200 hover:shadow-md transition-all">
                    <img 
                        src={userImg} 
                        alt="User" 
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};
