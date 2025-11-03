import React, { useState } from "react";
import ShopView from "./ShopView.jsx";
import ReflectionView from "./ReflectionView.jsx";
import { StarIcon, ShopIcon, ReflectionIcon } from "../components/icons.jsx";

// --- Child "Home" View Component ---
export default function HomeView({ currentChildProfile, onBuyItem }) {
  const [showShop, setShowShop] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  if (showShop) {
    return (
      <ShopView
        currentChildProfile={currentChildProfile}
        onBuyItem={onBuyItem}
        onClose={() => setShowShop(false)}
      />
    );
  }

  if (showReflection) {
    return (
      <ReflectionView
        onClose={() => setShowReflection(false)}
        onSubmit={(reflectionText) => {
          // Handle reflection submission here
          console.log("Reflection submitted:", reflectionText);
          setShowReflection(false);
        }}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Home</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReflection(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
          >
            <ReflectionIcon />
            <span>Daily Reflection</span>
          </button>
          <button
            onClick={() => setShowShop(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ShopIcon />
            <span>Go to Shop</span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full w-fit">
        <StarIcon />
        <span className="font-bold text-lg text-yellow-700">
          You have {currentChildProfile.stars || 0} stars
        </span>
      </div>

      {/* Virtual Home Placeholder */}
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-lg">Your Virtual Home Goes Here</p>
      </div>
    </div>
  );
}
