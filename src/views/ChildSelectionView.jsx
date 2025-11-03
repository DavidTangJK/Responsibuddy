import React from "react";
import { AvatarIcon } from "../components/icons.jsx";

// --- Child Selection View Component ---
export default function ChildSelectionView({
  childrenProfiles,
  onSelectChild,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Who is playing?
      </h2>
      {childrenProfiles.length === 0 ? (
        <p className="text-center text-gray-500">
          Ask a parent to add a child profile to get started!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {childrenProfiles.map((child) => (
            <button
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all border border-transparent hover:border-blue-300"
            >
              <AvatarIcon />
              <span className="mt-2 text-lg font-semibold text-blue-600">
                {child.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
