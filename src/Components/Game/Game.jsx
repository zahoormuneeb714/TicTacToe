import React from "react";
import Form from "../Form/Form";
import Board from "../Board/Board";


const Game = () => {
    const [isGameStarted, setIsGameStarted] = React.useState(false);
    const [players, setPlayers] = React.useState(null);

    function handleStartGame(playersData) {
        setPlayers(playersData);
        setIsGameStarted(true);
    }

    function handleResetGame() {
        setPlayers(null);
        setIsGameStarted(false);
    }

    return (
        <>
            {
                isGameStarted ?
                    (
                        <Board players={players} onResetGame={handleResetGame} />
                    )
                    :
                    (
                        <Form onGameStart={handleStartGame} />
                    )

            }
        </>
    );
}


export default Game;    