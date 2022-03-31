import Game from "./Game.js"
import Tile from "./Tile.js";


(function init() {
    const game = new Game();
    game.new();
    game.generateTile();
    
    const slideTiles = (cells) => {
        return Promise.all(
            cells.flatMap(group => {
                const promises = []
                // loop through column
                for (let i = 1; i < group.length; i++) {
                    // target specific cell in column
                    const cell = group[i];
                    if (cell.tile == null) continue
                    let lastValidCell;
                    // loop through all remaining tiles 
                    // first cell is at index 1
                    // check if there is a cell above
                    for(let j = i - 1; j >= 0; j--) {
                        // cell directly above initial cell at group[i]
                        const moveToCell = group[j];
                        if (!moveToCell.canAccept(cell.tile)) break
                        lastValidCell = moveToCell;
                    }
                    if (lastValidCell != null) {
                        // call function to return promise once animation finishes
                        promises.push(cell.tile.waitForTransition())
                        if (lastValidCell.tile != null) {
                            lastValidCell.mergeTile = cell.tile
                        } else {
                            lastValidCell.tile = cell.tile
                        }
                        cell.tile = null
                    }
                }
                return promises
            })
        )
    }
    
    const setupInput = () => {
        window.addEventListener('keydown', handleInput, { once: true });
    }
    
    const moveUp = () => {
        return slideTiles(game.createGrid.cellsByColumn);
    }
    
    const moveDown = () => {
        return slideTiles(game.createGrid.cellsByColumn.map(column => [...column].reverse()));
    }
    
    const moveLeft = () => {
        return slideTiles(game.createGrid.cellsByRow);
    }
    
    const moveRight = () => {
        return slideTiles(game.createGrid.cellsByRow.map(row => [...row].reverse()));
    }


    function canMoveUp() {
        return canMove(game.createGrid.cellsByColumn)
    }
    
    function canMoveDown() {
        return canMove(game.createGrid.cellsByColumn.map(column => [...column].reverse()))
    }
    
    function canMoveLeft() {
        return canMove(game.createGrid.cellsByRow)
    }
    
    function canMoveRight() {
        return canMove(game.createGrid.cellsByRow.map(row => [...row].reverse()))
    }

    const canMove = (cells) => {
        
        return cells.some(group => {
            return group.some((cell, index) => {
              if (index === 0) return false
              if (cell.tile == null) return false
              const moveToCell = group[index - 1]
              return moveToCell.canAccept(cell.tile)
            })
          })
    }
    
    const handleInput = async (e) => {

        switch (e.key) {
            case "ArrowUp":
              if (!canMoveUp()) {
                setupInput()
                return
              }
              await moveUp()
              break
            case "ArrowDown":
              if (!canMoveDown()) {
                setupInput()
                return
              }
              await moveDown()
              break
            case "ArrowLeft":
              if (!canMoveLeft()) {
                setupInput()
                return
              }
              await moveLeft()
              break
            case "ArrowRight":
              if (!canMoveRight()) {
                setupInput()
                return
              }
              await moveRight()
              break
            default:
              setupInput()
              return
          }
    
        game.createGrid.cells.forEach(cell => cell.mergeTiles())
        const newTile = new Tile(game.gameBoard)

        game.createGrid.randomEmptyCell().tile = newTile 

        // check for game end
        if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
            newTile.waitForTransition(true).then(() => {
              alert("You lose")
            })
            return
        }
    
        setupInput()
    }
    
    setupInput()
})();



