// public/games/connect4.js
export function startConnect4Game(socket) {
  alert("Connect Four Game Coming Soon!");
  // Placeholder logic for Connect Four
  socket.emit("joinGame", { game: "connect4" });
}