// public/games/hangman.js
export function startHangmanGame(socket) {
  alert("Hangman Game Coming Soon!");
  // Placeholder logic for Hangman
  socket.emit("joinGame", { game: "hangman" });
}