const player = (name, mark) => {
    return {
        name,
        mark
    }
}

const player1 = player("fabio", "x")

const player2 = player("bruna", "o")

const gameFlow = (() => {

    let currentPlayer = player1;
    const getCurrentPlayer = function () {
        return currentPlayer;
    }

    const changeCurrentPlayer = function () {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    }
    
    return {
        getCurrentPlayer,
        changeCurrentPlayer,
    }
})();

const gameBoard = (() => {
    const body = document.querySelector("body")
    const board = document.createElement("div")
    board.setAttribute("id", "board")
    body.append(board);

    let boardArray = [];
    for (let i = 0; i < 9; i++) {
        boardArray.push([]);
    }

    const add = function (mark, position) {
        boardArray[position].push(mark)
    }

    const renderBoard = function () {
        boardArray.forEach( (slot, index) => {
            const spot = document.createElement("div")
            spot.setAttribute("class", "spot")
            spot.addEventListener("click", () => {
                const currentPlayer = gameFlow.getCurrentPlayer();
                boardArray[index] = currentPlayer.mark;
                gameFlow.changeCurrentPlayer();
                renderPlays();
            }, {once : true})
            board.append(spot);
        })
    }

    const renderPlays = function () {
    boardArray.forEach( (slot, index) => {
            const boardNodes = board.childNodes;
            boardNodes[index].innerHTML = slot;
        })
    }

    return {
        boardArray,
        renderBoard,
        renderPlays,
        add
    }
})();

gameBoard.renderBoard();





