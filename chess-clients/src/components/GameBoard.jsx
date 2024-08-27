import React, { useEffect, useState } from 'react';
import './GameBoard.css';
import io from 'socket.io-client';

const GameBoard = ({ grid, currentTurn, player }) => {
  const [socket, setSocket] = useState(null);
  const [localGrid, setLocalGrid] = useState(grid);

  useEffect(() => {
    // Initialize WebSocket connection
    const socketConnection = io('http://localhost:8000');
    setSocket(socketConnection);

    // Handle incoming messages
    socketConnection.on('update_board', (updatedGrid) => {
      setLocalGrid(updatedGrid);
    });

    socketConnection.on('current_turn', (turn) => {
      // Update current turn
      // This can be passed down as a prop or managed in state
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleCellClick = (rowIndex, colIndex) => {
    if (socket) {
      // Send move command via WebSocket
      socket.emit('move', { rowIndex, colIndex });
    }
  };

  const renderCell = (cell, rowIndex, colIndex) => {
    return (
      <div 
        key={`${rowIndex}-${colIndex}`} 
        className={`cell ${cell ? 'occupied' : ''}`} 
        onClick={() => handleCellClick(rowIndex, colIndex)}
      >
        {cell}
      </div>
    );
  };

  return (
    <div className="board">
      {localGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </div>
      ))}
      <div>Current Turn: {currentTurn}</div>
    </div>
  );
};

export default GameBoard;
