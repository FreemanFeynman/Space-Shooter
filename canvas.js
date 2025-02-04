export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}