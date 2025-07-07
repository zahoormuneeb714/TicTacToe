import React from "react";
import Square from "../Square/Square";
import "./Board.css";

const BoardContainer = ({ onResetGame }) => {

    //? Default Players 
    //* initially we set default players in LS :)
    let defaultPlayers = { p1: "Player1", p2: "Player2" };


    let [players, setPlayers] = React.useState(defaultPlayers);
    let [state, setState] = React.useState(Array(9).fill(null));
    let [isP1Turn, setIsP1Turn] = React.useState(true);


    //! This useEffect will fetch player Names form LS :)
    React.useEffect(() => {

        const updatePlayersFromLS = () => {
            const playersFromLS = JSON.parse(localStorage.getItem("tttGamePlayers"));
            if (playersFromLS) {
                setPlayers(playersFromLS);
            }
        };

        // first time load
        updatePlayersFromLS();

        // Listen for update from Form Component
        window.addEventListener("players-updated", () => {
            console.log("windows dispatched event fired means player names update in LS")
            updatePlayersFromLS()
        });

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener("players-updated", updatePlayersFromLS);
        };
    }, []);


    //& Handle Click on the Square (Logic)
    function handleOnClickSquare(index) {

        //! Copying the actual state of game means get all nine boxes update the clicked box then again store in state of game.
        let copyState = [...state];

        //! This check ensures that do not click on prefilled square.
        if (copyState[index]) {
            return
        }

        //! this check ensures that only null square will be clicked 
        if (copyState[index] === null) {
            copyState[index] = isP1Turn ? "X" : "O";
        }

        //! after on clicked on any square toggling the players turn and store the updated state of board in state.
        setIsP1Turn(!isP1Turn)
        setState(copyState);
    }


    //& Deciding Winner (Logic)
    function decideWinner() {
        //! possible wining conditions :)
        let winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        //! this loops will do two things
        //? 1. checking that is any 3 indexes have same value "X" or "O" according to winCondtions
        //? 2. also ensures that the index have some value "X" or "O" because initially all indexes
        //?    have null value and all winConditon will ture because of same value

        for (const win of winConditions) {
            let [a, b, c] = win;
            if (state[a] !== null && state[a] == state[b] && state[a] == state[c]) {
                return state[a]
            }
        }
        return false;
    }



    //! Just Reset the Board not whole game including player names.
    function handleBoardReset() {
        setState(Array(9).fill(null))
    }





    //! When there is no winner and all squares are filled, it's a draw.
    function isBoardFull(state) {
        return state.every(square => square !== null);
    }

    //! decideWinner() will return winner "X" or "O" if anyone win else it will return false which indicates we have no winner.
    let isWinner = decideWinner();

    //! game will draw if no winner and board will full.
    let isDraw = !isWinner && isBoardFull(state);


    //! this conditions fetch the winner player name according to "X" and "O".
    let winnerPlayer;
    if (isWinner) {
        if (isWinner === "X") {
            winnerPlayer = players.p1;
        } else if (isWinner === "O") {
            winnerPlayer = players.p2;
        }

    }


    let isBoardEmpty = (state) => {
        return state.every(square => square === null);
    }


    return (
        <>
            {
                isWinner ?
                    (
                        <div className="winner-container container">
                            <div className="winner-player">
                                <span>{winnerPlayer}</span>
                                <br />
                                won the game
                            </div>
                            <div className="btn-container">
                                <button onClick={handleBoardReset} className="btn">Play Again</button>
                                <button onClick={onResetGame} className="btn">Rename Players</button>
                            </div>
                        </div>
                    ) : isDraw ? (
                        <div className="draw-container container">
                            <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>It's a Draw!</div>
                            <div className="btn-container">
                                <button onClick={handleBoardReset} className="btn">Play Again</button>
                                <button onClick={onResetGame} className="btn">Rename Players</button>
                            </div>
                        </div>
                    ) : (
                        <>

                            <div className="board-container container ">
                                <h1 className="form-title title">Tic <span>Tac</span> Toe</h1>

                                <PlayerNamesHeader
                                    p1={players.p1}
                                    p2={players.p2}
                                />

                                <NextMove
                                    isP1Turn={isP1Turn}
                                    players={players}
                                />

                                <GameBoard
                                    state={state}
                                    handleOnClickSquare={handleOnClickSquare}
                                />

                                <div className="btn-container">
                                    <button onClick={handleBoardReset} className="btn" disabled={isBoardEmpty(state)}>Reset Board</button>
                                    <button onClick={onResetGame} className="btn">Rename Players</button>
                                </div>
                            </div>
                        </>
                    )
            }
        </>
    )
}





//& PlayerNameHeader Component :)
const PlayerNamesHeader = ({ p1, p2 }) => {
    return (
        <>
            <div className="player-container">
                <div className="player-name">
                    <h2>
                        {p1}
                        <span style={{ color: "white" }}> as </span>
                        X
                    </h2>
                </div>

                <h2 className="vs">V/S</h2>

                <div className="player-name">
                    <h2>
                        {p2}
                        <span style={{ color: "white" }}> as </span>
                        O
                    </h2>
                </div>
            </div>
        </>
    )
}






// & NextMove Component :)
const NextMove = ({ isP1Turn, players }) => {
    return (
        <>
            <div>
                {isP1Turn ?
                    (
                        <div><span style={{ color: "var(--tttTheme)", fontWeight: "bold" }}>{players.p1} </span> please move</div>
                    ) : (
                        <div><span style={{ color: "var(--tttTheme)", fontWeight: "bold" }}>{players.p2} </span> please move</div>
                    )}
            </div>
        </>
    )
}



//& GameBoard Component :)
const GameBoard = ({ state, handleOnClickSquare }) => {
    return (
        <div className="game-board">
            <div className="game-board-row">
                <Square value={state[0]} onClick={() => handleOnClickSquare(0)} />
                <Square value={state[1]} onClick={() => handleOnClickSquare(1)} />
                <Square value={state[2]} onClick={() => handleOnClickSquare(2)} />
            </div>
            <div className="game-board-row">
                <Square value={state[3]} onClick={() => handleOnClickSquare(3)} />
                <Square value={state[4]} onClick={() => handleOnClickSquare(4)} />
                <Square value={state[5]} onClick={() => handleOnClickSquare(5)} />
            </div>
            <div className="game-board-row">
                <Square value={state[6]} onClick={() => handleOnClickSquare(6)} />
                <Square value={state[7]} onClick={() => handleOnClickSquare(7)} />
                <Square value={state[8]} onClick={() => handleOnClickSquare(8)} />
            </div>
        </div>
    )
}





export default BoardContainer;
