import React, { useState } from "react";
import { AvatarIcon, StarIcon } from "/src/components/icons.jsx";
import TaskItem from "/src/components/TaskItem.jsx";
// NEW: Import the preview component
import AvatarPreview from "/src/components/AvatarPreview.jsx";

// --- Parent View Component ---
export default function ParentView({
  tasks,
  childrenProfiles,
  onCreateTask,
  onAddChild, // This prop is now 'handleStartOnboarding' from App.jsx
  onApproveTask,
  getTodayString,
}) {
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskStars, setNewTaskStars] = useState(10);
  const [assignedTo, setAssignedTo] = useState("all"); // Default to 'all'
  const [newChildName, setNewChildName] = useState("");
  const [taskDate, setTaskDate] = useState(getTodayString()); // New state for date
  const [showPastTasks, setShowPastTasks] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedToName =
      assignedTo === "all"
        ? "All Children"
        : childrenProfiles.find((p) => p.id === assignedTo)?.name;

    if (!assignedToName) {
      console.error("Could not find name for assigned child.");
      return;
    }

    onCreateTask(
      newTaskText,
      newTaskStars,
      assignedTo,
      assignedToName,
      taskDate
    );
    setNewTaskText("");
    setNewTaskStars(10);
    setAssignedTo("all");
    // We don't reset the date, so parents can add multiple tasks for one day
  };

  const handleAddChildSubmit = (e) => {
    e.preventDefault();
    onAddChild(newChildName); // This now triggers the onboarding flow in App.jsx
    setNewChildName("");
  };

  // Filter tasks
  const todayStr = getTodayString();
  const todaysTasks = tasks.filter((task) => task.taskDate === todayStr);
  const pastTasks = tasks.filter(
    (task) => task.taskDate < todayStr && task.status !== "proposed"
  );

  const pendingTasks = todaysTasks.filter((task) => task.status === "pending");
  const completedTasks = todaysTasks.filter(
    (task) => task.status === "completed"
  );
  const proposedTasks = tasks.filter((task) => task.status === "proposed");

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Parent Dashboard</h2>

      {/* Manage Children */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-3">
        <h3 className="text-lg font-semibold">Manage Children</h3>
        <ul className="space-y-2">
          {childrenProfiles.map((child) => (
            <li
              key={child.id}
              className="flex justify-between items-center p-2 bg-white rounded border"
            >
              <div className="flex items-center gap-2">
                {/* MODIFIED: Show custom avatar or default */}
                {child.avatarConfig ? (
                  <AvatarPreview
                    config={child.avatarConfig}
                    className="w-8 h-8"
                  />
                ) : (
                  <AvatarIcon className="w-8 h-8 text-blue-400" />
                )}
                <span className="font-medium">{child.name}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold text-sm text-yellow-700">
                  {child.stars}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddChildSubmit} className="flex gap-2">
          <input
            type="text"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            placeholder="New child's name"
            className="flex-grow p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Child
          </button>
        </form>
      </div>

      {/* Create Task Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-50 rounded-lg space-y-3"
      >
        <h3 className="text-lg font-semibold">Create New Task</h3>
        <div>
          <label
            htmlFor="taskText"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Task Description
          </label>
          <input
            id="taskText"
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="e.g., Clean your room"
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="taskStars"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Star Reward
            </label>
            <input
              id="taskStars"
              type="number"
              value={newTaskStars}
              onChange={(e) => setNewTaskStars(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Assign To
            </label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Children</option>
              {childrenProfiles.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="taskDate"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Date
            </label>
            <input
              id="taskDate"
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Task
        </button>
      </form>

      {/* Task Lists */}
      <div className="space-y-6">
        {/* Proposed Tasks */}
        {proposedTasks.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2 text-purple-600">
              Proposed Tasks ({proposedTasks.length})
            </h3>
            <div className="space-y-2">
              {proposedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-200 gap-2"
                >
                  <div>
                    <span className="font-medium text-purple-800">
                      {task.text}
                    </span>
                    <span className="block text-sm text-purple-600">
                      (Proposed by: {task.assignedToName})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                      <StarIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm text-yellow-700">
                        {task.stars}
                      </span>
                    </div>
                    <button
                      onClick={() => onApproveTask(task.id)}
                      className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending & Completed */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Today's Pending Tasks ({pendingTasks.length})
            </h3>
            <div className="space-y-2">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    childrenProfiles={childrenProfiles}
                  />
                ))
              ) : (
                <p className="text-gray-500">No pending tasks for today.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Today's Completed Tasks ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    childrenProfiles={childrenProfiles}
                  />
                ))
              ) : (
                <p className="text-gray-500">No tasks completed today.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Past Tasks Section */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-xl font-semibold">Task History</h3>
        <button
          onClick={() => setShowPastTasks(!showPastTasks)}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          {showPastTasks ? "Hide" : "Show"} All Past Tasks ({pastTasks.length})
        </button>

        {showPastTasks && (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {pastTasks.length > 0 ? (
              pastTasks
                .sort((a, b) => new Date(b.taskDate) - new Date(a.taskDate)) // Sort by date descending
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    childrenProfiles={childrenProfiles}
                  />
                ))
            ) : (
              <p className="text-gray-500">No past tasks found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
