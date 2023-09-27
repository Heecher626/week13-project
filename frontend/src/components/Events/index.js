import { Switch, Route } from "react-router-dom";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/events";
import EventLanding from "./EventLanding";


export default function Events(){
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()
  console.log('events working')
  useEffect(() => {

    dispatch(getEvents()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>

      {isLoaded && <Switch>
        <Route exact path='/events'>
          <EventLanding />
        </Route>

      </Switch>}
    </>
  );
}
