
import React, { Component } from 'react';
import {  BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import homeComponent from "../src/components/homeComponent";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router  >
        <div className="App" >
          <main className="App-header">
            <Switch>
              <Route exact path="/" component={homeComponent} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
