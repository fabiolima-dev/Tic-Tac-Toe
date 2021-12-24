const player = (name, mark) => {
    const play = function (array, index) {
        array[index] = mark;
        let winner = gameFlow.checkGameOver(array, index, mark);
        if (winner) {
            gameBoard.winnerMessage(winner);
        }
        gameFlow.changeCurrentPlayer();
        gameBoard.renderPlays();
    }    
    return {
        play,
        name,
        mark
    }
}

const gameFlow = (() => {
    let players = [];
    let currentPlayer;
    const addPlayer = function (player) {
        players.push(player)
        currentPlayer = players[0]
    }
    const getCurrentPlayer = function () {
        return currentPlayer;
    }
    const changeCurrentPlayer = function () {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1];
        } else {
            currentPlayer = players[0];
        }
    }
    const checkGameOver = function (array, index, mark) {
        // Check if the game is tie    
        if (!array.some( item => item === " ")) {
            return "tie"
        }; 
        // Check Column winner
        if (index < 3) {
            // Check for diagonal winner first two spots
            if (index === 0) {
                if (array[0] === array[4] || array[0] === array[8]) {
                    return mark
                }
            } else if (index === 2) {
                if (array[2] === array[4] || array[2] === array[8]) {
                    return mark
                }
            }
            // Check Column winnner
            if (array[index] === array[index + 3] && array[index] === array[index + 6]) {
                return mark
            }
        } else if (index < 6) {
            // Check for diagonal winner center spot
            if (index === 4) {
                if(array[4] === array[0] && array[4] === array[8] ||
                    array[4] === array[2] && array[4] === array[6]) {
                        return mark
                    }
            }
            // Check for Column winner
            if (array[index] === array[index + 3] && array[index] === array[index - 3]) {
                return mark
            }
        } else {
            // Check for diagonal winner last two spots
            if (index === 6) {
                if (array[6] === array[4] && array[6] === array[2]) {
                    return mark
                }
            } else if (index === 8) {
                if (array[8] === array[4] && array[8] === array[0]) {
                    return mark
                }
            }
            // Check for Column winner
            if (array[index] === array[index -3] && array[index] === array[index -6]) {
                return mark
            }
        }
        //Check Row winner
        if (index === 0 || index === 3 || index === 6) {
            if (array[index] === array[index + 1] && array[index] === array[index + 2]) {
                return mark
            }
        } else if (index === 1 || index === 4 || index === 7) {
            if (array[index] === array[index + 1] && array[index] === array[index - 1]) {
                return mark
            }
        } else {
            if (array[index] === array[index -1] && array[index] === array[index - 2]) {
                return mark
            }
        }
    }    
    return {
        players,
        addPlayer,
        getCurrentPlayer,
        changeCurrentPlayer,
        checkGameOver
    }
})();

const gameBoard = (() => {
    const body = document.querySelector("body")
    const board = document.createElement("div")
    const popupContainer = document.createElement("div")
    const inputContainer = document.createElement("div")
    const winnerContainer = document.createElement("div")
    const innerWinner = document.createElement("div")
    const winner = document.createElement("p")
    const restartGame = document.createElement("button")
    const form = document.createElement("form")
    const xPlayer = document.createElement("input")
    const oPlayer = document.createElement("input")
    const startGame = document.createElement("button")

    board.setAttribute("id", "board")
    popupContainer.setAttribute("id", "popupContainer")
    inputContainer.setAttribute("class", "popup")
    winnerContainer.setAttribute("class", "popup")
    winnerContainer.setAttribute("id", "hidePopup")
    innerWinner.setAttribute("class", "innerPopup")
    restartGame.innerHTML = "Restart Game"
    form.setAttribute("class", "innerPopup")
    xPlayer.setAttribute("placeholder", "x Player Name")
    oPlayer.setAttribute("placeholder", "o Player Name")
    xPlayer.setAttribute("class", "textArea")
    oPlayer.setAttribute("class", "textArea")
    startGame.innerHTML = "Start Game"
    startGame.setAttribute("type", "button")
    
    form.append(xPlayer, oPlayer, startGame);
    inputContainer.append(form);
    winnerContainer.append(innerWinner);
    innerWinner.append(winner, restartGame);
    popupContainer.append(inputContainer, winnerContainer);
    body.append(board, popupContainer);
    
    startGame.addEventListener("click", () => {
        popupContainer.id = "hidePopup"
        inputContainer.id = "hidePopup"
        const x = player(xPlayer.value, "x")
        const o = player(oPlayer.value, "o")
        gameFlow.addPlayer(x);
        gameFlow.addPlayer(o);
    })

    restartGame.addEventListener("click", () => {
        window.location.reload();
    })
    
    let boardArray = [];
    for (let i = 0; i < 9; i++) {
        boardArray.push(" ")
    };

    const winnerMessage = function (mark) {
        if (mark === "x") {
            popupContainer.id = "popupContainer"
            winnerContainer.removeAttribute("id")
            winner.innerHTML = `${gameFlow.players[0].name}`
        } else if (mark === "o") {
            popupContainer.id = "popupContainer"
            winnerContainer.removeAttribute("id")
            winner.innerHTML = `${gameFlow.players[1].name}`
        } else {
            popupContainer.id = "popupContainer"
            winnerContainer.removeAttribute("id")
            winner.innerHTML = "It's a tie!"
        }
    }

    const renderBoard = function () {
        boardArray.forEach( (slot, index) => {
            const spot = document.createElement("div")
            spot.setAttribute("class", "spot")
            spot.addEventListener("click", () => {
                let currentPlayer = gameFlow.getCurrentPlayer();
                currentPlayer.play(boardArray, index);
                currentPlayer = gameFlow.getCurrentPlayer();
                if (currentPlayer.name === "computer" && boardArray.some( item => item === " ")) {
                    AI.minimaxPlay(boardArray);
                }              
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
        winnerMessage
    }
})();

const AI = (() => {
    const name = "computer"
    const mark = "o"
    const getAvailableMoves = function (array) {
        let availableMoves = [];
        array.forEach( (element, index) => {
            if (element === " ") {
                availableMoves.push(index);
            }
        })
        return availableMoves;
    }
    const play = function (array, index) {
        const AvailableMoves = getAvailableMoves(array)
        const AIplay = AvailableMoves[Math.floor(Math.random() * AvailableMoves.length)];
        array[AIplay] = mark;
        gameFlow.checkGameOver(array, index, mark);
        gameFlow.changeCurrentPlayer();
        gameBoard.renderPlays();
    }
    const minimax = function (array, index, isMaximizing, testMark) {
        let result = gameFlow.checkGameOver(array, index, testMark);
        let scores = {
            "o": 1,
            "x": -1,
            "tie": 0 
        }
        if (result) {
            return scores[result];
        }
        if (isMaximizing) {
            let bestScore = -2;
            array.forEach( (item, index, array) => {
                if (item === " ") {
                    array[index] = "o";
                    let score = minimax(array, index, false, "o");
                    bestScore = Math.max(score, bestScore);
                    array[index] = " ";
                }
            })
            return bestScore
        } else {
            let bestScore = 2;
            array.forEach( (item, index, array) => {
                if (item === " ") {
                    array[index] = "x";
                    let score = minimax(array, index, true, "x");
                    bestScore = Math.min(score, bestScore)
                    array[index] = " ";
                }
            })
            return bestScore
        }
    }
    const minimaxPlay = function (array) {
        let bestScore = -2;
        let bestMove;
        array.forEach( (item, index, array) => {
            if (item === " ") {
                array[index] = "o";
                let score = minimax(array, index, false, "o");
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = index
                }
                array[index] = " ";
            }
        })
        array[bestMove] = "o";
        gameFlow.changeCurrentPlayer();
        gameBoard.renderPlays();
    }
    return{
        name,
        mark,
        play,
        getAvailableMoves,
        minimaxPlay
    }
})();

gameBoard.renderBoard();




