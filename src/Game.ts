import {unique} from "./utils";

export enum Player {
    NONE = 0,
    X = 1,
    O = 2
}

export enum GameResult {
    PLAYING = 0,
    WIN = 1,
    DRAW = 2
}

interface GameState {
    boardMatrix: typeof Game.BOARD_MATRIX,
    roundMovesPerIndex: number[];
    roundMovesPerPlayer: {[Player.X]: [], [Player.O]: []};
    winner: string;
    winningTiles: number[][];
    currentPlayer: Player;
    result: GameResult;
}

/**
 * Example:
 * GameImpl.ts
 *      class GameImpl extends Game {
 *          ...
 *          onAfterSelectTile(index, row, column) {
 *              console.log(`It's ${this.getCurrentPlayerLabel()}'s turn`);
 *          }
 *          ...
 *          onFinish() {
 *              console.log(this.state);
 *          }
 *          ...
 *      }
 *
 * index.ts
 *      const game = new GameImpl();
 *      game.start();
 *      game.selectTile(0);
 *      game.selectTile(5);
 *      ...
 */
export default abstract class Game {
    // Settings.
    public static BOARD_SIZE: number = 3;
    public static BOARD_BOX_SIZE: number = 100;
    public static BOARD_MATRIX: number[][] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    // Game state.
    public state: GameState = {
        boardMatrix: Game.cloneBoard(),
        roundMovesPerIndex: [],
        roundMovesPerPlayer: {
            [Player.X]: [],
            [Player.O]: []
        },
        winner: "",
        winningTiles: [],
        currentPlayer: Player.X,
        result: GameResult.PLAYING
    }

    // Anyone wanting to implement this abstract class implementation of XO
    // needs to implement these methods in order to have some sort of rendering.
    public abstract onInit(): void;
    public abstract onStart(): void;
    public abstract onBeforeSelectTile(index, row, column): void;
    public abstract onAfterSelectTile(index, row, column): void;
    public abstract onFinish(): void;
    public abstract onWin(): void;
    public abstract onDraw(): void;

    private static cloneBoard() {
        return Game.BOARD_MATRIX.slice(0).map((row) => {
            return row.slice(0);
        });
    }

    private getRow(tileIndex: number): number {
        return Math.floor(tileIndex / Game.BOARD_SIZE);
    }

    private getColumn(tileIndex: number): number {
        return tileIndex % Game.BOARD_SIZE;
    }

    public selectTile(index: number, row?: number, column?: number) {

        if (typeof index !== "number") {
            return false;
        }

        if (index < 0 || index > ((Game.BOARD_SIZE * Game.BOARD_SIZE) - 1)) {
            return false;
        }

        if (typeof row === "undefined") {
            row = this.getRow(index);
        }

        if (typeof column === "undefined") {
            column = this.getColumn(index);
        }

        // Check if tile is already occupied.
        // Check if game has finished.
        // If any of the above are true, then stop processing "clicks" on tiles.
        if (this.state.boardMatrix[row][column] !== Player.NONE || this.state.result !== GameResult.PLAYING) {
            return false;
        }

        this.onBeforeSelectTile(index, row, column);

        // Store round moves.
        this.state.roundMovesPerPlayer[this.state.currentPlayer].push(index);
        this.state.roundMovesPerIndex.push(index);
        this.state.boardMatrix[row][column] = this.state.currentPlayer;

        const result = this.checkGameResult();

        if ([GameResult.WIN, GameResult.DRAW].includes(result)) {
            if (result === GameResult.WIN) {
                this.onWin();
            } else if (result === GameResult.DRAW) {
                this.onDraw();
            }
            this.onFinish();

        }

        // Switch to the next player.
        if (this.state.currentPlayer === Player.X) {
            this.state.currentPlayer = Player.O;
        } else {
            this.state.currentPlayer = Player.X;
        }

        this.onAfterSelectTile(index, row, column);
    }

    // Methodology: brute check all rows and columns and diagonals.
    private checkGameResult(): GameResult {

        // Don't perform winning check until at least 5 moves.
        // 5 moves mean that X has moved 3 times and O only 2 times.
        if (this.state.roundMovesPerIndex.length < ((Game.BOARD_SIZE * 2) - 1)) {
            return GameResult.PLAYING;
        }

        for (let i = 0; i < Game.BOARD_SIZE; i++) {
            // Check rows.
            const rows = unique(this.state.boardMatrix[i]);
            if (rows.length === 1 && rows[0] !== Player.NONE) {
                this.state.winner = this.getCurrentPlayerLabel();
                this.state.winningTiles = [[i, 0], [i, 1], [i, 2]];
                this.state.result = GameResult.WIN;
                return GameResult.WIN;
            }
            // Check columns.
            const columns = unique([this.state.boardMatrix[0][i], this.state.boardMatrix[1][i], this.state.boardMatrix[2][i]]);
            if (columns.length === 1 && columns[0] !== Player.NONE) {
                this.state.winner = this.getCurrentPlayerLabel();
                this.state.winningTiles = [[0, i], [1, i], [2, i]];
                this.state.result = GameResult.WIN;
                return GameResult.WIN;
            }
        }

        // Check diags.
        const diag1 = unique([this.state.boardMatrix[0][0], this.state.boardMatrix[1][1], this.state.boardMatrix[2][2]]);
        if (diag1.length === 1 && diag1[0] !== Player.NONE) {
            this.state.winner = this.getCurrentPlayerLabel();
            this.state.winningTiles = [[0, 0], [1, 1], [2, 2]];
            this.state.result = GameResult.WIN;
            return GameResult.WIN;
        }

        const diag2 = unique([this.state.boardMatrix[0][2], this.state.boardMatrix[1][1], this.state.boardMatrix[2][0]]);
        if (diag2.length === 1 && diag2[0] !== Player.NONE) {
            this.state.winner = this.getCurrentPlayerLabel();
            this.state.winningTiles = [[0, 2], [1, 1], [2, 0]];
            this.state.result = GameResult.WIN;
            return GameResult.WIN;
        }

        if (this.state.roundMovesPerIndex.length === Game.BOARD_SIZE * Game.BOARD_SIZE) {
            this.state.result = GameResult.DRAW;
            return GameResult.DRAW;
        }

        return GameResult.PLAYING;
    }

    public getCurrentPlayerLabel(): string {
        return this.state.currentPlayer === Player.X ? "X" : "O";
    }

    public start() {
        this.resetState();
        this.onStart();

        return true;
    }

    public resetState() {
        this.state = {
            winner: "",
            winningTiles: [],
            roundMovesPerIndex: [],
            roundMovesPerPlayer: {
                [Player.X]: [],
                [Player.O]: []
            },
            currentPlayer: Player.X,
            boardMatrix: Game.cloneBoard(),
            result: GameResult.PLAYING
        };
    }


}