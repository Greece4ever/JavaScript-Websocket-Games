import React from 'react';
import Drawing from "./pages/drawing/drawing";
import Queue from "./pages/queue/queue"
import Test from "./pages/components/test";
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Switch>
        
        <Route path="/drawing" exact component={Drawing} />
        <Route path="/" exact component={Queue} />
        <Route path="/test" exact component={Test} />
      </Switch>
    </Router>
  )
}


export default App;
