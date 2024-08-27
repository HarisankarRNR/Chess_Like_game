import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const initializeGame = async (player, method) => {
  try {
    const response = await axios.get(`${API_URL}/initialize_game/${player}/${method}`);
    return response.data;
  } catch (error) {
    console.error('Error initializing game:', error);
    return null;
  }
};

export const placeCharacter = async (player, character_name, row, col) => {
  try {
    const response = await axios.post(`${API_URL}/place_character/${player}`, {
      character_name,
      row,
      col
    });
    return response.data;
  } catch (error) {
    console.error('Error placing character:', error);
    return null;
  }
};

export const startGame = async () => {
  try {
    const response = await axios.post(`${API_URL}/start_game`);
    return response.data;
  } catch (error) {
    console.error('Error starting game:', error);
    return null;
  }
};

export const getGrid = async () => {
  try {
    const response = await axios.get(`${API_URL}/grid`);
    return response.data;
  } catch (error) {
    console.error('Error getting grid:', error);
    return null;
  }
};

export const getCurrentTurn = async () => {
  try {
    const response = await axios.get(`${API_URL}/current_turn`);
    return response.data;
  } catch (error) {
    console.error('Error getting current turn:', error);
    return null;
  }
};
