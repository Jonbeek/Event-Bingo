import React, { Component } from 'react';

import * as bingoSpaces from './data.json'
import BingoBoard from './BingoBoard'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BingoBoard spaces={bingoSpaces} />
      </div>
    );
  }
}

export default App;
