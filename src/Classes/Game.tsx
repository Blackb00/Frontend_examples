import React from 'react';
import Board from './Board';
import Timer from './Timer'

export default class Game extends React.Component {
    state = 
    {
        boardHeight:9,
        boardWidth:12,
        numOfBombs:10
    };
    
    render() {
        const { boardHeight, boardWidth, numOfBombs } = this.state;
        return (
            <div className="game">
                <div className="game-board">
                    <Timer/>
                    <Board height={boardHeight} width={boardWidth} bombs={numOfBombs}/>
                </div>
                <div className="game-info">
                </div>
            </div>
        )
    }
} 