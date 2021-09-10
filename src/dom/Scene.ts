import Game from "../Game";

export default class Scene {

    // The scene. DOM reference.
    public $canvas;
    public $startBtn;
    public $announcements;

    public renderStartButton() {
        const elem = document.createElement("button");
        elem.style.display = "absolute";
        elem.innerText = "Re-start game";
        elem.style.marginTop = "1em";
        elem.style.userSelect = "none";
        elem.style.cursor = "pointer";

        this.$startBtn = elem;
        this.$canvas.appendChild(this.$startBtn);
    }

    public renderAnnouncements(text: string) {
        const elem = document.createElement("div");
        elem.style.display = "absolute";
        elem.style.padding = "1em";
        elem.style.fontStyle = "italics";
        elem.innerText = text;

        this.$announcements = elem;
        this.$canvas.appendChild(this.$announcements);
    }

    public removeAnnouncements() {
        return this.$announcements && this.$announcements.remove();
    }

    public renderCanvas() {

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

    public renderTileRed(tileArr): void {
        (document.querySelector(`[data-row="${tileArr[0]}"][data-column="${tileArr[1]}"]`) as HTMLElement).style.backgroundColor = "red";
    }

    public reset() {
        this.removeAnnouncements();
        this.$canvas.querySelectorAll(".box").forEach(($box) => {
            $box.innerText = "";
            $box.style.backgroundColor = "";
        });
    }
}