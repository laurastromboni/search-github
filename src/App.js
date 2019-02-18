import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

require('dotenv').config()

class App extends Component {

  state = {
    isLoaded: true,
    isLimited: false,
    noQuery: true,
    items: [],
    users: '',
  };

  handleChangeText(event){

    const {value} = event.target;
    this.setState({users : value});
    
    if(value.length === 0) {
      this.setState({
        noQuery: true,
        items: []
      });
      return;
    }

      fetch(`https://api.github.com/search/users?q=${value}&client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`)
        .then(data => data.json())
        .then(
          data => {
            if(data.message) {
              this.setState({
                isLimited: true,
                noQuery: false,
              })
            } else {
              this.setState({
                isLoaded: false,
                isLimited: false,
                noQuery: false,
                items: data.items
              });
            }
          },
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
      }

  render() {

    const {items, isLimited, noQuery} = this.state;

    const results = items.map((oneProfile, i) => 
        <li key={i}>
          <a target="_blank" rel="noopener noreferrer" href={oneProfile.html_url}>
            <p>{oneProfile.login}</p>
          </a>
        </li>
      );

    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Search for someone</h1>
          <h4>Inextenso Digital x Github</h4>
        </header>

        <section id="search">
        <input autoComplete="off" onChange = {event => this.handleChangeText(event)} type="string" name="users" placeholder="@username" className="users" />
        { items.length > 0 ?
          <ul className="backgroundGrey">
            {results}
          </ul>
          :
          isLimited ?
            <div className="backgroundGrey">
              <p>Sorry, Github rate limit...</p>
            </div>
            :
            noQuery ?
              <div className="backgroundGrey">
                <p>Start to search</p>
              </div>
              :
              <div className="backgroundGrey">
                <p>Not any result</p>
              </div>
        }
        </section>

        <footer>
          <p>Made with React</p>
        </footer>

      </div>
    );
  }
}

export default App;

// Rate limit : https://developer.github.com/v3/#conditional-requests 
// Fetch : https://developer.mozilla.org/fr/docs/Web/API/Fetch_API/Using_Fetch