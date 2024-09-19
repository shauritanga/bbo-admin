export function toCapitalize(str) {
  if (!str) return str; // Return if the string is empty or null
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
