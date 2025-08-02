// public/games/pong.js
export function startPongGame(socket) {
  alert("Pong Game Coming Soon!");
  socket.emit("joinGame", { game: "pong" });
}