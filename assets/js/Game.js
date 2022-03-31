import Grid from "./Grid.js"
import Tile from "./Tile.js"

export default class Game {
    constructor() {
        this.gameBoard = document.getElementById("game-board");
        this.createGrid = new Grid(this.gameBoard)

    }

    new() {
        this.createGrid
    }
    
    generateTile() {
        this.createGrid.randomEmptyCell().tile = new Tile(this.gameBoard)
        this.createGrid.randomEmptyCell().tile = new Tile(this.gameBoard)
    }

    


}