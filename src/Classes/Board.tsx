import React from 'react';
import Cell from './Cell';
import { ICell } from "./Cell";


export default class Board extends React.Component<any> {
    state = {
        boardData: this.getCellsData(this.props.height, this.props.width, this.props.bombs)
    }

    ///// Creating an array of cell entities using ICell interface/////////////
    getCellsData(boardHeight: number, boardWidth: number, numOfBombs: number) {
        let cellsData = this.createArrOfCells(boardHeight, boardWidth);
        cellsData = this.putBombs(cellsData, boardHeight, boardWidth, numOfBombs);
        this.setFieldBombs(cellsData);
        return cellsData;
    }

    createArrOfCells(boardHeight: number, boardWidth: number) {
        let newArr = [];
        for (let i = 0; i < boardHeight; i++) {
            let arr: ICell[] = [];
            newArr[i] = arr;
            for (let q = 0; q < boardWidth; q++) {
                newArr[i][q] = {
                    y: i,
                    x: q,
                    hasBomb: false,
                    numOfBombsClose: 0,
                    isOpen: false,
                    isFlaged: false
                }
            }
        }

        return newArr;
    }
    putBombs(cellsData: ICell[][], y: number, x: number, numOfBombs: number) {
        let num = x * y;
        let bombIndxs = this.createArray(numOfBombs, num);
        for (let i = 0; i < y; i++) {
            for (let q = 0; q < x; q++) {
                let tup: [number, number] = [cellsData[i][q].y, cellsData[i][q].x];
                cellsData[i][q].hasBomb = this.getBombForCell(tup, bombIndxs);
            }

        }
        return cellsData;
    }

    setFieldBombs(cellData: ICell[][]): void {
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                if (cellData[y][x].hasBomb) {
                    continue;
                }
                //this.testMethod(cellData, x, y, this.putNumOfBombs)
                this.setCellBombs(cellData, x, y);
            }
        }
    }

    setCellBombs(cellData: ICell[][], x: number, y: number): void {
        let cell = cellData[y][x];
        for (let nextX = x - 1; nextX <= x + 1; nextX++) {
            for (let nextY = y - 1; nextY <= y + 1; nextY++) {
                if (nextX === x && nextY === y) {
                    continue;
                }
                if (!this.isFieldExist(nextX, nextY)) {
                    continue;
                }
                if (cellData[nextY][nextX].hasBomb) {
                    cell.numOfBombsClose++;
                }
            }
        }
    }
    
    isFieldExist(x: number, y: number): boolean {
        return x >= 0
            && x < this.props.width
            && y >= 0
            && y < this.props.height;
    }

    ///////////////////creating an array of numbers what will introducing the bombs///////
    createArray(numLength: number, numMax: number): number[] {
        var arr = [];
        while (arr.length < numLength) {
            var r = Math.floor(Math.random() * (numMax - 1)) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
        return arr;
    }
    ///////////////////////"putting" bomb in the cell/////////
    getBombForCell(tup: [number, number], arr: number[]): boolean {
        if (arr.length == null) {
            throw new Error("Array is empty.");
        }
        let y = tup[0];
        let x = tup[1];
        let adressOfCell: number = y * this.props.width + x;

        if (arr.indexOf(adressOfCell) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }


    handleClick(e: any, tup: [number, number]): void {
        let newBoardData = this.state.boardData;
        let y = tup[0];
        let x = tup[1];
        if (e.nativeEvent.which === 1) {
            if (this.state.boardData[y][x].hasBomb) {
                this.gameOver();
                this.openAll();
            }

            newBoardData[y][x].isFlaged = false;
            newBoardData[y][x].isOpen = true;
            if (newBoardData[y][x].numOfBombsClose === 0) {
                newBoardData = this.openEmpty(y, x, newBoardData);

            }
        } else if (e.nativeEvent.which === 3) {
            e.preventDefault();
            if (newBoardData[y][x].isOpen) { }
            else {
                newBoardData[y][x].isFlaged = !newBoardData[y][x].isFlaged;
            }
        }
        this.checkForWin(newBoardData);
        this.setState({ boardData: newBoardData });

    }
    checkForWin(arr: ICell[][]): void {
        let count = 0;
        let bombCount = 0;
        let closedCount = 0;
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                if (!arr[y][x].isOpen) {
                    closedCount++;
                }
                if (arr[y][x].hasBomb) {
                    bombCount++;
                }
                if (arr[y][x].isFlaged) {
                    count++;
                }
            }
        }
        if (count === bombCount && count === closedCount) {
            alert("You win!")
            this.openAll();
        }

    }
    openEmpty(y: number, x: number, arr: ICell[][]): ICell[][] {
        for (let nextX = x - 1; nextX <= x + 1; nextX++) {
            for (let nextY = y - 1; nextY <= y + 1; nextY++) {
                if (nextX === x && nextY === y) {
                    continue;
                }
                if (!this.isFieldExist(nextX, nextY)) {
                    continue;
                } else {
                    if (!arr[nextY][nextX].isOpen) {
                        arr[nextY][nextX].isOpen = !arr[nextY][nextX].isOpen;
                        if (arr[nextY][nextX].numOfBombsClose === 0) {
                            arr = this.openEmpty(nextY, nextX, arr);
                        }

                    }

                }


            }
        }
        return arr;
    }
    goLeft(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y][x - 1]) {
                boardArray[y][x - 1].isOpen = true;
                this.goLeft(y, x - 1, boardArray);
                this.goNorthWest(y, x - 1, boardArray);
                this.goSouthWest(y, x - 1, boardArray);
            }
        }
        return boardArray;
    }
    goRight(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y][x + 1]) {
                boardArray[y][x + 1].isOpen = true;
                this.goRight(y, x + 1, boardArray);
                this.goNorthEast(y, x + 1, boardArray);
                this.goSouthEast(y, x + 1, boardArray);
            }
        }
        return boardArray;
    }
    goUp(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y - 1]) {
                boardArray[y - 1][x].isOpen = true;
                this.goUp(y - 1, x, boardArray);
                this.goNorthWest(y - 1, x, boardArray);
                this.goNorthEast(y - 1, x, boardArray);
            }
        } return boardArray;
    }
    goDown(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y + 1]) {
                boardArray[y + 1][x].isOpen = true;
                this.goDown(y + 1, x, boardArray);
                this.goLeft(y + 1, x, boardArray);
                this.goSouthEast(y + 1, x, boardArray);
                this.goSouthWest(y + 1, x, boardArray);
            }
        } return boardArray;
    }
    goNorthWest(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y - 1] && boardArray[y - 1][x - 1]) {
                boardArray[y - 1][x - 1].isOpen = true;
            }

        } return boardArray;
    }
    goNorthEast(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y - 1] && boardArray[y - 1][x + 1]) {
                boardArray[y - 1][x + 1].isOpen = true;
            }

        } return boardArray;
    }
    goSouthWest(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y + 1] && boardArray[y + 1][x - 1]) {
                boardArray[y + 1][x - 1].isOpen = true;
            }

        } return boardArray;
    }
    goSouthEast(y: number, x: number, boardArray: ICell[][]): ICell[][] {
        if (boardArray[y][x].numOfBombsClose === 0) {
            if (boardArray[y + 1] && boardArray[y + 1][x + 1]) {
                boardArray[y + 1][x + 1].isOpen = true;
            }

        } return boardArray;
    }


    openAll(): void {
        let newBoardData = this.state.boardData;
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                newBoardData[y][x].isOpen = true;
            }
        }
        this.setState({ boardData: newBoardData });
    }
    gameOver(): void {
        alert("The game is over!");
    }

    renderCell(cellValue: ICell): React.ReactNode {
        let tup: [number, number] = [cellValue.y, cellValue.x];
        return (
            <Cell
                onClick={(e: any) => this.handleClick(e, tup)}
                onContextMenu={(e: any) => this.handleClick(e, tup)}
                value={cellValue}
            />
        )
    }
    renderBoard(boardData: ICell[][]): React.ReactNode {
        return boardData.map((p: ICell[]) => {
            return (
                <tr className="row" key={p[0].y}>
                    {
                        p.map((k: ICell) => {
                            return (<td key={k.x}>{this.renderCell(k)}</td>);
                        })
                    }
                </tr>
            );
        });
    }
    render(): React.ReactNode {
        return (
            <div>
                <table>
                    <tbody>
                        {this.renderBoard(this.state.boardData)}
                    </tbody>
                </table>

            </div>
        )
    }

}