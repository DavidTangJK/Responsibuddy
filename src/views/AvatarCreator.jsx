import React, { useState } from "react";
import Avatar from "https://cdn.skypack.dev/avataaars"; // Fetched from CDN

// --- Config Object for avataaars ---
// I've added a few options for each category based on the library.
// You can add all the options from the avataaars-generator website here!
const avatarOptions = {
  topType: [
    "NoHair",
    "Eyepatch",
    "Hat",
    "LongHairBob",
    "LongHairCurly",
    "ShortHairDreads01",
    "ShortHairShortFlat",
  ],
  accessoriesType: ["Blank", "Kurt", "Prescription01", "Sunglasses"],
  hairColor: [
    "Auburn",
    "Black",
    "Blonde",
    "Brown",
    "BrownDark",
    "Platinum",
    "Red",
  ],
  facialHairType: ["Blank", "BeardMedium", "MoustacheFancy"],
  clotheType: [
    "BlazerShirt",
    "Hoodie",
    "Overall",
    "ShirtCrewNeck",
    "GraphicShirt",
  ],
  clotheColor: ["Black", "Blue01", "Gray01", "PastelGreen", "Red", "White"],
  eyeType: ["Default", "Happy", "Squint", "Surprised", "Wink"],
  eyebrowType: ["Default", "Angry", "RaisedExcited", "SadConcerned"],
  mouthType: ["Default", "Concerned", "Eating", "Grimace", "Sad", "Smile"],
  skinColor: ["Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown"],
};

// --- Main Avatar Creator Component ---
export default function AvatarCreator({ childName, onSave, onCancel }) {
  const [selectedCategory, setSelectedCategory] = useState("topType");

  // Default state with all options for the avataaars component
  const [config, setConfig] = useState({
    topType: "LongHairBob",
    accessoriesType: "Blank",
    hairColor: "Brown",
    facialHairType: "Blank",
    clotheType: "Hoodie",
    clotheColor: "PastelGreen",
    eyeType: "Default",
    eyebrowType: "Default",
    mouthType: "Smile",
    skinColor: "Light",
  });

  const handleOptionChange = (optionKey) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [selectedCategory]: optionKey,
    }));
  };

  const handleSave = () => {
    // onSave will be passed from App.jsx and will handle
    // saving this 'config' object to Firebase.
    onSave(config);
  };

  const currentOptions = avatarOptions[selectedCategory];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create an avatar for {childName}
      </h2>

      {/* --- Preview --- */}
      <div className="w-48 h-48 mx-auto bg-blue-100 rounded-full relative overflow-hidden border-4 border-white shadow-inner">
        {/* The Avatar component renders the preview directly */}
        <Avatar className="w-full h-full" avatarStyle="Circle" {...config} />
      </div>

      {/* --- Category Selectors --- */}
      <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-full flex-wrap">
        {Object.keys(avatarOptions).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`capitalize py-2 px-4 rounded-full font-semibold transition-all text-sm ${
              selectedCategory === category
                ? "bg-white shadow text-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {/* Simple label for categories */}
            {category.replace("Type", "").replace("Color", " Color")}
          </button>
        ))}
      </div>

      {/* --- Option Swatches --- */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg h-40 overflow-y-auto">
        {currentOptions.map((optionKey) => (
          <button
            key={optionKey}
            title={optionKey}
            onClick={() => handleOptionChange(optionKey)}
            className={`w-16 h-16 rounded-lg transition-all border-2 ${
              config[selectedCategory] === optionKey
                ? "border-blue-500 ring-2 ring-blue-300"
                : "border-gray-300 hover:border-gray-400"
            } bg-white overflow-hidden`}
          >
            {/* This renders a mini-preview in the button */}
            <Avatar
              className="w-full h-full"
              avatarStyle="Circle"
              {...config}
              // Dynamically set the property for this button's preview
              {...{ [selectedCategory]: optionKey }}
            />
          </button>
        ))}
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
}
