import React from "react";
import { StarIcon, CheckIcon } from "./icons.jsx";

// --- Shared Task Item Component ---
export default function TaskItem({
  task,
  isChildView = false,
  onCompleteTask = () => {},
  childrenProfiles = [],
}) {
  const isCompleted = task.status === "completed";

  const completer = isCompleted
    ? childrenProfiles.find((p) => p.id === task.completedBy)
    : null;
  const completerName = completer ? completer.name : "Someone";

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg transition-all gap-2 ${
        isCompleted
          ? "bg-gray-100"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        {isCompleted && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
        )}
        <div>
          <span
            className={`font-medium ${
              isCompleted ? "text-gray-500 line-through" : "text-gray-700"
            }`}
          >
            {task.text}
          </span>
          {!isChildView && (
            <span className="block text-sm text-gray-500">
              (For: {task.assignedToName})
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between sm:justify-end">
        <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
          <StarIcon className="w-4 h-4" />
          <span className="font-semibold text-sm text-yellow-700">
            {task.stars}
          </span>
        </div>
        {isChildView && !isCompleted && (
          <button
            onClick={() => onCompleteTask(task)}
            className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors"
          >
            Complete
          </button>
        )}
        {!isChildView && isCompleted && (
          <span className="text-sm font-medium text-green-600">
            Completed by {completerName}
          </span>
        )}
      </div>
    </div>
  );
}
