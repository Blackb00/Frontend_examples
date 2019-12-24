import React, { Component } from 'react';

export interface ISettings {
    boardWidth: number;
    boardHeight: number;
    numOfBombs: number;
}
export default class Settings extends React.Component<ISettings, object>{
    constructor(props: ISettings) {
        super(props);
    }

    getSettings() {

    }
}