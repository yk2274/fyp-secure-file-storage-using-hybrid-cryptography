import React, { useState } from 'react';
import { Container } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Auth from './components/Auth/Auth'
import SharedFile from './components/SharedFile/SharedFile'


const App = () => {
  return (
      <Router>
        <Container maxWidth="lg">
          <Navbar />
            <Switch>
              <Route  path="/home/:userId" exact component={Home} />
              <Route  path="/" exact component={Auth} />
              <Route  path="/download_shared_file/:sharedFileId" exact component={SharedFile} />              
            </Switch>
        </Container>
      </Router>
    )
}

export default App;
