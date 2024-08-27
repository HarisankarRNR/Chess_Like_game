const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { Game } = require('./game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

const game = new Game();

app.get('/initialize_game/:player/:method', (req, res) => {
    const { player, method } = req.params;
    if (method === 'random') {
        game.randomInitiation(player);
        res.json({ status: 'success', method: 'random' });
    } else if (method === 'custom') {
        res.json({ status: 'success', method: 'custom' });
    } else {
        res.status(400).json({ detail: 'Invalid initiation method' });
    }
});

app.post('/place_character/:player', (req, res) => {
    const { player } = req.params;
    const { character_name, row, col } = req.body;

    if (player !== 'A' && player !== 'B') return res.status(400).json({ detail: 'Invalid player' });
    if (!['Hero1', 'Hero2', 'Pawn'].includes(character_name)) return res.status(400).json({ detail: 'Invalid character name' });
    if (row < 0 || row >= 5 || col < 0 || col >= 5) return res.status(400).json({ detail: 'Invalid position' });

    const response = game.customInitiation(player, character_name, [row, col]);
    if (response.error) return res.status(400).json({ error: response.error });

    res.json({ status: 'success', character: character_name, position: [row, col] });
});

app.post('/start_game', (req, res) => {
    const response = game.startGame();
    if (response.game_started) {
        res.json({ status: 'success', message: 'Game started' });
    } else {
        res.status(400).json({ detail: 'Both players are not ready' });
    }
});

app.get('/current_turn', (req, res) => {
    res.json({ current_turn: game.currentTurn });
});

app.get('/grid', (req, res) => {
    res.json({ grid: game.grid });
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('move', ({ rowIndex, colIndex }) => {
        // Implement logic to handle moves
        // Example:
        const response = game.move(/* parameters based on move */);
        socket.emit('update_board', game.grid);
        io.emit('current_turn', game.currentTurn);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(8000, () => {
    console.log('Server listening on port 8000');
});
