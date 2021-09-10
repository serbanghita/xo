/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameResult = exports.Player = void 0;
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var Player;
(function (Player) {
    Player[Player["NONE"] = 0] = "NONE";
    Player[Player["X"] = 1] = "X";
    Player[Player["O"] = 2] = "O";
})(Player = exports.Player || (exports.Player = {}));
var GameResult;
(function (GameResult) {
    GameResult[GameResult["PLAYING"] = 0] = "PLAYING";
    GameResult[GameResult["WIN"] = 1] = "WIN";
    GameResult[GameResult["DRAW"] = 2] = "DRAW";
})(GameResult = exports.GameResult || (exports.GameResult = {}));
class Game {
    constructor() {
        // Game state.
        this.state = {
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
        };
    }
    static cloneBoard() {
        return Game.BOARD_MATRIX.slice(0).map((row) => {
            return row.slice(0);
        });
    }
    getRow(tileIndex) {
        return Math.floor(tileIndex / Game.BOARD_SIZE);
    }
    getColumn(tileIndex) {
        return tileIndex % Game.BOARD_SIZE;
    }
    selectTile(index, row, column) {
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
            }
            else if (result === GameResult.DRAW) {
                this.onDraw();
            }
            this.onFinish();
        }
        // Switch to the next player.
        if (this.state.currentPlayer === Player.X) {
            this.state.currentPlayer = Player.O;
        }
        else {
            this.state.currentPlayer = Player.X;
        }
        this.onAfterSelectTile(index, row, column);
    }
    // Methodology: brute check all rows and columns and diagonals.
    checkGameResult() {
        // Don't perform winning check until at least 5 moves.
        // 5 moves mean that X has moved 3 times and O only 2 times.
        if (this.state.roundMovesPerIndex.length < ((Game.BOARD_SIZE * 2) - 1)) {
            return GameResult.PLAYING;
        }
        for (let i = 0; i < Game.BOARD_SIZE; i++) {
            // Check rows.
            const rows = utils_1.unique(this.state.boardMatrix[i]);
            if (rows.length === 1 && rows[0] !== Player.NONE) {
                this.state.winner = this.getCurrentPlayerLabel();
                this.state.winningTiles = [[i, 0], [i, 1], [i, 2]];
                this.state.result = GameResult.WIN;
                return GameResult.WIN;
            }
            // Check columns.
            const columns = utils_1.unique([this.state.boardMatrix[0][i], this.state.boardMatrix[1][i], this.state.boardMatrix[2][i]]);
            if (columns.length === 1 && columns[0] !== Player.NONE) {
                this.state.winner = this.getCurrentPlayerLabel();
                this.state.winningTiles = [[0, i], [1, i], [2, i]];
                this.state.result = GameResult.WIN;
                return GameResult.WIN;
            }
        }
        // Check diags.
        const diag1 = utils_1.unique([this.state.boardMatrix[0][0], this.state.boardMatrix[1][1], this.state.boardMatrix[2][2]]);
        if (diag1.length === 1 && diag1[0] !== Player.NONE) {
            this.state.winner = this.getCurrentPlayerLabel();
            this.state.winningTiles = [[0, 0], [1, 1], [2, 2]];
            this.state.result = GameResult.WIN;
            return GameResult.WIN;
        }
        const diag2 = utils_1.unique([this.state.boardMatrix[0][2], this.state.boardMatrix[1][1], this.state.boardMatrix[2][0]]);
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
    getCurrentPlayerLabel() {
        return this.state.currentPlayer === Player.X ? "X" : "O";
    }
    start() {
        this.resetState();
        this.onStart();
        return true;
    }
    resetState() {
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
exports.default = Game;
// Settings.
Game.BOARD_SIZE = 3;
Game.BOARD_BOX_SIZE = 100;
Game.BOARD_MATRIX = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];


/***/ }),

/***/ "./src/dom/GameImpl.ts":
/*!*****************************!*\
  !*** ./src/dom/GameImpl.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Game_1 = __webpack_require__(/*! ../Game */ "./src/Game.ts");
const utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
class GameImpl extends Game_1.default {
    constructor(scene) {
        super();
        this.scene = scene;
        this.onInit();
    }
    onAfterSelectTile(index, row, column) {
        const api = this;
        // AI (random, dumb)
        const state = api.state;
        const player = api.getCurrentPlayerLabel();
        console.log(`It's ${player}'s turn`);
        console.log(`Board looks like this`, state.boardMatrix);
        // Random AI implementation.
        if (state.currentPlayer === Game_1.Player.O) {
            const freeBoardTilesByIndex = state.boardMatrix.reduce((acc, value) => {
                return acc.concat(value);
            }, []).reduce((acc2, value2, index) => {
                if (value2 > 0) {
                    return acc2;
                }
                acc2.push(index);
                return acc2;
            }, []);
            console.log("Free board tiles:", freeBoardTilesByIndex);
            const randomIndex = utils_1.randomInt(0, freeBoardTilesByIndex.length - 1);
            const tileIndex = freeBoardTilesByIndex[randomIndex];
            // (document.querySelector(`#box-${tileIndex}`) as HTMLElement).click();
            this.selectTile(tileIndex);
        }
    }
    onBeforeSelectTile(index, row, column) {
        const api = this;
        const $tile = document.getElementById(`box-${index}`);
        $tile.innerText = api.getCurrentPlayerLabel();
    }
    onDraw() {
        const scene = this.scene;
        scene.renderAnnouncements(`It's a draw!`);
    }
    onFinish() {
    }
    onInit() {
    }
    onStart() {
        const scene = this.scene;
        const api = this;
        scene.renderCanvas();
        scene.renderStartButton();
        scene.$canvas.addEventListener('click', (e) => {
            const $tile = e.target;
            // Prevent propagating click callback if:
            // 1. the DOM element clicked is not a "box".
            // 2. the "box" already has a value in it.
            // 3. A player already won the game.
            if ($tile.className !== "box") {
                return false;
            }
            const index = parseInt($tile.dataset.index, 10);
            // const row = parseInt($tile.dataset.row as string, 10);
            // const column = parseInt($tile.dataset.column as string, 10);
            api.selectTile(index);
        });
        scene.$startBtn.addEventListener('click', () => {
            api.resetState();
            scene.reset();
        });
    }
    onWin() {
        const scene = this.scene;
        const api = this;
        api.state.winningTiles.forEach((tileArr) => {
            scene.renderTileRed(tileArr);
        });
        scene.renderAnnouncements(`${api.state.winner} has won!`);
    }
}
exports.default = GameImpl;


/***/ }),

/***/ "./src/dom/Scene.ts":
/*!**************************!*\
  !*** ./src/dom/Scene.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Game_1 = __webpack_require__(/*! ../Game */ "./src/Game.ts");
class Scene {
    renderStartButton() {
        const elem = document.createElement("button");
        elem.style.display = "absolute";
        elem.innerText = "Re-start game";
        elem.style.marginTop = "1em";
        elem.style.userSelect = "none";
        elem.style.cursor = "pointer";
        this.$startBtn = elem;
        this.$canvas.appendChild(this.$startBtn);
    }
    renderAnnouncements(text) {
        const elem = document.createElement("div");
        elem.style.display = "absolute";
        elem.style.padding = "1em";
        elem.style.fontStyle = "italics";
        elem.innerText = text;
        this.$announcements = elem;
        this.$canvas.appendChild(this.$announcements);
    }
    removeAnnouncements() {
        return this.$announcements && this.$announcements.remove();
    }
    renderCanvas() {
        this.$canvas = document.createElement("div");
        this.$canvas.style.boxSizing = "border-box";
        this.$canvas.style.textAlign = "center";
        this.$canvas.style.position = "relative";
        this.$canvas.id = "canvas";
        this.$canvas.style.width = `${Game_1.default.BOARD_BOX_SIZE * Game_1.default.BOARD_SIZE}px`;
        this.$canvas.style.height = `${Game_1.default.BOARD_BOX_SIZE * Game_1.default.BOARD_SIZE}px`;
        for (let i = 0; i < Game_1.default.BOARD_SIZE * Game_1.default.BOARD_SIZE; i++) {
            const $box = document.createElement("div");
            $box.style.float = "left";
            $box.style.width = `${Game_1.default.BOARD_BOX_SIZE}px`;
            $box.style.height = `${Game_1.default.BOARD_BOX_SIZE}px`;
            $box.style.lineHeight = `${Game_1.default.BOARD_BOX_SIZE}px`;
            $box.style.border = "1px solid black";
            $box.style.boxShadow = "0 0 0 1px black";
            $box.style.boxSizing = "border-box";
            $box.style.fontSize = `${Game_1.default.BOARD_BOX_SIZE / 2}px`;
            $box.style.cursor = "pointer";
            $box.style.userSelect = "none";
            $box.id = `box-${i}`;
            $box.dataset.index = `${i}`;
            $box.dataset.row = `${Math.floor(i / Game_1.default.BOARD_SIZE)}`;
            $box.dataset.column = `${i % Game_1.default.BOARD_SIZE}`;
            $box.className = "box";
            this.$canvas.appendChild($box);
        }
        document.body.appendChild(this.$canvas);
    }
    renderTileRed(tileArr) {
        document.querySelector(`[data-row="${tileArr[0]}"][data-column="${tileArr[1]}"]`).style.backgroundColor = "red";
    }
    reset() {
        this.removeAnnouncements();
        this.$canvas.querySelectorAll(".box").forEach(($box) => {
            $box.innerText = "";
            $box.style.backgroundColor = "";
        });
    }
}
exports.default = Scene;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const GameImpl_1 = __webpack_require__(/*! ./dom/GameImpl */ "./src/dom/GameImpl.ts");
const Scene_1 = __webpack_require__(/*! ./dom/Scene */ "./src/dom/Scene.ts");
const xo = new GameImpl_1.default(new Scene_1.default());
xo.start();
window["xo"] = {
    selectTile: xo.selectTile.bind(xo),
    state: xo.state,
};


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.randomInt = exports.unique = void 0;
// Returns only the unique values of an array.
// eg. input [1,1,1] returns [1]
// eg. input [1,2,1] returns [1,2]
function unique(arr) {
    return arr.reduce((acc, currentValue) => {
        if (!acc.includes(currentValue)) {
            acc.push(currentValue);
        }
        return acc;
    }, []);
}
exports.unique = unique;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomInt = randomInt;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly94by8uL3NyYy9HYW1lLnRzIiwid2VicGFjazovL3hvLy4vc3JjL2RvbS9HYW1lSW1wbC50cyIsIndlYnBhY2s6Ly94by8uL3NyYy9kb20vU2NlbmUudHMiLCJ3ZWJwYWNrOi8veG8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8veG8vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8veG8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8veG8vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxxRUFBK0I7QUFFL0IsSUFBWSxNQUlYO0FBSkQsV0FBWSxNQUFNO0lBQ2QsbUNBQVE7SUFDUiw2QkFBSztJQUNMLDZCQUFLO0FBQ1QsQ0FBQyxFQUpXLE1BQU0sR0FBTixjQUFNLEtBQU4sY0FBTSxRQUlqQjtBQUVELElBQVksVUFJWDtBQUpELFdBQVksVUFBVTtJQUNsQixpREFBVztJQUNYLHlDQUFPO0lBQ1AsMkNBQVE7QUFDWixDQUFDLEVBSlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUFJckI7QUFZRCxNQUE4QixJQUFJO0lBQWxDO1FBVUksY0FBYztRQUNQLFVBQUssR0FBYztZQUN0QixXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUM5QixrQkFBa0IsRUFBRSxFQUFFO1lBQ3RCLG1CQUFtQixFQUFFO2dCQUNqQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNkLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7YUFDakI7WUFDRCxNQUFNLEVBQUUsRUFBRTtZQUNWLFlBQVksRUFBRSxFQUFFO1lBQ2hCLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QixNQUFNLEVBQUUsVUFBVSxDQUFDLE9BQU87U0FDN0I7SUE4SkwsQ0FBQztJQXBKVyxNQUFNLENBQUMsVUFBVTtRQUNyQixPQUFPLElBQUksQ0FBQyxZQUFZLENB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VUFDQTtVQUNBOzs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt1bmlxdWV9IGZyb20gXCIuL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZW51bSBQbGF5ZXIge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBYID0gMSxcclxuICAgIE8gPSAyXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdhbWVSZXN1bHQge1xyXG4gICAgUExBWUlORyA9IDAsXHJcbiAgICBXSU4gPSAxLFxyXG4gICAgRFJBVyA9IDJcclxufVxyXG5cclxuaW50ZXJmYWNlIEdhbWVTdGF0ZSB7XHJcbiAgICBib2FyZE1hdHJpeDogdHlwZW9mIEdhbWUuQk9BUkRfTUFUUklYLFxyXG4gICAgcm91bmRNb3Zlc1BlckluZGV4OiBudW1iZXJbXTtcclxuICAgIHJvdW5kTW92ZXNQZXJQbGF5ZXI6IHtbUGxheWVyLlhdOiBbXSwgW1BsYXllci5PXTogW119O1xyXG4gICAgd2lubmVyOiBzdHJpbmc7XHJcbiAgICB3aW5uaW5nVGlsZXM6IG51bWJlcltdW107XHJcbiAgICBjdXJyZW50UGxheWVyOiBQbGF5ZXI7XHJcbiAgICByZXN1bHQ6IEdhbWVSZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEdhbWUge1xyXG4gICAgLy8gU2V0dGluZ3MuXHJcbiAgICBwdWJsaWMgc3RhdGljIEJPQVJEX1NJWkU6IG51bWJlciA9IDM7XHJcbiAgICBwdWJsaWMgc3RhdGljIEJPQVJEX0JPWF9TSVpFOiBudW1iZXIgPSAxMDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIEJPQVJEX01BVFJJWDogbnVtYmVyW11bXSA9IFtcclxuICAgICAgICBbMCwgMCwgMF0sXHJcbiAgICAgICAgWzAsIDAsIDBdLFxyXG4gICAgICAgIFswLCAwLCAwXVxyXG4gICAgXTtcclxuXHJcbiAgICAvLyBHYW1lIHN0YXRlLlxyXG4gICAgcHVibGljIHN0YXRlOiBHYW1lU3RhdGUgPSB7XHJcbiAgICAgICAgYm9hcmRNYXRyaXg6IEdhbWUuY2xvbmVCb2FyZCgpLFxyXG4gICAgICAgIHJvdW5kTW92ZXNQZXJJbmRleDogW10sXHJcbiAgICAgICAgcm91bmRNb3Zlc1BlclBsYXllcjoge1xyXG4gICAgICAgICAgICBbUGxheWVyLlhdOiBbXSxcclxuICAgICAgICAgICAgW1BsYXllci5PXTogW11cclxuICAgICAgICB9LFxyXG4gICAgICAgIHdpbm5lcjogXCJcIixcclxuICAgICAgICB3aW5uaW5nVGlsZXM6IFtdLFxyXG4gICAgICAgIGN1cnJlbnRQbGF5ZXI6IFBsYXllci5YLFxyXG4gICAgICAgIHJlc3VsdDogR2FtZVJlc3VsdC5QTEFZSU5HXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IG9uSW5pdCgpOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IG9uU3RhcnQoKTogdm9pZDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBvbkJlZm9yZVNlbGVjdFRpbGUoaW5kZXgsIHJvdywgY29sdW1uKTogdm9pZDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBvbkFmdGVyU2VsZWN0VGlsZShpbmRleCwgcm93LCBjb2x1bW4pOiB2b2lkO1xyXG4gICAgcHVibGljIGFic3RyYWN0IG9uRmluaXNoKCk6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgb25XaW4oKTogdm9pZDtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBvbkRyYXcoKTogdm9pZDtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjbG9uZUJvYXJkKCkge1xyXG4gICAgICAgIHJldHVybiBHYW1lLkJPQVJEX01BVFJJWC5zbGljZSgwKS5tYXAoKHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gcm93LnNsaWNlKDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Um93KHRpbGVJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aWxlSW5kZXggLyBHYW1lLkJPQVJEX1NJWkUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q29sdW1uKHRpbGVJbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGlsZUluZGV4ICUgR2FtZS5CT0FSRF9TSVpFO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RUaWxlKGluZGV4OiBudW1iZXIsIHJvdz86IG51bWJlciwgY29sdW1uPzogbnVtYmVyKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXggIT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+ICgoR2FtZS5CT0FSRF9TSVpFICogR2FtZS5CT0FSRF9TSVpFKSAtIDEpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygcm93ID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJvdyA9IHRoaXMuZ2V0Um93KGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY29sdW1uID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIGNvbHVtbiA9IHRoaXMuZ2V0Q29sdW1uKGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRpbGUgaXMgYWxyZWFkeSBvY2N1cGllZC5cclxuICAgICAgICAvLyBDaGVjayBpZiBnYW1lIGhhcyBmaW5pc2hlZC5cclxuICAgICAgICAvLyBJZiBhbnkgb2YgdGhlIGFib3ZlIGFyZSB0cnVlLCB0aGVuIHN0b3AgcHJvY2Vzc2luZyBcImNsaWNrc1wiIG9uIHRpbGVzLlxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmJvYXJkTWF0cml4W3Jvd11bY29sdW1uXSAhPT0gUGxheWVyLk5PTkUgfHwgdGhpcy5zdGF0ZS5yZXN1bHQgIT09IEdhbWVSZXN1bHQuUExBWUlORykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9uQmVmb3JlU2VsZWN0VGlsZShpbmRleCwgcm93LCBjb2x1bW4pO1xyXG5cclxuICAgICAgICAvLyBTdG9yZSByb3VuZCBtb3Zlcy5cclxuICAgICAgICB0aGlzLnN0YXRlLnJvdW5kTW92ZXNQZXJQbGF5ZXJbdGhpcy5zdGF0ZS5jdXJyZW50UGxheWVyXS5wdXNoKGluZGV4KTtcclxuICAgICAgICB0aGlzLnN0YXRlLnJvdW5kTW92ZXNQZXJJbmRleC5wdXNoKGluZGV4KTtcclxuICAgICAgICB0aGlzLnN0YXRlLmJvYXJkTWF0cml4W3Jvd11bY29sdW1uXSA9IHRoaXMuc3RhdGUuY3VycmVudFBsYXllcjtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jaGVja0dhbWVSZXN1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKFtHYW1lUmVzdWx0LldJTiwgR2FtZVJlc3VsdC5EUkFXXS5pbmNsdWRlcyhyZXN1bHQpKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IEdhbWVSZXN1bHQuV0lOKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uV2luKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBHYW1lUmVzdWx0LkRSQVcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25EcmF3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vbkZpbmlzaCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFN3aXRjaCB0byB0aGUgbmV4dCBwbGF5ZXIuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudFBsYXllciA9PT0gUGxheWVyLlgpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50UGxheWVyID0gUGxheWVyLk87XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50UGxheWVyID0gUGxheWVyLlg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9uQWZ0ZXJTZWxlY3RUaWxlKGluZGV4LCByb3csIGNvbHVtbik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWV0aG9kb2xvZ3k6IGJydXRlIGNoZWNrIGFsbCByb3dzIGFuZCBjb2x1bW5zIGFuZCBkaWFnb25hbHMuXHJcbiAgICBwcml2YXRlIGNoZWNrR2FtZVJlc3VsdCgpOiBHYW1lUmVzdWx0IHtcclxuXHJcbiAgICAgICAgLy8gRG9uJ3QgcGVyZm9ybSB3aW5uaW5nIGNoZWNrIHVudGlsIGF0IGxlYXN0IDUgbW92ZXMuXHJcbiAgICAgICAgLy8gNSBtb3ZlcyBtZWFuIHRoYXQgWCBoYXMgbW92ZWQgMyB0aW1lcyBhbmQgTyBvbmx5IDIgdGltZXMuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucm91bmRNb3Zlc1BlckluZGV4Lmxlbmd0aCA8ICgoR2FtZS5CT0FSRF9TSVpFICogMikgLSAxKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gR2FtZVJlc3VsdC5QTEFZSU5HO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHYW1lLkJPQVJEX1NJWkU7IGkrKykge1xyXG4gICAgICAgICAgICAvLyBDaGVjayByb3dzLlxyXG4gICAgICAgICAgICBjb25zdCByb3dzID0gdW5pcXVlKHRoaXMuc3RhdGUuYm9hcmRNYXRyaXhbaV0pO1xyXG4gICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDEgJiYgcm93c1swXSAhPT0gUGxheWVyLk5PTkUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2lubmVyID0gdGhpcy5nZXRDdXJyZW50UGxheWVyTGFiZWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUud2lubmluZ1RpbGVzID0gW1tpLCAwXSwgW2ksIDFdLCBbaSwgMl1dO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgPSBHYW1lUmVzdWx0LldJTjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBHYW1lUmVzdWx0LldJTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBDaGVjayBjb2x1bW5zLlxyXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gdW5pcXVlKFt0aGlzLnN0YXRlLmJvYXJkTWF0cml4WzBdW2ldLCB0aGlzLnN0YXRlLmJvYXJkTWF0cml4WzFdW2ldLCB0aGlzLnN0YXRlLmJvYXJkTWF0cml4WzJdW2ldXSk7XHJcbiAgICAgICAgICAgIGlmIChjb2x1bW5zLmxlbmd0aCA9PT0gMSAmJiBjb2x1bW5zWzBdICE9PSBQbGF5ZXIuTk9ORSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS53aW5uZXIgPSB0aGlzLmdldEN1cnJlbnRQbGF5ZXJMYWJlbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS53aW5uaW5nVGlsZXMgPSBbWzAsIGldLCBbMSwgaV0sIFsyLCBpXV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdCA9IEdhbWVSZXN1bHQuV0lOO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEdhbWVSZXN1bHQuV0lOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDaGVjayBkaWFncy5cclxuICAgICAgICBjb25zdCBkaWFnMSA9IHVuaXF1ZShbdGhpcy5zdGF0ZS5ib2FyZE1hdHJpeFswXVswXSwgdGhpcy5zdGF0ZS5ib2FyZE1hdHJpeFsxXVsxXSwgdGhpcy5zdGF0ZS5ib2FyZE1hdHJpeFsyXVsyXV0pO1xyXG4gICAgICAgIGlmIChkaWFnMS5sZW5ndGggPT09IDEgJiYgZGlhZzFbMF0gIT09IFBsYXllci5OT05FKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUud2lubmVyID0gdGhpcy5nZXRDdXJyZW50UGxheWVyTGFiZWwoKTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS53aW5uaW5nVGlsZXMgPSBbWzAsIDBdLCBbMSwgMV0sIFsyLCAyXV07XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVzdWx0ID0gR2FtZVJlc3VsdC5XSU47XHJcbiAgICAgICAgICAgIHJldHVybiBHYW1lUmVzdWx0LldJTjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRpYWcyID0gdW5pcXVlKFt0aGlzLnN0YXRlLmJvYXJkTWF0cml4WzBdWzJdLCB0aGlzLnN0YXRlLmJvYXJkTWF0cml4WzFdWzFdLCB0aGlzLnN0YXRlLmJvYXJkTWF0cml4WzJdWzBdXSk7XHJcbiAgICAgICAgaWYgKGRpYWcyLmxlbmd0aCA9PT0gMSAmJiBkaWFnMlswXSAhPT0gUGxheWVyLk5PTkUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS53aW5uZXIgPSB0aGlzLmdldEN1cnJlbnRQbGF5ZXJMYWJlbCgpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLndpbm5pbmdUaWxlcyA9IFtbMCwgMl0sIFsxLCAxXSwgWzIsIDBdXTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHQgPSBHYW1lUmVzdWx0LldJTjtcclxuICAgICAgICAgICAgcmV0dXJuIEdhbWVSZXN1bHQuV0lOO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucm91bmRNb3Zlc1BlckluZGV4Lmxlbmd0aCA9PT0gR2FtZS5CT0FSRF9TSVpFICogR2FtZS5CT0FSRF9TSVpFKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUucmVzdWx0ID0gR2FtZVJlc3VsdC5EUkFXO1xyXG4gICAgICAgICAgICByZXR1cm4gR2FtZVJlc3VsdC5EUkFXO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIEdhbWVSZXN1bHQuUExBWUlORztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0Q3VycmVudFBsYXllckxhYmVsKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuY3VycmVudFBsYXllciA9PT0gUGxheWVyLlggPyBcIlhcIiA6IFwiT1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnJlc2V0U3RhdGUoKTtcclxuICAgICAgICB0aGlzLm9uU3RhcnQoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2V0U3RhdGUoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgd2lubmVyOiBcIlwiLFxyXG4gICAgICAgICAgICB3aW5uaW5nVGlsZXM6IFtdLFxyXG4gICAgICAgICAgICByb3VuZE1vdmVzUGVySW5kZXg6IFtdLFxyXG4gICAgICAgICAgICByb3VuZE1vdmVzUGVyUGxheWVyOiB7XHJcbiAgICAgICAgICAgICAgICBbUGxheWVyLlhdOiBbXSxcclxuICAgICAgICAgICAgICAgIFtQbGF5ZXIuT106IFtdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGN1cnJlbnRQbGF5ZXI6IFBsYXllci5YLFxyXG4gICAgICAgICAgICBib2FyZE1hdHJpeDogR2FtZS5jbG9uZUJvYXJkKCksXHJcbiAgICAgICAgICAgIHJlc3VsdDogR2FtZVJlc3VsdC5QTEFZSU5HXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG59IiwiaW1wb3J0IEdhbWUsIHtQbGF5ZXJ9IGZyb20gXCIuLi9HYW1lXCI7XHJcbmltcG9ydCBTY2VuZSBmcm9tIFwiLi9TY2VuZVwiO1xyXG5pbXBvcnQge3JhbmRvbUludH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lSW1wbCBleHRlbmRzIEdhbWUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgc2NlbmU6IFNjZW5lKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm9uSW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQWZ0ZXJTZWxlY3RUaWxlKGluZGV4LCByb3csIGNvbHVtbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIEFJIChyYW5kb20sIGR1bWIpXHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBhcGkuc3RhdGU7XHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gYXBpLmdldEN1cnJlbnRQbGF5ZXJMYWJlbCgpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgSXQncyAke3BsYXllcn0ncyB0dXJuYCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEJvYXJkIGxvb2tzIGxpa2UgdGhpc2AsIHN0YXRlLmJvYXJkTWF0cml4KTtcclxuXHJcbiAgICAgICAgLy8gUmFuZG9tIEFJIGltcGxlbWVudGF0aW9uLlxyXG4gICAgICAgIGlmIChzdGF0ZS5jdXJyZW50UGxheWVyID09PSBQbGF5ZXIuTykge1xyXG4gICAgICAgICAgICBjb25zdCBmcmVlQm9hcmRUaWxlc0J5SW5kZXggPSBzdGF0ZS5ib2FyZE1hdHJpeC5yZWR1Y2UoKGFjYywgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2MuY29uY2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgfSwgW10pLnJlZHVjZSgoYWNjMiwgdmFsdWUyLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlMiA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIChhY2MyIGFzIG51bWJlcltdKS5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2MyO1xyXG4gICAgICAgICAgICB9LCBbXSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRnJlZSBib2FyZCB0aWxlczpcIiwgZnJlZUJvYXJkVGlsZXNCeUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gcmFuZG9tSW50KDAsIGZyZWVCb2FyZFRpbGVzQnlJbmRleC5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgY29uc3QgdGlsZUluZGV4ID0gZnJlZUJvYXJkVGlsZXNCeUluZGV4W3JhbmRvbUluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIC8vIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjYm94LSR7dGlsZUluZGV4fWApIGFzIEhUTUxFbGVtZW50KS5jbGljaygpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFRpbGUodGlsZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25CZWZvcmVTZWxlY3RUaWxlKGluZGV4LCByb3csIGNvbHVtbik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGFwaSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnN0ICR0aWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGJveC0ke2luZGV4fWApIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICR0aWxlLmlubmVyVGV4dCA9IGFwaS5nZXRDdXJyZW50UGxheWVyTGFiZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRyYXcoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmUgPSB0aGlzLnNjZW5lO1xyXG5cclxuICAgICAgICBzY2VuZS5yZW5kZXJBbm5vdW5jZW1lbnRzKGBJdCdzIGEgZHJhdyFgKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkZpbmlzaCgpOiB2b2lkIHtcclxuICAgIH1cclxuXHJcbiAgICBvbkluaXQoKTogdm9pZCB7XHJcbiAgICB9XHJcblxyXG4gICAgb25TdGFydCgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBzY2VuZSA9IHRoaXMuc2NlbmU7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcztcclxuXHJcbiAgICAgICAgc2NlbmUucmVuZGVyQ2FudmFzKCk7XHJcbiAgICAgICAgc2NlbmUucmVuZGVyU3RhcnRCdXR0b24oKTtcclxuXHJcbiAgICAgICAgc2NlbmUuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICR0aWxlID0gZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIC8vIFByZXZlbnQgcHJvcGFnYXRpbmcgY2xpY2sgY2FsbGJhY2sgaWY6XHJcbiAgICAgICAgICAgIC8vIDEuIHRoZSBET00gZWxlbWVudCBjbGlja2VkIGlzIG5vdCBhIFwiYm94XCIuXHJcbiAgICAgICAgICAgIC8vIDIuIHRoZSBcImJveFwiIGFscmVhZHkgaGFzIGEgdmFsdWUgaW4gaXQuXHJcbiAgICAgICAgICAgIC8vIDMuIEEgcGxheWVyIGFscmVhZHkgd29uIHRoZSBnYW1lLlxyXG4gICAgICAgICAgICBpZiAoJHRpbGUuY2xhc3NOYW1lICE9PSBcImJveFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoJHRpbGUuZGF0YXNldC5pbmRleCBhcyBzdHJpbmcsIDEwKTtcclxuICAgICAgICAgICAgLy8gY29uc3Qgcm93ID0gcGFyc2VJbnQoJHRpbGUuZGF0YXNldC5yb3cgYXMgc3RyaW5nLCAxMCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGNvbHVtbiA9IHBhcnNlSW50KCR0aWxlLmRhdGFzZXQuY29sdW1uIGFzIHN0cmluZywgMTApO1xyXG5cclxuICAgICAgICAgICAgYXBpLnNlbGVjdFRpbGUoaW5kZXgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNjZW5lLiRzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgYXBpLnJlc2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgc2NlbmUucmVzZXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbldpbigpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBzY2VuZSA9IHRoaXMuc2NlbmU7XHJcbiAgICAgICAgY29uc3QgYXBpID0gdGhpcztcclxuXHJcbiAgICAgICAgYXBpLnN0YXRlLndpbm5pbmdUaWxlcy5mb3JFYWNoKCh0aWxlQXJyKSA9PiB7XHJcbiAgICAgICAgICAgIHNjZW5lLnJlbmRlclRpbGVSZWQodGlsZUFycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2NlbmUucmVuZGVyQW5ub3VuY2VtZW50cyhgJHthcGkuc3RhdGUud2lubmVyfSBoYXMgd29uIWApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59IiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4uL0dhbWVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lIHtcclxuXHJcbiAgICAvLyBUaGUgc2NlbmUuIERPTSByZWZlcmVuY2UuXHJcbiAgICBwdWJsaWMgJGNhbnZhcztcclxuICAgIHB1YmxpYyAkc3RhcnRCdG47XHJcbiAgICBwdWJsaWMgJGFubm91bmNlbWVudHM7XHJcblxyXG4gICAgcHVibGljIHJlbmRlclN0YXJ0QnV0dG9uKCkge1xyXG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBlbGVtLmlubmVyVGV4dCA9IFwiUmUtc3RhcnQgZ2FtZVwiO1xyXG4gICAgICAgIGVsZW0uc3R5bGUubWFyZ2luVG9wID0gXCIxZW1cIjtcclxuICAgICAgICBlbGVtLnN0eWxlLnVzZXJTZWxlY3QgPSBcIm5vbmVcIjtcclxuICAgICAgICBlbGVtLnN0eWxlLmN1cnNvciA9IFwicG9pbnRlclwiO1xyXG5cclxuICAgICAgICB0aGlzLiRzdGFydEJ0biA9IGVsZW07XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLmFwcGVuZENoaWxkKHRoaXMuJHN0YXJ0QnRuKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyQW5ub3VuY2VtZW50cyh0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgZWxlbS5zdHlsZS5wYWRkaW5nID0gXCIxZW1cIjtcclxuICAgICAgICBlbGVtLnN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljc1wiO1xyXG4gICAgICAgIGVsZW0uaW5uZXJUZXh0ID0gdGV4dDtcclxuXHJcbiAgICAgICAgdGhpcy4kYW5ub3VuY2VtZW50cyA9IGVsZW07XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLmFwcGVuZENoaWxkKHRoaXMuJGFubm91bmNlbWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVBbm5vdW5jZW1lbnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRhbm5vdW5jZW1lbnRzICYmIHRoaXMuJGFubm91bmNlbWVudHMucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlckNhbnZhcygpIHtcclxuXHJcbiAgICAgICAgdGhpcy4kY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLiRjYW52YXMuc3R5bGUuYm94U2l6aW5nID0gXCJib3JkZXItYm94XCI7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5pZCA9IFwiY2FudmFzXCI7XHJcblxyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5zdHlsZS53aWR0aCA9IGAke0dhbWUuQk9BUkRfQk9YX1NJWkUgKiBHYW1lLkJPQVJEX1NJWkV9cHhgO1xyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHtHYW1lLkJPQVJEX0JPWF9TSVpFICogR2FtZS5CT0FSRF9TSVpFfXB4YDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBHYW1lLkJPQVJEX1NJWkUgKiBHYW1lLkJPQVJEX1NJWkU7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCAkYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgJGJveC5zdHlsZS5mbG9hdCA9IFwibGVmdFwiO1xyXG4gICAgICAgICAgICAkYm94LnN0eWxlLndpZHRoID0gYCR7R2FtZS5CT0FSRF9CT1hfU0laRX1weGA7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuaGVpZ2h0ID0gYCR7R2FtZS5CT0FSRF9CT1hfU0laRX1weGA7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUubGluZUhlaWdodCA9IGAke0dhbWUuQk9BUkRfQk9YX1NJWkV9cHhgO1xyXG4gICAgICAgICAgICAkYm94LnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkIGJsYWNrXCI7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuYm94U2hhZG93ID0gXCIwIDAgMCAxcHggYmxhY2tcIjtcclxuICAgICAgICAgICAgJGJveC5zdHlsZS5ib3hTaXppbmcgPSBcImJvcmRlci1ib3hcIjtcclxuICAgICAgICAgICAgJGJveC5zdHlsZS5mb250U2l6ZSA9IGAke0dhbWUuQk9BUkRfQk9YX1NJWkUgLyAyIH1weGA7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuY3Vyc29yID0gXCJwb2ludGVyXCI7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUudXNlclNlbGVjdCA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAkYm94LmlkID0gYGJveC0ke2l9YDtcclxuICAgICAgICAgICAgJGJveC5kYXRhc2V0LmluZGV4ID0gYCR7aX1gO1xyXG4gICAgICAgICAgICAkYm94LmRhdGFzZXQucm93ID0gYCR7TWF0aC5mbG9vcihpIC8gR2FtZS5CT0FSRF9TSVpFKX1gO1xyXG4gICAgICAgICAgICAkYm94LmRhdGFzZXQuY29sdW1uID0gYCR7aSAlIEdhbWUuQk9BUkRfU0laRX1gO1xyXG4gICAgICAgICAgICAkYm94LmNsYXNzTmFtZSA9IFwiYm94XCI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRjYW52YXMuYXBwZW5kQ2hpbGQoJGJveCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuJGNhbnZhcyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJUaWxlUmVkKHRpbGVBcnIpOiB2b2lkIHtcclxuICAgICAgICAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtcm93PVwiJHt0aWxlQXJyWzBdfVwiXVtkYXRhLWNvbHVtbj1cIiR7dGlsZUFyclsxXX1cIl1gKSBhcyBIVE1MRWxlbWVudCkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbm5vdW5jZW1lbnRzKCk7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm94XCIpLmZvckVhY2goKCRib3gpID0+IHtcclxuICAgICAgICAgICAgJGJveC5pbm5lclRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAkYm94LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiXCI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZUltcGwgZnJvbSBcIi4vZG9tL0dhbWVJbXBsXCI7XHJcbmltcG9ydCBTY2VuZSBmcm9tIFwiLi9kb20vU2NlbmVcIjtcclxuXHJcbmNvbnN0IHhvID0gbmV3IEdhbWVJbXBsKG5ldyBTY2VuZSgpKTtcclxueG8uc3RhcnQoKTtcclxuXHJcbndpbmRvd1tcInhvXCJdID0ge1xyXG4gICAgc2VsZWN0VGlsZTogeG8uc2VsZWN0VGlsZS5iaW5kKHhvKSxcclxuICAgIHN0YXRlOiB4by5zdGF0ZSxcclxufTsiLCIvLyBSZXR1cm5zIG9ubHkgdGhlIHVuaXF1ZSB2YWx1ZXMgb2YgYW4gYXJyYXkuXHJcbi8vIGVnLiBpbnB1dCBbMSwxLDFdIHJldHVybnMgWzFdXHJcbi8vIGVnLiBpbnB1dCBbMSwyLDFdIHJldHVybnMgWzEsMl1cclxuZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZShhcnI6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgcmV0dXJuIGFyci5yZWR1Y2UoKGFjYzogbnVtYmVyW10sIGN1cnJlbnRWYWx1ZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgaWYgKCFhY2MuaW5jbHVkZXMoY3VycmVudFZhbHVlKSkgeyBhY2MucHVzaChjdXJyZW50VmFsdWUpOyB9XHJcbiAgICAgICAgcmV0dXJuIGFjYztcclxuICAgIH0sIFtdKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbUludChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9