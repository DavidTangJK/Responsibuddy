import React from "react";
import TaskItem from "../components/TaskItem.jsx";
import { StarIcon, TaskIcon, LockClosedIcon } from "../components/icons.jsx";
// --- Child's Task View ---
// This is the main "work" view. It displays the list of tasks,

export default function TaskView({
  tasks, // Receives ONLY today's tasks
  onCompleteTask,
  areTasksCompleted,
}) {
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="space-y-6">
      {/* Locked Message */}
      {!areTasksCompleted && (
        <div className="flex items-center gap-3 p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
          <LockClosedIcon className="w-6 h-6 text-yellow-600" />
          <p className="font-semibold text-yellow-800">
            Complete your tasks to unlock Home & Social!
          </p>
        </div>
      )}

      {/* Pending Tasks */}
      <TaskSection
        title="Today's Tasks"
        tasks={pendingTasks}
        onCompleteTask={onCompleteTask}
        emptyMessage="No tasks for today. Great job!"
      />

      {/* Completed Tasks */}
      <TaskSection
        title="Completed"
        tasks={completedTasks}
        onCompleteTask={onCompleteTask}
        emptyMessage="No tasks completed yet."
        isCompleted={true}
      />
    </div>
  );
}

// --- TaskSection Sub-Component ---
const TaskSection = ({
  title,
  tasks,
  onCompleteTask,
  emptyMessage,
  isCompleted = false,
}) => {
  if (tasks.length === 0 && !emptyMessage) {
    return null; // Don't show section if no tasks and no empty message
  }

  return (
    <section>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={() => onCompleteTask(task)}
              isCompleted={isCompleted}
              isChildView={true}
            />
          ))}
        </div>
      ) : (
        emptyMessage && <p className="text-gray-500 italic">{emptyMessage}</p>
      )}
    </section>
  );
};
