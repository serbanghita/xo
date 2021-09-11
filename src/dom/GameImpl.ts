import Game, {Player} from "../Game";
import Scene from "./Scene";
import {randomInt} from "../utils";

export default class GameImpl extends Game {

    constructor(private readonly scene: Scene) {
        super();
        this.onInit();
    }

    onAfterSelectTile(index, row, column): void {
        const api = this;

        // AI (random, dumb)
        const state = api.state;
        const player = api.getCurrentPlayerLabel();

        console.log(`It's ${player}'s turn`);
        console.log(`Board looks like this`, state.boardMatrix);

        // Random AI implementation.
        if (state.currentPlayer === Player.O) {
            const freeBoardTilesByIndex = state.boardMatrix.reduce((acc, value) => {
                return acc.concat(value);
            }, []).reduce((acc2, value2, index) => {
                if (value2 > 0) {
                    return acc2;
                }
                (acc2 as number[]).push(index);
                return acc2;
            }, []);
            console.log("Free board tiles:", freeBoardTilesByIndex);

            const randomIndex = randomInt(0, freeBoardTilesByIndex.length - 1);
            const tileIndex = freeBoardTilesByIndex[randomIndex];

            // (document.querySelector(`#box-${tileIndex}`) as HTMLElement).click();
            this.selectTile(tileIndex);
        }
    }

    onBeforeSelectTile(index, row, column): void {
        const api = this;

        const $tile = document.getElementById(`box-${index}`) as HTMLElement;
        $tile.innerText = api.getCurrentPlayerLabel();
    }

    onDraw(): void {
        const scene = this.scene;

        scene.renderAnnouncements(`It's a draw!`);
    }

    onFinish(): void {
        // @todo: Prevent DOM events from leaking.
    }

    onInit(): void {
    }

    onStart(): void {
        // @todo: Is this code better in init?
        const scene = this.scene;
        const api = this;

        scene.renderCanvas();
        scene.renderStartButton();

        scene.$canvas.addEventListener('click', (e) => {
            const $tile = e.target as HTMLElement;
            // Prevent propagating click callback if:
            // 1. the DOM element clicked is not a "box".
            // 2. the "box" already has a value in it.
            // 3. A player already won the game.
            if ($tile.className !== "box") {
                return false;
            }

            const index = parseInt($tile.dataset.index as string, 10);
            // const row = parseInt($tile.dataset.row as string, 10);
            // const column = parseInt($tile.dataset.column as string, 10);

            api.selectTile(index)
        });

        scene.$startBtn.addEventListener('click', () => {
            api.resetState();
            scene.reset();
        });
    }

    onWin(): void {
        const scene = this.scene;
        const api = this;

        api.state.winningTiles.forEach((tileArr) => {
            scene.renderTileRed(tileArr);
        });
        scene.renderAnnouncements(`${api.state.winner} has won!`);
    }



}