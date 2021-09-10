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
    winner:string;
    winningTiles: number[][];
    currentPlayer: Player;
    result: GameResult;
}

export default class Game {
    // Settings.
    public static BOARD_SIZE: number = 3;
    public static BOARD_BOX_SIZE: number = 100;
    public static BOARD_MATRIX: number[][] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    // Game state.
    protected state: GameState = {
        boardMatrix: this.cloneBoard(),
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

    // The scene. DOM reference.
    private $canvas;
    private $startBtn;
    private $announcements;

    public constructor(
        private readonly onStart?: () => void,
        private readonly onBeforeMove?: () => void,
        private readonly onAfterMove?: () => void,
        private readonly onFinish?: () => void,
    ) {
        this.onStart = onStart?.bind(this);
        this.onBeforeMove = onBeforeMove?.bind(this);
        this.onAfterMove = onAfterMove?.bind(this);
        this.onFinish = onFinish?.bind(this);
    }

    public cloneBoard() {
        return Game.BOARD_MATRIX.slice(0).map((row) => {
            return row.slice(0);
        });
    }

    private drawStartButton() {
        const elem = document.createElement("button");
        elem.style.display = "absolute";
        elem.innerText = "Re-start game";
        elem.style.marginTop = "1em";
        elem.style.userSelect = "none";
        elem.style.cursor = "pointer";

        this.$startBtn = elem;
        this.$canvas.appendChild(this.$startBtn);
    }

    private drawAnnouncements(text: string) {
        const elem = document.createElement("div");
        elem.style.display = "absolute";
        elem.style.padding = "1em";
        elem.style.fontStyle = "italics";
        elem.innerText = text;

        this.$announcements = elem;
        this.$canvas.appendChild(this.$announcements);
    }

    private removeAnnouncements() {
        return this.$announcements && this.$announcements.remove();
    }

    public drawCanvas() {

        this.$canvas = document.createElement("div");
        this.$canvas.style.boxSizing = "border-box";
        this.$canvas.style.textAlign = "center";
        this.$canvas.style.position = "relative";
        this.$canvas.id = "canvas";

        this.$canvas.style.width = `${Game.BOARD_BOX_SIZE * Game.BOARD_SIZE}px`;
        this.$canvas.style.height = `${Game.BOARD_BOX_SIZE * Game.BOARD_SIZE}px`;

        for (let i = 0; i < Game.BOARD_SIZE * Game.BOARD_SIZE; i++) {
            const $box = document.createElement("div");
            $box.style.float = "left";
            $box.style.width = `${Game.BOARD_BOX_SIZE}px`;
            $box.style.height = `${Game.BOARD_BOX_SIZE}px`;
            $box.style.lineHeight = `${Game.BOARD_BOX_SIZE}px`;
            $box.style.border = "1px solid black";
            $box.style.boxShadow = "0 0 0 1px black";
            $box.style.boxSizing = "border-box";
            $box.style.fontSize = `${Game.BOARD_BOX_SIZE / 2 }px`;
            $box.style.cursor = "pointer";
            $box.style.userSelect = "none";
            $box.id = `box-${i}`;
            $box.dataset.index = `${i}`;
            $box.dataset.row = `${Math.floor(i / Game.BOARD_SIZE)}`;
            $box.dataset.column = `${i % Game.BOARD_SIZE}`;
            $box.className = "box";

            this.$canvas.appendChild($box);
        }

        document.body.appendChild(this.$canvas);

    }

    private bindEvents() {
        this.$canvas.addEventListener('click', (e) => {
            if (this.onBeforeMove) {
                this.onBeforeMove();
            }
            this.onBoardBoxClick.bind(this)(e);
            // Only execute the next callback if the game is not finished.
            if (this.state.result === GameResult.PLAYING && this.onAfterMove) {
                this.onAfterMove();
            }
        });

        this.$startBtn.addEventListener('click', () => {
            this.reset();
            this.resetRender();
        });
    }

    private onBoardBoxClick(e: MouseEvent) {
        const $box = e.target as HTMLElement;
        // Prevent propagating click callback if:
        // 1. the DOM element clicked is not a "box".
        // 2. the "box" already has a value in it.
        // 3. A player already won the game.
        if ($box.className !== "box" || $box.innerText !== "" || this.state.result !== GameResult.PLAYING) {
            return false;
        }

        const index = parseInt($box.dataset.index as string, 10);
        const row = parseInt($box.dataset.row as string, 10);
        const column = parseInt($box.dataset.column as string, 10);

        // Store round moves.
        this.state.roundMovesPerPlayer[this.state.currentPlayer].push(index);
        this.state.roundMovesPerIndex.push(index);
        this.state.boardMatrix[row][column] = this.state.currentPlayer;

        $box.innerText = this.getCurrentPlayerLabel();

        const result = this.checkGameResult();

        if ([GameResult.WIN, GameResult.DRAW].includes(result)) {
            if (result === GameResult.WIN) {
                this.state.winningTiles.forEach((tileArr) => {
                    (document.querySelector(`[data-row="${tileArr[0]}"][data-column="${tileArr[1]}"]`) as HTMLElement).style.backgroundColor = "red";
                });
                this.drawAnnouncements(`${this.state.winner} has won!`);
            } else if (result === GameResult.DRAW) {
                this.drawAnnouncements(`It's a draw!`);
            }
            if (this.onFinish) {
                this.onFinish();
            }
        }

        // Switch to the next player.
        if (this.state.currentPlayer === Player.X) {
            this.state.currentPlayer = Player.O;
        } else {
            this.state.currentPlayer = Player.X;
        }


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
        this.reset();
        this.drawCanvas();
        this.drawStartButton();
        this.bindEvents();
        if (this.onStart) {
            this.onStart();
        }
    }

    public reset() {
        this.state.winner = "";
        this.state.winningTiles = [];
        this.state.roundMovesPerIndex = [];
        this.state.roundMovesPerPlayer = {
            [Player.X]: [],
            [Player.O]: []
        };
        this.state.currentPlayer = Player.X;
        this.state.boardMatrix = this.cloneBoard();
        this.state.result = GameResult.PLAYING;
    }

    public resetRender() {
        this.removeAnnouncements();
        this.$canvas.querySelectorAll(".box").forEach(($box) => {
            $box.innerText = "";
            $box.style.backgroundColor = "";
        });
    }
}