import React, { useState } from "react";
import { CloseIcon, ReflectionIcon } from "../components/icons.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

// --- Daily Reflection Modal ---
// This component overlays the screen to let the child write their
// daily reflection.

export default function ReflectionView({ onClose, onSubmit, loading }) {
  const [reflectionText, setReflectionText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reflectionText.trim() && !loading) {
      onSubmit(reflectionText);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <ReflectionIcon />
            <h2 className="text-2xl font-bold">Daily Reflection</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <label
            htmlFor="reflection"
            className="block font-semibold text-gray-700"
          >
            How was your day?
          </label>
          <textarea
            id="reflection"
            rows="5"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="I felt happy when..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !reflectionText.trim()}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold
                hover:bg-blue-700 transition-colors
                disabled:bg-blue-300 disabled:cursor-not-allowed
                flex items-center justify-center min-w-[120px]"
            >
              {loading ? <LoadingSpinner isButton={true} /> : "Save Reflection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
