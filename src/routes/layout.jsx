import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const isMobileDevice = useMediaQuery("(max-width: 640px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);
    const sidebarRef = useRef(null);
    
    // Update sidebar state when screen size changes
    useEffect(() => {
        setCollapsed(!isDesktopDevice);
    }, [isDesktopDevice]);

    // Close sidebar when clicking outside on mobile
    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Overlay for mobile when sidebar is open */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity duration-300",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
                onClick={() => !isDesktopDevice && setCollapsed(true)}
            />
            
            {/* Sidebar component */}
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
            />
            
            {/* Main content area */}
            <div 
                className={cn(
                    "transition-[margin] duration-300", 
                    collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
                )}
            >
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className={cn(
                    "overflow-y-auto overflow-x-hidden p-4 sm:p-6",
                    isMobileDevice ? "h-[calc(100vh-60px)]" : "h-[calc(100vh-60px)]"
                )}>
                    {children}
                </div>
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;
