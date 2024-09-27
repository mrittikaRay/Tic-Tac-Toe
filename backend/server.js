// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

let gameState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

app.get("/api/game", (req, res) => {
  res.json(gameState);
});

app.post("/api/play", (req, res) => {
  const { row, col, player } = req.body;

  if (gameState[row][col] === '') {
    gameState[row][col] = player;
    res.json({ success: true, gameState });
  } else {
    res.json({ success: false, message: "Cell already occupied" });
  }
});

app.post("/api/reset", (req, res) => {
  gameState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  res.json({ success: true, gameState });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
