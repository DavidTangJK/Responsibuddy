import React from "react";
import { StarIcon } from "../components/icons.jsx";

// --- Child "Shop" View Component ---
const shopItems = [
  { id: "sofa", name: "Comfy Sofa", price: 50 },
  { id: "lamp", name: "Cool Lamp", price: 20 },
  { id: "plant", name: "Potted Plant", price: 15 },
  { id: "tv", name: "Big Screen TV", price: 100 },
];

export default function ShopView({ currentChildProfile, onBuyItem, onClose }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Star Shop</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full w-fit">
        <StarIcon />
        <span className="font-bold text-lg text-yellow-700">
          You have {currentChildProfile.stars || 0} stars
        </span>
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-2 gap-4">
        {shopItems.map((item) => {
          const canBuy = currentChildProfile.stars >= item.price;
          return (
            <div
              key={item.id}
              className="p-4 border rounded-lg flex flex-col items-center space-y-2"
            >
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold text-yellow-700">
                  {item.price}
                </span>
              </div>
              <button
                onClick={() => onBuyItem(item)}
                disabled={!canBuy}
                className={`w-full px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                  canBuy
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {canBuy ? "Buy" : "Not Enough Stars"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
