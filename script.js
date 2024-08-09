const board = document.getElementById('board');
let selectedPiece = null;
let turn = 'black';

const createBoard = () => {
    board.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = row;
            square.dataset.col = col;

            if ((row + col) % 2 === 0) {
                square.classList.add('black');
            } else {
                square.classList.add('red');
                if (row < 3) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'black-piece');
                    piece.dataset.color = 'black';
                    square.appendChild(piece);
                } else if (row > 4) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', 'white-piece');
                    piece.dataset.color = 'white';
                    square.appendChild(piece);
                }
            }
            board.appendChild(square);
            square.addEventListener('click', handleSquareClick);
        }
    }
};

const handleSquareClick = (event) => {
    const square = event.currentTarget;
    const piece = square.querySelector('.piece');
    console.log(`Square clicked: ${square.dataset.row}, ${square.dataset.col}`);

    if (selectedPiece) {
        const oldSquare = selectedPiece.parentElement;
        if (square !== oldSquare) {
            if (isValidMove(oldSquare, square)) {
                movePiece(oldSquare, square);
                promoteToKing(square);
                selectedPiece.classList.remove('highlight');
                selectedPiece = null;
                checkWinner();
                switchTurn();
            } else {
                console.log('Invalid move');
            }
        } else {
            selectedPiece.classList.remove('highlight');
            selectedPiece = null;
        }
    } else if (piece && piece.dataset.color === turn) {
        selectedPiece = piece;
        selectedPiece.classList.add('highlight');
        console.log(`Piece selected: ${piece.dataset.color}`);
    }
};

const isValidMove = (fromSquare, toSquare) => {
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);

    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    if (toSquare.querySelector('.piece')) {
        return false;
    }

    if (selectedPiece.classList.contains('king')) {
        if (Math.abs(rowDiff) === 1 && colDiff === 1) {
            return true;
        }

        if (Math.abs(rowDiff) === 2 && colDiff === 2) {
            const middleRow = (fromRow + toRow) / 2;
            const middleCol = (fromCol + toCol) / 2;
            const middleSquare = board.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
            const middlePiece = middleSquare.querySelector('.piece');

            if (middlePiece && middlePiece.dataset.color !== turn) {
                middleSquare.removeChild(middlePiece);
                return true;
            }
        }
    } else {
        if (turn === 'black' && rowDiff === 1 && colDiff === 1) {
            return true;
        }

        if (turn === 'white' && rowDiff === -1 && colDiff === 1) {
            return true;
        }

        if (turn === 'black' && rowDiff === 2 && colDiff === 2) {
            const middleRow = (fromRow + toRow) / 2;
            const middleCol = (fromCol + toCol) / 2;
            const middleSquare = board.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
            const middlePiece = middleSquare.querySelector('.piece');

            if (middlePiece && middlePiece.dataset.color !== turn) {
                middleSquare.removeChild(middlePiece);
                return true;
            }
        }

        if (turn === 'white' && rowDiff === -2 && colDiff === 2) {
            const middleRow = (fromRow + toRow) / 2;
            const middleCol = (fromCol + toCol) / 2;
            const middleSquare = board.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
            const middlePiece = middleSquare.querySelector('.piece');

            if (middlePiece && middlePiece.dataset.color !== turn) {
                middleSquare.removeChild(middlePiece);
                return true;
            }
        }
    }

    return false;
};

const movePiece = (fromSquare, toSquare) => {
    toSquare.appendChild(selectedPiece);
    console.log(`Piece moved to: ${toSquare.dataset.row}, ${toSquare.dataset.col}`);
};

const promoteToKing = (square) => {
    const piece = square.querySelector('.piece');
    const row = parseInt(square.dataset.row);

    if ((piece.dataset.color === 'black' && row === 7) || (piece.dataset.color === 'white' && row === 0)) {
        piece.classList.add('king');
        console.log(`${piece.dataset.color} piece promoted to king at row ${row}`);
    }
};

const switchTurn = () => {
    turn = turn === 'black' ? 'white' : 'black';
    console.log(`Turn switched to: ${turn}`);
};

const checkWinner = () => {
    const blackPieces = board.querySelectorAll('.black-piece, .black-piece.king');
    const whitePieces = board.querySelectorAll('.white-piece, .white-piece.king');

    if (blackPieces.length === 0) {
        displayWinner('White');
    } else if (whitePieces.length === 0) {
        displayWinner('Black');
    }
};

const displayWinner = (winner) => {
    const winnerPopup = document.getElementById('winner-popup');
    const winnerMessage = document.getElementById('winner-message');

    winnerMessage.textContent = `${winner} wins!`;
    winnerPopup.classList.remove('hidden');
};

const resetGame = () => {
    createBoard();
    const winnerPopup = document.getElementById('winner-popup');
    winnerPopup.classList.add('hidden');
};

createBoard();
