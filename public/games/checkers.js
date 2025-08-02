// public/games/checkers.js
export function startCheckersGame(socket) {
  alert("Checkers Game Coming Soon!");
  // Placeholder logic for Checkers
  socket.emit("joinGame", { game: "checkers" });
}