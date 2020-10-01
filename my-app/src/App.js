import React from 'react';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Monopoly from "./pages/base/monopoly";

// https://www.pornhub.com/view_video.php?viewkey=ph5f06e9657a805#1

function App() {
  return (
    <Router>
    <Switch>
      <Route path="/" exact component={Monopoly} />
    </Switch>
  </Router>

  );
}

export default App;
