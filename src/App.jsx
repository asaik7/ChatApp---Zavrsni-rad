import { Component } from "react";
import React from "react";
import Messages from "./Messages";
import './App.css';
import Input from "./Input";

function randomName () {
  const adjectives = ['Coherent', 'Divergent', 'Righteous', 'Splendid', 'Detailed', 'Godly', 'Spotty', 'Daffy', 'Grouchy', 'Cumbersome', 'Gratis', 'Silky', 'Hellish', 'Resolute', 'Spotted', 'Efficacious', 'Gaping', 'Different', 'Horrible', 'Existing', 'Unfair', 'Ruddy', 'Kindhearted', 'Confident', 'Industrious'];
  const nouns = ['Angel', 'Balloon', 'Downfall', 'Emery', 'Whisper', 'Hair', 'Jade', 'Lady', 'Liberty', 'Glacier','Imagination', 'Driver', 'Inspector', 'Idea', 'Success', 'Rose', 'King', 'Player', 'Mood', 'Winter', 'Pearl','Youth', 'Sword', 'Book', 'Cat'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor,
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("nCoVHPKIa7FkYdYm", {
      data: this.state.member
    });
    this.drone.on("open", error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });

    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
}

render() {
  return (
    <div className="App">
      <div className="App-header">
        <h1>Chat aplikacija</h1> 
        </div>
      <Messages
        messages={this.state.messages}
        currentMember={this.state.member}
      />
      <Input onSendMessage={this.onSendMessage} />
    </div>
  );
}

onSendMessage = (message) => {
  this.drone.publish({
    room: "observable-room",
    message
  });
}

}

export default App;
