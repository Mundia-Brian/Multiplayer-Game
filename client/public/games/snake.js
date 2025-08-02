// public/games/snake.js
export function startSnakeGame(socket) {
  alert("Snake Game Coming Soon!");
  socket.emit("joinGame", { game: "snake" });
}