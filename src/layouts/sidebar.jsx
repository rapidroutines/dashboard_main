import { forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logoLight from "@/assets/main_logo.png";
import faviconLight from "@/assets/favicon.png";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const location = useLocation();
    
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full flex-col overflow-y-auto overflow-x-hidden border-r border-slate-300 bg-white shadow-md transition-all duration-300",
                // Width based on collapsed state
                collapsed ? "w-0 md:w-[70px]" : "w-[240px]",
                // Position based on screen size and state
                collapsed ? "max-md:-left-full" : "max-md:left-0",
                // Safe area at top on small screens
                "pb-safe-area-inset-bottom"
            )}
        >
            {/* Logo and brand section */}
            <div className="flex items-center p-3 h-[60px] border-b border-slate-100">
                <a href="https://rapidroutines.org/" className="flex items-center">
                    <img
                        src={collapsed ? faviconLight : logoLight}
                        alt="RapidRoutines"
                        className={cn(
                            "transition-all duration-200",
                            collapsed ? "h-8 w-8" : "max-h-9"
                        )}
                    />
                </a>
                {!collapsed && <p className="ml-2 text-lg font-medium text-slate-900"></p>}
            </div>
            
            {/* Navigation links */}
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {navbarLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        {!collapsed && (
                            <p className="sidebar-group-title px-3 mb-1">{navbarLink.title}</p>
                        )}
                        {navbarLink.links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={cn(
                                    "sidebar-item", 
                                    collapsed && "md:w-[45px] md:justify-center",
                                    location.pathname === link.path && "active"
                                )}
                                title={collapsed ? link.label : ""}
                            >
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && (
                                    <p className="whitespace-nowrap truncate">{link.label}</p>
                                )}
                            </Link>
                        ))}
                    </nav>
                ))}
            </div>
            
            {/* Mobile indication for swipe-to-close */}
            <div className={cn(
                "mt-auto border-t border-slate-200 p-2 text-center text-xs text-slate-500",
                collapsed && "hidden",
                "md:hidden"
            )}>
                Swipe left to close
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};
