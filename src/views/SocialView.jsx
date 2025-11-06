import React from "react";
import { StarIcon } from "../components/icons.jsx";
import AvatarPreview from "../components/AvatarPreview.jsx"; // <-- IMPORT NEW PREVIEW

// --- Child "Social" View Component ---
export default function SocialView({ childrenProfiles, currentChildId }) {
  const friends = childrenProfiles.filter((p) => p.id !== currentChildId);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Friends</h2>
      {friends.length === 0 ? (
        <p className="text-gray-500">No other children profiles found.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="flex justify-between items-center p-3 bg-white rounded-lg border"
            >
              <div className="flex items-center gap-3">
                {/* --- USE NEW AVATAR PREVIEW --- */}
                <AvatarPreview
                  avatarConfig={friend.avatarConfig}
                  className="w-10 h-10"
                />
                <span className="text-lg font-medium">{friend.name}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold text-sm text-yellow-700">
                  {friend.stars}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
