/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Game.ts":
/*!*********************!*\
  !*** ./src/Game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Player;
(function (Player) {
    Player[Player["X"] = 1] = "X";
    Player[Player["O"] = 2] = "O";
})(Player || (Player = {}));
class Game {
    constructor() {
        this.boxSize = 100;
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.roundMoves = {
            [Player.X]: [],
            [Player.O]: []
        };
        this.winner = "";
        this.nextPlayer = Player.X;
    }
    drawCanvas() {
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
            $box.className = "box";
            this.$canvas.appendChild($box);
        }
        document.body.appendChild(this.$canvas);
    }
    bindEvents() {
        this.$canvas.addEventListener('click', (e) => {
            const $box = e.target;
            if ($box.className !== "box") {
                return false;
            }
            const boxIndex = $box.dataset.index;
            this.roundMoves[this.nextPlayer].push(boxIndex);
            console.log(this.roundMoves);
            $box.innerText = this.nextPlayer;
            if (this.nextPlayer === Player.X) {
                this.nextPlayer = Player.O;
            }
            else {
                this.nextPlayer = Player.X;
            }
            const winCheck = this.checkWinningCondition();
            if (winCheck) {
                console.log(`${winCheck} has won!`);
            }
        });
    }
    checkWinningCondition() {
        return false;
    }
    start() {
        this.drawCanvas();
        this.bindEvents();
    }
}
exports["default"] = Game;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Game_1 = __webpack_require__(/*! ./Game */ "./src/Game.ts");
new Game_1.default().start();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksY0FBSSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly94by8uL3NyYy9HYW1lLnRzIiwid2VicGFjazovL3hvL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3hvLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImVudW0gUGxheWVyIHtcclxuICAgIFggPSAxLFxyXG4gICAgTyA9IDJcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XHJcbiAgICBwcml2YXRlIGJveFNpemU6IG51bWJlciA9IDEwMDtcclxuICAgIHByaXZhdGUgYm9hcmQ6IG51bWJlcltdW10gPSBbXHJcbiAgICAgICAgWzAsIDAsIDBdLFxyXG4gICAgICAgIFswLCAwLCAwXSxcclxuICAgICAgICBbMCwgMCwgMF1cclxuICAgIF07XHJcbiAgICBwcml2YXRlIHJvdW5kTW92ZXM6IHtba2V5IGluIFBsYXllcl06IG51bWJlcltdfSA9IHtcclxuICAgICAgICBbUGxheWVyLlhdOiBbXSxcclxuICAgICAgICBbUGxheWVyLk9dOiBbXVxyXG4gICAgfTtcclxuICAgIHByaXZhdGUgd2lubmVyID0gXCJcIjtcclxuICAgIHByaXZhdGUgbmV4dFBsYXllciA9IFBsYXllci5YO1xyXG5cclxuICAgIHByaXZhdGUgJGNhbnZhcztcclxuXHJcblxyXG4gICAgcHVibGljIGRyYXdDYW52YXMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLmJveFNpemluZyA9IFwiYm9yZGVyLWJveFwiO1xyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5zdHlsZS50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5pZCA9IFwiY2FudmFzXCI7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLndpZHRoID0gYCR7dGhpcy5ib3hTaXplICogM31weGA7XHJcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3RoaXMuYm94U2l6ZSAqIDN9cHhgO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDMgKiAzOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgJGJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuZmxvYXQgPSBcImxlZnRcIjtcclxuICAgICAgICAgICAgJGJveC5zdHlsZS53aWR0aCA9IGAke3RoaXMuYm94U2l6ZX1weGA7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5ib3hTaXplfXB4YDtcclxuICAgICAgICAgICAgJGJveC5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCBibGFja1wiO1xyXG4gICAgICAgICAgICAkYm94LnN0eWxlLmJveFNoYWRvdyA9IFwiMCAwIDAgMXB4IGJsYWNrXCI7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuYm94U2l6aW5nID0gXCJib3JkZXItYm94XCI7XHJcbiAgICAgICAgICAgICRib3guc3R5bGUuZm9udFNpemUgPSBcIjUwcHhcIjtcclxuICAgICAgICAgICAgJGJveC5pZCA9IGBib3gtJHtpfWA7XHJcbiAgICAgICAgICAgICRib3guZGF0YXNldC5pbmRleCA9IGAke2l9YDtcclxuICAgICAgICAgICAgJGJveC5jbGFzc05hbWUgPSBcImJveFwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kY2FudmFzLmFwcGVuZENoaWxkKCRib3gpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLiRjYW52YXMpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudHMoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRib3ggPSBlLnRhcmdldDtcclxuICAgICAgICAgICAgaWYgKCRib3guY2xhc3NOYW1lICE9PSBcImJveFwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJveEluZGV4ID0gJGJveC5kYXRhc2V0LmluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnJvdW5kTW92ZXNbdGhpcy5uZXh0UGxheWVyXS5wdXNoKGJveEluZGV4KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5yb3VuZE1vdmVzKTtcclxuXHJcbiAgICAgICAgICAgICRib3guaW5uZXJUZXh0ID0gdGhpcy5uZXh0UGxheWVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubmV4dFBsYXllciA9PT0gUGxheWVyLlgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dFBsYXllciA9IFBsYXllci5PO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0UGxheWVyID0gUGxheWVyLlg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHdpbkNoZWNrID0gdGhpcy5jaGVja1dpbm5pbmdDb25kaXRpb24oKTtcclxuICAgICAgICAgICAgaWYgKHdpbkNoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt3aW5DaGVja30gaGFzIHdvbiFgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrV2lubmluZ0NvbmRpdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZHJhd0NhbnZhcygpO1xyXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCBHYW1lIGZyb20gXCIuL0dhbWVcIjtcclxuXHJcbm5ldyBHYW1lKCkuc3RhcnQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=