export const DEFAULT_THEME = "classic";

export const THEMES = [
  {
    id: "classic",
    name: "Classic",
    description: "Aviation cream and gold"
  },
  {
    id: "light",
    name: "Light",
    description: "White background, black text"
  },
  {
    id: "dark",
    name: "Dark",
    description: "Black background, white text"
  },
  {
    id: "night",
    name: "Night",
    description: "Amber text on black"
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    description: "Maximum contrast"
  }
];

export function isValidTheme(id) {
  return THEMES.some(function(theme) {
    return theme.id === id;
  });
}
