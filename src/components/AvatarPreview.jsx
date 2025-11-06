import React from "react";
import Avatar from "avataaars";
import { AvatarIcon } from "./icons"; // The default grey icon

// This is a new, reusable component that will render the custom
// avatar based on the config saved in Firebase.
// If no config exists, it shows the default icon.

export default function AvatarPreview({
  avatarConfig,
  className = "w-16 h-16",
}) {
  if (avatarConfig) {
    // The avataaars component needs all props spelled out
    return (
      <Avatar
        className={className}
        avatarStyle="Circle"
        topType={avatarConfig.topType}
        accessoriesType={avatarConfig.accessoriesType}
        hairColor={avatarConfig.hairColor}
        facialHairType={avatarConfig.facialHairType}
        clotheType={avatarConfig.clotheType}
        clotheColor={avatarConfig.clotheColor}
        eyeType={avatarConfig.eyeType}
        eyebrowType={avatarConfig.eyebrowType}
        mouthType={avatarConfig.mouthType}
        skinColor={avatarConfig.skinColor}
      />
    );
  }

  // Fallback for children without a custom avatar
  return <AvatarIcon className={`${className} text-blue-400`} />;
}
