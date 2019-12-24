import React from "react";

//state should be typed
export default class Timer extends React.Component {
  timerID: number = 0;
  constructor(props: Readonly<{}>) {
    super(props);
  }
  state = {
    date: Date.now(),
    time: {
      seconds: 0,
      minutes: 0,
      hours: 0
    }
  };

  componentDidMount() {
    this.timerID = window.setInterval(() => this.tick(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    let dif = Math.round((Date.now() - this.state.date) / 1000);
    this.setState({
      time: {
        seconds: dif % 60,
        minutes: Math.floor(dif / 60) % 60,
        hours: Math.floor(dif / 3600)
      }
    });
  }

  padWithZero(value: number): string {
    if (value >= 10) {
      return value.toString();
    }
    return `0${value}`;
  }

  render() {
    return (
      <div className="timer">
        <h2>
          {this.padWithZero(this.state.time.hours)}:
          {this.padWithZero(this.state.time.minutes)}:
          {this.padWithZero(this.state.time.seconds)}
        </h2>
      </div>
    );
  }
}
