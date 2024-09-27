

<template>
  
    <!-- <h2>Tic Tac Toe</h2> -->

    <div class="container">
      <div class="dashboard">
        hgcfdffg
      </div>
      <div>
      <div class="board">
        <div v-for="(row, rowIndex) in gameState" :key="rowIndex" class="row">
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="cell"
            @click="makeMove(rowIndex, colIndex)"
          >
            {{ cell }}
          </div>
        </div>


      </div>
      <button @click="resetGame">Reset Game</button>
    </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';


const apiBaseURL = 'http://localhost:3000/api';
const gameStateURL = `${apiBaseURL}/game`;
const playURL = `${apiBaseURL}/play`;
const resetURL = `${apiBaseURL}/reset`;

const gameState = ref([['', '', ''], ['', '', ''], ['', '', '']]);
const currentPlayer = ref('X');

const fetchGameState = async () => {
  try {
    const response = await axios.get(gameStateURL);
    gameState.value = response.data;
  } catch (error) {
    console.error('Error fetching game state:', error.response ? error.response.data : error.message);
  }
};

const makeMove = async (row, col) => {
  try {
    const response = await axios.post(playURL, {
      row,
      col,
      player: currentPlayer.value,
    });

    if (response.data.success) {
      gameState.value = response.data.gameState;

      const winner = checkWinner(gameState.value);
      if (winner) {
        // await alert(`${winner} wins!`);
        Swal.fire({
    title: 'Victory!',
    text: 'Congratulations! You won the level!',
    icon: 'success',
    confirmButtonText: 'Next Level',
    backdrop: 'rgba(0, 0, 0, 0.8)',  // Optional backdrop customization
    showClass: {
      popup: 'animate__animated animate__fadeInDown'  // Optional animation
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'   // Optional hide animation
    }
  });
        resetGame();
      } else if (isDraw(gameState.value)) {
        alert('It\'s a draw!');
        await resetGame();
      } else {
        currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
      }
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error('Error making move:', error);
  }
};


const resetGame = async () => {
  try {
    const response = await axios.post(resetURL);
    if (response.data.success) {
      gameState.value = response.data.gameState;
      currentPlayer.value = 'X';
    }
  } catch (error) {
    console.error('Error resetting game:', error);
  }
};

const winningCombinations = [
  [0, 1, 2], 
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8], 
  [2, 4, 6] 
];

const checkWinner = (gameState) => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameState[Math.floor(a / 3)][a % 3] && 
        gameState[Math.floor(a / 3)][a % 3] === gameState[Math.floor(b / 3)][b % 3] && 
        gameState[Math.floor(a / 3)][a % 3] === gameState[Math.floor(c / 3)][c % 3]) {
      return gameState[Math.floor(a / 3)][a % 3]; // Return 'X' or 'O'
    }
  }
  return null;
};

const isDraw = (gameState) => {
  return gameState.flat().every(cell => cell);
};


onMounted(fetchGameState);
</script>

<style>
.tic-tac-toe {
  text-align: center;
  display: flex;
}

.board {
  flex: 0 0 70%;
  display: inline-block;
  margin: 20px;
  background-color: #2d2966;
}

.row {
  display: flex;
}

.dashboard{
  flex: 0 0 30%;
}

.cell {
  width: 200px;
  height: 200px;
  border: 3px solid #f7f6f6;
  line-height: 200px;
  font-size: 84px;
  color: #fab246;
  cursor: pointer;
  text-align: center;
}
.cell:hover {
  background-color: #47437b;
}
.container {
  display: flex;                  /* Set the container as a flex container */
  height: 100vh;                  /* Full viewport height */
}
</style>
