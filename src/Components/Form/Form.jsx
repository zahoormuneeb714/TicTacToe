import React from "react";
import "./Form.css";

const Form = ({ onGameStart }) => {
    let [formData, setFormData] = React.useState({
        p1: "",
        p2: ""
    });

    function handleOnInputChange(e) {
        let { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (formData.p1.trim() === "" || formData.p2.trim() === "") {
            alert("Please Enter the players name");
            return;
        }

        localStorage.setItem("tttGamePlayers", JSON.stringify(formData));
        window.dispatchEvent(new Event("players-updated"));
        alert("Players Set Successfully");

        // Important: Pass formData to parent!
        onGameStart(formData);
    }



    function isPlayersSetInLocalStorage() {
        let playersInLS = JSON.parse(localStorage.getItem("tttGamePlayers"))
        if (playersInLS) {
            return true;
        }
        return false;

    }


    //! Hanldle Handle Continue with Old Players :)
    function contineWithOldPlayers() {
        let oldPlayers = JSON.parse(localStorage.getItem("tttGamePlayers"))
        if (oldPlayers) {
            window.dispatchEvent(new Event("players-updated"));
            localStorage.setItem("tttGamePlayers", JSON.stringify(oldPlayers));
            onGameStart(oldPlayers);
        }
    }

    //! Hanldle Play with Default Players :)
    function playWithDefaultPlayers() {
        let defaultPlayers = { p1: "Player1", p2: "Player2" };
        window.dispatchEvent(new Event("players-updated"));
        localStorage.setItem("tttGamePlayers", JSON.stringify(defaultPlayers));
        onGameStart(defaultPlayers);
    }


    return (
        <>
            <div className="form-container container">
                <h1 className="form-title title">Tic <span>Tac</span> Toe</h1>
                <h2 className="form-subtitle">Enter Players Names</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Player One Name"
                            name="p1"
                            onChange={handleOnInputChange}
                            value={formData.p1}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Player Two Name"
                            name="p2"
                            onChange={handleOnInputChange}
                            value={formData.p2}
                        />
                    </div>

                    <button type="submit" className="btn">Start Game</button>
                </form>

                {isPlayersSetInLocalStorage() ?
                    (
                        <button className="btn-link" onClick={contineWithOldPlayers}>Continue with old players</button>
                    ) : (
                        <button className="btn-link" onClick={playWithDefaultPlayers}>Play with default players</button>
                    )
                }

            </div>
        </>
    );
};


export default Form;
