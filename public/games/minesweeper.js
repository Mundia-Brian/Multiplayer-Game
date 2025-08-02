// public/games/minesweeper.js
export function startMinesweeperGame(socket) {
  alert("Minesweeper Game Coming Soon!");
  socket.emit("joinGame", { game: "minesweeper" });
}