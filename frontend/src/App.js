import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import  Groups  from "./components/Groups";
import Landing from "./components/Landing";
import Events from "./components/Events";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path='/'>
            <Landing />
          </Route>
          <Route path='/groups'>
            <Groups />
          </Route>
          <Route path='/events'>
            <Events />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
