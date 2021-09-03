import {unique} from "./utils";

enum Player {
    NONE = 0,
    X = 1,
    O = 2
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
    private currentPlayer = Player.X;

    private $canvas;


    public drawCanvas() {

        this.$canvas = document.createElement("div");
        this.$canvas.style.boxSizing = "border-box";
        this.$canvas.style.textAlign = "center";
        this.$canvas.id = "canvas";
        this.$canvas.style.width = `${this.boxSize * 3}px`;
        this.$canvas.style.height = `${this.boxSize * 3}px`;

        for (let i = 0; i < 3 * 3; i++) {
            const $box = document.createElement("div");
            $box.style.float = "left";
            $box.style.width = `${this.boxSize}px`;
            $box.style.height = `${this.boxSize}px`;
            $box.style.border = "1px solid black";
            $box.style.boxShadow = "0 0 0 1px black";
            $box.style.boxSizing = "border-box";
            $box.style.fontSize = "50px";
            $box.id = `box-${i}`;
            $box.dataset.index = `${i}`;
            $box.dataset.row = `${Math.floor(i / 3)}`;
            $box.dataset.column = `${i % 3}`;
            $box.className = "box";
            // $box.innerText = `r: ${Math.floor(i / 3)} c: ${i % 3}`;

            this.$canvas.appendChild($box);
        }

        document.body.appendChild(this.$canvas);

    }

    private bindEvents() {

        this.$canvas.addEventListener('click', (e) => {
            const $box = e.target;
            if ($box.className !== "box") {
                return false;
            }

            const index = $box.dataset.index;
            const row = $box.dataset.row;
            const column = $box.dataset.column;

            // Store round moves.
            this.roundMovesPerPlayer[this.currentPlayer].push(index);
            this.roundMovesPerIndex.push(index);
            this.board[row][column] = this.currentPlayer;
            console.log(this.board);

            $box.innerText = this.currentPlayer === Player.X ? "X" : "O";

            if (this.currentPlayer === Player.X) {
                this.currentPlayer = Player.O;
            } else {
                this.currentPlayer = Player.X;
            }

            const winCheck = this.checkWinningCondition();
            if (winCheck) {
                console.log(`${winCheck} has won!`);
            }

        });
    }

    // Methodology: brute check all rows and columns and diagonals.
    private checkWinningCondition(): boolean {

        if (this.roundMovesPerIndex.length < 5) {
            return false;
        }

        for (let i = 0; i < 3; i++) {
            // Check rows.
            const rows = unique(this.board[i]);
            if (rows.length === 1 && rows[0] !== Player.NONE) {
                return true;
            }
            // Check columns.
            const columns = unique([this.board[0][i], this.board[1][i], this.board[2][i]]);
            if (columns.length === 1 && columns[0] !== Player.NONE) {
                return true;
            }
        }

        // Check diags.
        const diag1 = unique([this.board[0][0], this.board[1][1], this.board[2][2]]);
        if (diag1.length === 1 && diag1[0] !== Player.NONE) {
            return true;
        }

        const diag2 = unique([this.board[0][2], this.board[1][1], this.board[2][0]]);
        if (diag2.length === 1 && diag2[0] !== Player.NONE) {
            return true;
        }

        return false;
    }

    private getPlayerName(player: Player): string {
        return player === Player.X ? "X" : "O";
    }

    public start() {
        this.drawCanvas();
        this.bindEvents();
    }
}