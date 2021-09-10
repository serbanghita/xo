import GameImpl from "./dom/GameImpl";
import Scene from "./dom/Scene";

const xo = new GameImpl(new Scene());
xo.start();

window["xo"] = {
    selectTile: xo.selectTile.bind(xo),
    state: xo.state,
};