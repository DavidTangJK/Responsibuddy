import React from "react";
import { HomeIcon, TaskIcon, SocialIcon, LockClosedIcon } from "./icons.jsx";

// --- Child's Bottom Navigation Bar ---
// This component shows the main navigation tabs and handles the "locked"
// state for the Home and Social tabs based on task completion.

export default function BottomNavigation({
  activeTab,
  onTabClick,
  areTasksCompleted,
}) {
  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "tasks", label: "Tasks", icon: TaskIcon },
    { id: "social", label: "Social", icon: SocialIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 shadow-inner">
      <div className="flex justify-around max-w-lg mx-auto px-4 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          // Determine if the tab should be locked
          const isLocked =
            !areTasksCompleted && (item.id === "home" || item.id === "social");

          // Get the correct icon component
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabClick(item.id)}
              disabled={isLocked}
              className={`flex flex-col items-center justify-center w-20 p-2 rounded-lg transition-all
                ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-500"}
                ${
                  isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }
              `}
            >
              <div className="relative">
                <IconComponent isActive={isActive && !isLocked} />
                {isLocked && (
                  <div className="absolute -top-1 -right-2 bg-gray-600 rounded-full p-0.5 border-2 border-white">
                    <LockClosedIcon className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
