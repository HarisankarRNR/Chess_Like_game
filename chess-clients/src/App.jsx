import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import { initializeGame, placeCharacter, getGrid, getCurrentTurn } from './services/gameService';

const App = () => {
  const [grid, setGrid] = useState([[]]);
  const [currentTurn, setCurrentTurn] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [player, setPlayer] = useState('A');

  useEffect(() => {
    loadGrid();
    loadCurrentTurn();
  }, []);

  const loadGrid = async () => {
    const data = await getGrid();
    if (data) setGrid(data.grid);
  };

  const loadCurrentTurn = async () => {
    const data = await getCurrentTurn();
    if (data) setCurrentTurn(data.current_turn);
  };

  const handleCellClick = async (row, col) => {
    if (selectedCharacter) {
      const response = await placeCharacter(player, selectedCharacter, row, col);
      if (response && response.status === 'success') {
        loadGrid();
        setSelectedCharacter(null);
      }
    }
  };

  const handleInitiateGame = async (method) => {
    const response = await initializeGame(player, method);
    if (response && response.status === 'success') {
      loadGrid();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chess Game</h1>
        <div>
          <button onClick={() => handleInitiateGame('random')}>Random Initiation</button>
          <button onClick={() => handleInitiateGame('custom')}>Custom Initiation</button>
        </div>
        <GameBoard grid={grid} onCellClick={handleCellClick} currentTurn={currentTurn} />
      </header>
    </div>
  );
};

export default App;
