import React, { useState, useEffect } from "react";
import BottomNavigation from "../components/BottomNavigation.jsx";
import HomeView from "./HomeView.jsx";
import TaskView from "./TaskView.jsx";
import SocialView from "./SocialView.jsx";
import ShopView from "./ShopView.jsx";
import ReflectionView from "./ReflectionView.jsx";

// (NEW) Helper function to get the start of the day as a string
// This is added here to fix the error.
const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};

// --- Child Dashboard Container ---
// This component manages the child's main view, including the
// bottom navigation and switching between the Home, Tasks, and Social tabs.

export default function ChildDashboard({
  tasks,
  childrenProfiles,
  currentChildId,
  currentChildProfile,
  onCompleteTask,
  onBuyItem,
  onSwitchChild,
  onSubmitReflection,
  loadingReflection,
}) {
  // --- State for Child's View ---
  const [activeTab, setActiveTab] = useState("tasks"); // Default to 'tasks'
  const [showShop, setShowShop] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  // --- Task Locking Logic ---
  // Filter tasks for *this* child
  const myTasks = tasks.filter(
    (task) => task.assignedTo === currentChildId || task.assignedTo === "all"
  );

  // Get today's tasks
  const todayStr = getTodayString();
  const todaysTasks = myTasks.filter((task) => task.taskDate === todayStr);

  // Check if any of *today's* tasks are still pending
  const areTasksCompleted =
    todaysTasks.filter((task) => task.status === "pending").length === 0;

  // --- Tab Navigation Handler ---
  const handleTabClick = (tabId) => {
    // If tasks are NOT complete, lock home/social and stay on tasks
    if (!areTasksCompleted && (tabId === "home" || tabId === "social")) {
      setActiveTab("tasks");
    } else {
      setActiveTab(tabId);
    }
  };

  // --- Effect to force back to Tasks tab if tasks become incomplete ---
  // (e.g., if parent adds a new task for today)
  useEffect(() => {
    if (
      !areTasksCompleted &&
      (activeTab === "home" || activeTab === "social")
    ) {
      setActiveTab("tasks");
    }
  }, [areTasksCompleted, activeTab]);

  // --- Modal Handlers ---
  const handleGoToShop = () => setShowShop(true);
  const handleCloseShop = () => setShowShop(false);
  const handleBuyAndClose = (item) => {
    onBuyItem(item);
    // Don't close shop, let them keep shopping
  };

  const handleReflectClick = () => setShowReflection(true);
  const handleCloseReflection = () => setShowReflection(false);
  const handleSubmitReflectionAndClose = (text) => {
    onSubmitReflection(text);
    setShowReflection(false);
  };

  return (
    <div className="pb-24">
      {/* --- Main Content Area --- */}
      <div>
        {/*
          We use CSS to show/hide views instead of conditional rendering
          to keep the state of each tab (like scroll position) intact.
        */}
        <div className={activeTab === "home" ? "block" : "hidden"}>
          <HomeView
            currentChildProfile={currentChildProfile}
            onGoToShop={handleGoToShop}
            onReflectClick={handleReflectClick}
            onBuyItem={onBuyItem} // Pass onBuyItem to HomeView as well
          />
        </div>
        <div className={activeTab === "tasks" ? "block" : "hidden"}>
          <TaskView
            tasks={todaysTasks} // Pass ONLY *today's* tasks
            onCompleteTask={onCompleteTask}
            areTasksCompleted={areTasksCompleted}
          />
        </div>
        <div className={activeTab === "social" ? "block" : "hidden"}>
          <SocialView
            childrenProfiles={childrenProfiles}
            currentChildId={currentChildId}
          />
        </div>
      </div>

      {/* --- Modals (Overlays) --- */}
      {showShop && (
        <ShopView
          onClose={handleCloseShop}
          onBuyItem={handleBuyAndClose}
          currentChildProfile={currentChildProfile} // <-- This is the fix
        />
      )}
      {showReflection && (
        <ReflectionView
          onClose={handleCloseReflection}
          onSubmit={handleSubmitReflectionAndClose}
          loading={loadingReflection}
        />
      )}

      {/* --- Bottom Navigation Bar --- */}
      <BottomNavigation
        activeTab={activeTab}
        onTabClick={handleTabClick}
        areTasksCompleted={areTasksCompleted}
      />

      {/* --- Switch Child Button --- */}
      <button
        onClick={onSwitchChild}
        className="fixed top-28 right-4 bg-white p-2 rounded-full shadow-lg text-sm text-blue-600 font-semibold"
      >
        Switch User
      </button>
    </div>
  );
}
