import Game, {GameResult, Player} from "./Game";
import {randomInt} from "./utils";

new Game(
    // tslint:disable-next-line:only-arrow-functions
    function(this: Game) {
        console.log('Game has started!');
    },
    function (this: Game) {
        // const state = this.state;
        const player = this.getCurrentPlayerLabel();

        console.log(`${player} moves ...`);
    },
    function (this: Game) {
        const state = this.state;
        const player = this.getCurrentPlayerLabel();

        console.log(`It's ${player}'s turn`);

        // Random AI
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
            console.log(freeBoardTilesByIndex);

            const randomIndex = randomInt(0, freeBoardTilesByIndex.length - 1);
            const tileIndex = freeBoardTilesByIndex[randomIndex];

            (document.querySelector(`#box-${tileIndex}`) as HTMLElement).click();
        }

    },
    function(this: Game) {
        const state = this.state;

        if (state.result === GameResult.WIN) {
            console.log(`${state.winner} has won!!!`);
        } else if (state.result === GameResult.DRAW) {
            console.log(`Damn it's a draw!`);
        }
    }
).start();