class Character {
    constructor(name, position, player) {
        this.name = name;
        this.position = position; // [row, col] tuple
        this.player = player; // 'A' or 'B'
    }

    move(direction) {
        let [row, col] = this.position;

        if (this.name === 'Hero1') {
            // Hero1 moves 2 steps in the specified direction
            if (direction === 'up') row -= 2;
            if (direction === 'down') row += 2;
            if (direction === 'left') col -= 2;
            if (direction === 'right') col += 2;
        } else if (this.name === 'Hero2') {
            // Hero2 moves 2 steps diagonally
            if (direction === 'up-right') { row -= 2; col += 2; }
            if (direction === 'up-left') { row -= 2; col -= 2; }
            if (direction === 'down-right') { row += 2; col += 2; }
            if (direction === 'down-left') { row += 2; col -= 2; }
        } else {
            // Normal movement for Pawn (1 step in the specified direction)
            if (direction === 'up') row -= 1;
            if (direction === 'down') row += 1;
            if (direction === 'left') col -= 1;
            if (direction === 'right') col += 1;
        }
        return [row, col];
    }
}

class Game {
    constructor() {
        this.grid = Array.from({ length: 5 }, () => Array(5).fill(''));
        this.players = { 'A': [], 'B': [] }; // Lists of Character objects for each player
        this.currentTurn = 'A'; // Player A starts the game
        this.ready = { 'A': false, 'B': false }; // Track if both players are ready
    }

    isValidInitiation(row, col) {
        return this.grid[row][col] === '';
    }

    customInitiation(player, characterName, position) {
        const [row, col] = position;
        if (player === 'A' && row !== 0) return { error: 'Invalid position for Player A' };
        if (player === 'B' && row !== 4) return { error: 'Invalid position for Player B' };

        if (this.isValidInitiation(row, col)) {
            const character = new Character(characterName, position, player);
            this.players[player].push(character);
            this.grid[row][col] = characterName;
            return { success: true };
        } else {
            return { error: 'Position already occupied' };
        }
    }

    randomInitiation(player) {
        const row = player === 'A' ? 0 : 4;
        const positions = [...Array(5).keys()];
        positions.sort(() => Math.random() - 0.5);
        const characters = ['Hero1', 'Hero2', 'Pawn1', 'Pawn2', 'Pawn3'];

        characters.forEach((characterName, i) => {
            const position = [row, positions[i]];
            const character = new Character(characterName, position, player);
            this.players[player].push(character);
            this.grid[row][positions[i]] = characterName;
        });

        this.ready[player] = true;
    }

    startGame() {
        if (this.ready['A'] && this.ready['B']) {
            return { game_started: true };
        }
        return { game_started: false };
    }

    isValidMove(character, newPosition) {
        const [row, col] = newPosition;
        if (row < 0 || row >= 5 || col < 0 || col >= 5) return false;
        if (this.grid[row][col] && this.grid[row][col][0] === character.player) return false;
        return true;
    }

    move(characterName, direction) {
        const character = this.players[this.currentTurn].find(c => c.name === characterName);
        if (!character) return { error: 'Character not found' };

        const newPosition = character.move(direction);
        if (!this.isValidMove(character, newPosition)) return { error: 'Invalid move' };

        const [oldRow, oldCol] = character.position;
        const [newRow, newCol] = newPosition;

        if (this.grid[newRow][newCol]) { // Capture opponent's character
            const opponent = this.currentTurn === 'A' ? 'B' : 'A';
            this.players[opponent] = this.players[opponent].filter(c => c.position[0] !== newRow || c.position[1] !== newCol);
        }

        if (character.name === 'Hero1') {
            // Hero1 captures any character in the path between old and new position
            this.clearPath(oldRow, oldCol, newRow, newCol);
        }

        this.grid[oldRow][oldCol] = '';
        this.grid[newRow][newCol] = character.name;
        character.position = [newRow, newCol];

        if (!this.players['A'].length || !this.players['B'].length) {
            return { result: `Player ${this.currentTurn} wins!` };
        }

        this.currentTurn = this.currentTurn === 'A' ? 'B' : 'A';

        return { result: 'Move successful', next_turn: this.currentTurn };
    }

    clearPath(oldRow, oldCol, newRow, newCol) {
        if (oldRow === newRow) { // Horizontal movement
            for (let col = Math.min(oldCol, newCol) + 1; col < Math.max(oldCol, newCol); col++) {
                this.capturePosition(oldRow, col);
            }
        } else if (oldCol === newCol) { // Vertical movement
            for (let row = Math.min(oldRow, newRow) + 1; row < Math.max(oldRow, newRow); row++) {
                this.capturePosition(row, oldCol);
            }
        }
    }

    capturePosition(row, col) {
        const opponent = this.currentTurn === 'A' ? 'B' : 'A';
        if (this.grid[row][col] && this.grid[row][col][0] === opponent) {
            this.players[opponent] = this.players[opponent].filter(c => c.position[0] !== row || c.position[1] !== col);
            this.grid[row][col] = '';
        }
    }
}

module.exports = { Game, Character };
