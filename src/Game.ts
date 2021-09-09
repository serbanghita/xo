import {unique} from "./utils";

enum Player {
    NONE = 0,
    X = 1,
    O = 2
}

enum GameResult {
    PLAYING = 0,
    WIN = 1,
    DRAW = 2
}

export default class Game {
    private boxSize: number = 100;
    private board: number[][] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    private roundMovesPerIndex: number[] = [];
    private roundMovesPerPlayer = {
        [Player.X]: [],
        [Player.O]: []
    };
    private winner = "";
    private winningTiles: number[][] = [];
    private currentPlayer: Player = Player.X;
    private gameResult: GameResult = GameResult.PLAYING;

    // The scene. DOM reference.
    private $canvas;
    private $startBtn;
    private $announcements;

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
        this.$announcements && this.$announcements.remove();
    }

    public drawCanvas() {

        this.$canvas = document.createElement("div");
        this.$canvas.style.boxSizing = "border-box";
        this.$canvas.style.textAlign = "center";
        this.$canvas.style.position = "relative";
        this.$canvas.id = "canvas";

        this.$canvas.style.width = `${this.boxSize * 3}px`;
        this.$canvas.style.height = `${this.boxSize * 3}px`;

        for (let i = 0; i < 3 * 3; i++) {
            const $box = document.createElement("div");
            $box.style.float = "left";
            $box.style.width = `${this.boxSize}px`;
            $box.style.height = `${this.boxSize}px`;
            $box.style.lineHeight = `${this.boxSize}px`;
            $box.style.border = "1px solid black";
            $box.style.boxShadow = "0 0 0 1px black";
            $box.style.boxSizing = "border-box";
            $box.style.fontSize = "50px";
            $box.style.cursor = "pointer";
            $box.style.userSelect = "none";
            $box.id = `box-${i}`;
            $box.dataset.index = `${i}`;
            $box.dataset.row = `${Math.floor(i / 3)}`;
            $box.dataset.column = `${i % 3}`;
            $box.className = "box";

            this.$canvas.appendChild($box);
        }

        document.body.appendChild(this.$canvas);

    }

    private bindEvents() {

        this.$canvas.addEventListener('click', (e) => {
            const $box = e.target;
            // Prevent propagating click callback if:
            // 1. the DOM element clicked is not a "box".
            // 2. the "box" already has a value in it.
            // 3. A player already won the game.
            if ($box.className !== "box" || $box.innerText !== "" || this.gameResult !== GameResult.PLAYING) {
                return false;
            }

            const index = $box.dataset.index;
            const row = $box.dataset.row;
            const column = $box.dataset.column;

            // Store round moves.
            this.roundMovesPerPlayer[this.currentPlayer].push(index);
            this.roundMovesPerIndex.push(index);
            this.board[row][column] = this.currentPlayer;
            console.log(this.board, this.roundMovesPerIndex);

            $box.innerText = this.currentPlayer === Player.X ? "X" : "O";

            if (this.currentPlayer === Player.X) {
                this.currentPlayer = Player.O;
            } else {
                this.currentPlayer = Player.X;
            }

            const winCheck = this.checkGameResult();
            if (winCheck === GameResult.WIN) {
                console.log(`${this.winner} has won!`);
                this.winningTiles.forEach((tileArr) => {
                    (document.querySelector(`[data-row="${tileArr[0]}"][data-column="${tileArr[1]}"]`) as HTMLElement).style.backgroundColor = "red";
                });
                this.drawAnnouncements(`${this.winner} has won!`);
            } else if (winCheck === GameResult.DRAW) {
                console.log(`It's a draw!`);
                this.drawAnnouncements(`It's a draw!`);
            }

        });

        this.$startBtn.addEventListener('click', () => {
            this.reset();
            this.resetRender();
        });

    }

    // Methodology: brute check all rows and columns and diagonals.
    private checkGameResult(): GameResult {

        // Don't perform winning check until at least 5 moves.
        // 5 moves mean that X has moved 3 times and O only 2 times.
        if (this.roundMovesPerIndex.length < 5) {
            return GameResult.PLAYING;
        }

        for (let i = 0; i < 3; i++) {
            // Check rows.
            const rows = unique(this.board[i]);
            if (rows.length === 1 && rows[0] !== Player.NONE) {
                this.winner = this.getPlayerName(this.board[i][0]);
                this.winningTiles = [[i, 0], [i, 1], [i, 2]];
                this.gameResult = GameResult.WIN;
                return GameResult.WIN;
            }
            // Check columns.
            const columns = unique([this.board[0][i], this.board[1][i], this.board[2][i]]);
            if (columns.length === 1 && columns[0] !== Player.NONE) {
                this.winner = this.getPlayerName(this.board[0][i]);
                this.winningTiles = [[0, i], [1, i], [2, i]];
                this.gameResult = GameResult.WIN;
                return GameResult.WIN;
            }
        }

        // Check diags.
        const diag1 = unique([this.board[0][0], this.board[1][1], this.board[2][2]]);
        if (diag1.length === 1 && diag1[0] !== Player.NONE) {
            this.winner = this.getPlayerName(this.board[0][0]);
            this.winningTiles = [[0, 0], [1, 1], [2, 2]];
            this.gameResult = GameResult.WIN;
            return GameResult.WIN;
        }

        const diag2 = unique([this.board[0][2], this.board[1][1], this.board[2][0]]);
        if (diag2.length === 1 && diag2[0] !== Player.NONE) {
            this.winner = this.getPlayerName(this.board[0][2]);
            this.winningTiles = [[0, 2], [1, 1], [2, 0]];
            this.gameResult = GameResult.WIN;
            return GameResult.WIN;
        }

        if (this.roundMovesPerIndex.length === 3 * 3) {
            this.gameResult = GameResult.DRAW;
            return GameResult.DRAW;
        }

        return GameResult.PLAYING;
    }

    private getPlayerName(player: Player): string {
        return player === Player.X ? "X" : "O";
    }

    public start() {
        this.reset();
        this.drawCanvas();
        this.drawStartButton();
        this.bindEvents();
    }

    public reset() {
        this.winner = "";
        this.winningTiles = [];
        this.roundMovesPerIndex = [];
        this.roundMovesPerPlayer = {
            [Player.X]: [],
            [Player.O]: []
        };
        this.currentPlayer = Player.X;
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.gameResult = GameResult.PLAYING;
    }

    public resetRender() {
        this.removeAnnouncements();
        this.$canvas.querySelectorAll(".box").forEach(($box) => {
            $box.innerText = "";
            $box.style.backgroundColor = "";
        });
    }
}