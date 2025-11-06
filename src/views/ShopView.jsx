import React, { useState } from "react";
import { StarIcon } from "../components/icons.jsx";

// --- Expanded Shop Item Database ---
const allShopItems = {
  furniture: [
    {
      id: "1",
      name: "Comfy Sofa",
      price: 50,
      emoji: "🛋️",
      purchased: true,
      equipped: true,
    },
    {
      id: "2",
      name: "Cool Lamp",
      price: 20,
      emoji: "💡",
      purchased: true,
      equipped: true,
    },
    {
      id: "3",
      name: "Potted Plant",
      price: 15,
      emoji: "🪴",
      purchased: false,
      equipped: false,
    },
    {
      id: "4",
      name: "Big Screen TV",
      price: 100,
      emoji: "📺",
      purchased: false,
      equipped: false,
    },
    {
      id: "5",
      name: "Bookshelf",
      price: 40,
      emoji: "📚",
      purchased: false,
      equipped: false,
    },
    {
      id: "6",
      name: "Study Desk",
      price: 45,
      emoji: "🖥️",
      purchased: false,
      equipped: false,
    },
  ],
  toys: [
    {
      id: "7",
      name: "Teddy Bear",
      price: 25,
      emoji: "🧸",
      purchased: false,
      equipped: false,
    },
    {
      id: "8",
      name: "Toy Train",
      price: 30,
      emoji: "🚂",
      purchased: false,
      equipped: false,
    },
    {
      id: "9",
      name: "Kite",
      price: 10,
      emoji: "🪁",
      purchased: false,
      equipped: false,
    },
    {
      id: "10",
      name: "Soccer Ball",
      price: 20,
      emoji: "⚽",
      purchased: false,
      equipped: false,
    },
    {
      id: "11",
      name: "Building Blocks",
      price: 15,
      emoji: "🧱",
      purchased: false,
      equipped: false,
    },
  ],
  pets: [
    {
      id: "12",
      name: "Puppy",
      price: 150,
      emoji: "🐶",
      purchased: false,
      equipped: false,
    },
    {
      id: "13",
      name: "Kitten",
      price: 150,
      emoji: "🐱",
      purchased: false,
      equipped: false,
    },
    {
      id: "14",
      name: "Goldfish",
      price: 30,
      emoji: "🐠",
      purchased: false,
      equipped: false,
    },
    {
      id: "15",
      name: "Hamster",
      price: 50,
      emoji: "🐹",
      purchased: false,
      equipped: false,
    },
  ],
  backgrounds: [
    {
      id: "16",
      name: "Beach",
      price: 75,
      emoji: "🏖️",
      purchased: false,
      equipped: false,
    },
    {
      id: "17",
      name: "Forest",
      price: 75,
      emoji: "🌲",
      purchased: false,
      equipped: false,
    },
    {
      id: "18",
      name: "Space",
      price: 100,
      emoji: "🚀",
      purchased: false,
      equipped: false,
    },
    {
      id: "19",
      name: "Cityscape",
      price: 75,
      emoji: "🏙️",
      purchased: false,
      equipped: false,
    },
  ],
};

const categories = Object.keys(allShopItems);
const categoryEmojiMap = {
  furniture: "🛋️",
  toys: "🧸",
  pets: "🐶",
  backgrounds: "🖼️",
};

const handlePurchaseItem = (itemId: number) => {
  const item = shopItems.find((i) => i.id === itemId);
  if (item && !item.purchased && stars >= item.cost) {
    setShopItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId ? { ...i, purchased: true, equipped: true } : i
      )
    );
    setStars((prev) => prev - item.cost);
  }
};

const handleToggleEquip = (itemId: number) => {
  const item = shopItems.find((i) => i.id === itemId);
  if (!item || !item.purchased) return;

  setShopItems((prevItems) => {
    // If equipping a pet, unequip all other pets first
    if (item.category === "pets" && !item.equipped) {
      return prevItems.map((i) =>
        i.id === itemId
          ? { ...i, equipped: true }
          : i.category === "pets"
          ? { ...i, equipped: false }
          : i
      );
    }

    // For other items, just toggle
    return prevItems.map((i) =>
      i.id === itemId ? { ...i, equipped: !i.equipped } : i
    );
  });
};

// --- Child "Shop" View Component ---
export default function ShopView({ currentChildProfile, onBuyItem, onClose }) {
  const [activeCategory, setActiveCategory] = useState("furniture");
  const itemsToShow = allShopItems[activeCategory];
  const currentStars = currentChildProfile?.stars || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
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
          You have {currentStars} stars
        </span>
      </div>

      {/* --- Category Tabs --- */}
      <div className="flex justify-center gap-2 p-1 bg-blue-50 rounded-full flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex items-center gap-2 capitalize py-2 px-4 rounded-full font-semibold transition-all text-sm ${
              activeCategory === category
                ? "bg-white shadow text-blue-600"
                : "text-gray-600 hover:bg-blue-100"
            }`}
          >
            <span>{categoryEmojiMap[category]}</span>
            <span>{category}</span>
          </button>
        ))}
      </div>

      {/* --- Shop Items Grid --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-96 sm:h-[60vh] max-h-[80vh] overflow-y-auto p-2 bg-gray-50 rounded-lg">
        {" "}
        {itemsToShow.map((item) => {
          const canBuy = currentStars >= item.price;
          return (
            <div
              key={item.id}
              className="p-4 border bg-white rounded-lg flex flex-col items-center space-y-2 shadow-sm"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">{item.emoji}</span>
              </div>
              <span className="font-semibold text-gray-700 text-center text-sm">
                {item.name}
              </span>
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
                {canBuy ? "Buy" : "Not Enough"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
