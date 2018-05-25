import React, { Component } from 'react';
import './BingoBoard.css';

const FREESPACE_KEY = 0;

class BingoBoard extends Component {
    constructor(props) {
        super(props);
        let prevSession = localStorage.getItem("bingoState");
        if (prevSession !== undefined && prevSession !== "undefined") {
            this.state = {
                spaces: JSON.parse(prevSession)
            };
        }
        else {
            this.state = {
                spaces: this.generateNewBoard()
            };
            this.saveState();
        }
    }

    generateNewBoard() {
        // Generate keys 1-N where N is the largest key in props.spaces
        let initialBoard = new Array(this.props.spaces.length - 1).fill().map((_, i) => i + 1);
        // Fisher-Yates Shuffle, low to high
        let randomN = (n) => Math.floor(Math.random() * n);
        for (let i = 0; i < initialBoard.length - 1; i++) {
            let j = randomN(initialBoard.length - i) + i;
            let temp = initialBoard[i];
            initialBoard[i] = initialBoard[j];
            initialBoard[j] = temp;
        }
        //After shuffling, take the first 24 spaces
        initialBoard = initialBoard.slice(0, 24);
        initialBoard.splice(12, 0, FREESPACE_KEY);
        return initialBoard.map((spaceKey) => {
            return {key: spaceKey, selected: false};
        });
    }

    fullReset() {
        this.setState({
            spaces: this.generateNewBoard()
        });
    }

    saveState() {
        localStorage.setItem("bingoState", JSON.stringify(this.state.spaces));
    }

    componentDidUpdate() {
        this.saveState();
    }

    spacesHaveBingo(spaces) {
        // Check rows and columns
        for (let i = 0; i < 5; i++) {
            // Row check
            if (spaces.slice(i * 5, (i + 1) * 5).every((s) => s.selected)) {
                return true;
            }

            // Column check
            if (spaces.filter((v, j) => j % 5 === i).every((s) => s.selected)) {
                return true;
            }
        }

        // Diagonals check
        if (spaces.filter((v, i) => i % 6 === 0).every((s) => s.selected)) {
            return true;
        }

        if (spaces.filter((v, i) => (i % 4 === 0 && i < 24 && i > 0)).every((s) => s.selected)) {
            return true;
        }

        // Otherwise, no bingo
        return false;
    }

    handleSpaceClick(key) {
        let newSpaces = this.state.spaces.map((space) => {
            if (space.key === key) {
                return {
                    key: space.key,
                    selected: !space.selected,
                };
            }
            return space;
        });
        if (this.spacesHaveBingo(newSpaces)) {
            console.log("Hooray!");
        }
        this.setState({spaces: newSpaces});
    }

    render() {
        let spaces = this.state.spaces.map((space) =>
            <BingoSpace
                key={space.key}
                text={this.props.spaces.find((s) => s.key === space.key).text}
                selected={space.selected}
                clickHandler={(ev) => this.handleSpaceClick(space.key)} />
        )
        return (
            <div>
                <div>
                    <span>Bingo!</span>
                    <button onClick={() => this.fullReset()}>New Board</button>
                </div>
                <div className="bingo-board">
                    {spaces}
                </div>
            </div>
        );
    }
}

class BingoSpace extends Component {
    handleClick(ev) {
        this.props.clickHandler();
    }

    render() {
        let className = "bingo-board__space" + (this.props.selected ? " bingo-board__space--selected" : "");
        return (
            <div className={className} onClick={ev => this.handleClick(ev)}>
                {this.props.text}
            </div>
        );
    }
}

export default BingoBoard;