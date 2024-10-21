// Validate Album Name
export const validateAlbumName = (value) => {
  const minLength = 3;
  return value?.trim() !== "" && value?.length >= minLength;
};

// Validate Artist (Array of User IDs)
export const validateArtist = (value) => {
  return (
    Array.isArray(value) && value.every((id) => id.match(/^[0-9a-fA-F]{24}$/))
  );
};

// Validate Status (Enum Check)
export const validateStatus = (value) => {
  const allowedStatuses = ["pending", "approved", "rejected"];
  return allowedStatuses.includes(value);
};

// Validate Background Colour (Hex Color Code)
export const validateBgColour = (value) => {
  const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return value?.trim() !== "" && hexColorRegex.test(value);
};

// Validate Description (Optional, but non-empty if provided)
export const validateDesc = (value) => {
  return value && value.trim().length > 0;
};
