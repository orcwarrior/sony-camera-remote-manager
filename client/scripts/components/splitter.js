import rivets from "rivets";

const SPLIT_POS = {
    DEFAULT: "DEFAULT",
    LEFT: "LEFT",
    CENTER: "CENTER",
    RIGHT: "RIGHT",
};

const SPLIT_GRID_COLS = {
    DEFAULT: "68% 2px 1fr",
    LEFT: "2% 2px 1fr",
    CENTER: "50% 2px 1fr",
    RIGHT: "98% 2px 1fr",
};
const grid = document.querySelector(".main-grid");
const splitter = document.querySelector("#splitter");

let splitterModel = {
    positions: Object.keys(SPLIT_POS),
    position: SPLIT_POS.DEFAULT,
    createMoveHandler(pos) {
        return this.move.bind(this, pos);
    },
    move: function (pos) {
        // DK: Not an gentleman move maybe..
        if (this.position === SPLIT_POS.LEFT && pos === SPLIT_POS.RIGHT
            || this.position === SPLIT_POS.RIGHT && pos === SPLIT_POS.LEFT)
            pos = SPLIT_POS.DEFAULT;

        grid.style.gridTemplateColumns = SPLIT_GRID_COLS[pos];
        this.position = pos;
    }
};

rivets.bind(splitter, splitterModel);

