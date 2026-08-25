"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, History as HistoryIcon, PieChart, Settings as SettingsIcon, User, Home, Camera } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "./Dashboard.css";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const desktopNav = [
    { name: "Overview", to: "/health-hub", icon: <Home size={20} /> },
    { name: "Session", to: "/session", icon: <Camera size={20} /> },
    { name: "History", to: "/history", icon: <HistoryIcon size={20} /> },
    { name: "Insights", to: "/insights", icon: <PieChart size={20} /> },
    { name: "Calibration", to: "/calibration", icon: <Activity size={20} /> },
    { name: "Settings", to: "/settings", icon: <SettingsIcon size={20} /> },
  ];

  const mobileNav = [
    { name: "Home", to: "/health-hub", icon: <Home size={24} /> },
    { name: "Session", to: "/session", icon: <Camera size={24} /> },
    { name: "History", to: "/history", icon: <HistoryIcon size={24} /> },
    { name: "Insights", to: "/insights", icon: <PieChart size={24} /> },
    { name: "Profile", to: "/profile", icon: <User size={24} /> },
  ];

  // Disable layout wrapper on the session route so camera is full screen
  if (pathname === "/session") {
    return <>{children}</>;
  }

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <Link href="/health-hub" className="logo-text">RehabCoach</Link>
        </div>
        
        <nav className="sidebar-nav">
          {desktopNav.map((item) => {
            const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link 
                key={item.name} 
                href={item.to}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="sidebar-active-bg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="sidebar-bottom">
          <Link href="/profile" className={`sidebar-link ${pathname === "/profile" ? "active" : ""}`}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-mobile-header">
          <span className="mobile-greeting">Dashboard</span>
          <Link href="/profile" className="mobile-profile-btn">
            <User size={20} />
          </Link>
        </div>
        <div className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {mobileNav.map((item) => {
          const isActive = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link 
              key={item.name} 
              href={item.to}
              className={`bottom-nav-link ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
