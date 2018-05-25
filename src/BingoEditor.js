import React, { Component } from 'react';
import './BingoEditor.css'

class BingoEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            freeSpace: "",
            spaces: [],
        }
    }

    handleInput(ev, id) {
        if (id === -1) {
            this.setState({
                freeSpace: ev.target.value
            });
        }
        else {
            let newSpaces = this.state.spaces.map(
                (v, i) => i === id ? ev.target.value : v
            );
            this.setState({
                spaces: newSpaces
            });
        }
    }

    handleAdd(ev) {
        let newSpaces = this.state.spaces.concat("");
        this.setState({spaces: newSpaces});
    }

    handleDisplayClick(ev) {
        let range = document.createRange();
        range.selectNode(ev.target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
    }

    handleUpload(ev) {
        let file = ev.target.files[0];
        let reader = new FileReader();
        reader.onload = (ev) => {
            try {
                let dataArray = JSON.parse(ev.target.result);
                let freeSpace = dataArray.find((v) => v.key === 0).text;
                let spaces = dataArray.filter(
                    (v) => v.key !== 0
                ).sort(
                    (a, b) => a.key - b.key
                ).map(
                    (v) => v.text
                );
                this.setState({
                    freeSpace: freeSpace,
                    spaces: spaces
                });
            }
            catch (e) {
                console.log("Failed to read file: " + e);
            }
        };
        reader.readAsText(file);
    }

    render() {
        let spaces = this.state.spaces.map((v, i, a) => {
            let focus = i === (a.length - 1);
            return <input 
                key={i}
                value={v}
                autoFocus={focus}
                onChange={(ev) => this.handleInput(ev, i)}
                />
        });

        let output = JSON.stringify([{key: 0, text: this.state.freeSpace}].concat(
            this.state.spaces.map(
                (v, i) => {return {key: (i+1), text: v}}
            )
        ));
        return (
            <div className="bingo-editor">
                <div className='bingo-editor__editor'>
                    <input type="file" onChange={(ev) => this.handleUpload(ev)} />
                    <input value={this.state.freeSpace} onChange={(ev) => this.handleInput(ev, -1)} />
                    {spaces}
                    <button onClick={ev => this.handleAdd(ev)}>New Space</button>
                </div>
                <div className='bingo-editor__display'>
                    <code onClick={(ev) => this.handleDisplayClick(ev)}>
                        {output}
                    </code>
                </div>
            </div>
        );
    }
}

export default BingoEditor;