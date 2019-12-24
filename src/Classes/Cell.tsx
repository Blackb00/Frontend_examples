import React from 'react';

export interface ICell {
    x: number,
    y: number,
    hasBomb: boolean,
    numOfBombsClose: number,
    isOpen: boolean,
    isFlaged: boolean
}

export default class Cell extends React.Component<any> {
   
    getValue() {
        if (!this.props.value.isOpen) {
            return this.props.value.isFlaged ? "F" : null;
        }
        if (this.props.value.hasBomb) {
            return "B";
        }
        if (this.props.value.numOfBombsClose > 0) {
            return this.props.value.numOfBombsClose;
        }
    }

    render() {
        let className =
            "cell" +
            (this.props.value.isOpen ? "" : " closed") +
            (this.props.value.hasBomb ? " hasBomb" : "") +
            (this.props.value.isFlaged ? " flaged" : "");

        return (
            <div
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
                className={className}
            >
                {this.getValue()}
            </div>
        );
    }
}