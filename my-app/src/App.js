import React from 'react';
import Drawing from "./pages/drawing/drawing";
import Queue from "./pages/queue/queue"
import Graph2D from "./pages/components/2dgraph";
import Test3D from "./pages/3d/3d";
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/drawing" exact component={Drawing} />
        <Route path="/" exact component={Queue} />
        <Route path="/graph2d" exact component={Graph2D} />
        <Route path="/test" exact component={Test3D} />
      </Switch>
    </Router>
  )
}


export default App;
