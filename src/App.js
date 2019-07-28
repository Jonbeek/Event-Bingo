import React, { Component } from "react";

import bingoBoards from "./boards.json";
import BingoBoard from "./BingoBoard";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedBoard: ""
		};
	}

	chooseBoard(selectedBoard) {
		console.log(selectedBoard);
		if (bingoBoards.some(board => board.name === selectedBoard)) {
			this.setState({
				selectedBoard: selectedBoard
			});
		}
	}

	render() {
		if (this.state.selectedBoard == "") {
			let boardOptions = bingoBoards.map(board => (
				<button onClick={() => this.chooseBoard(board.name)}>{board.name}</button>
			));
			return (
				<div>
					<title>Select a bingo board...</title>
					<div className="App">
            {boardOptions}
          </div>
				</div>
			);
		}
		let selectedBingoBoard = bingoBoards.filter(
			board => board.name === this.state.selectedBoard
		)[0];
		return (
			<div>
				<title>{selectedBingoBoard.name}</title>
				<div className="App">
					<BingoBoard
						name={selectedBingoBoard.name}
						spaces={selectedBingoBoard.spaces}
					/>
				</div>
			</div>
		);
	}
}

export default App;
