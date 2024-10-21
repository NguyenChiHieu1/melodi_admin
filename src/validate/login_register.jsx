export const validateName = (value) => {
  const minLength = 3;
  return value?.trim() !== "" && value?.length >= minLength;
};
export const validateEmail = (value) => {
  const trimmedValue = value?.trim();
  // Biểu thức chính quy kiểm tra địa chỉ email với đuôi @gmail.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const gmailRegex = /^[^\s@]+@gmail\.com$/;
  return emailRegex.test(trimmedValue) && gmailRegex.test(trimmedValue);
};
export const validatePassword = (value) => {
  const minLength = 6;
  const hasNumber = /\d/?.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/?.test(value);
  return value?.length >= minLength;
};
