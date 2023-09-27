import { Switch, Route } from "react-router-dom";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../../store/events";
import EventLanding from "./EventLanding";


export default function Events(){
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getEvents()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      {isLoaded && <Switch>
        <Route exact path='/events'>
          <EventLanding />
        </Route>
        <Route exact path='/groups/new'>
          <GroupForm />
        </Route>
        <Route path='/groups/:groupId'>
          <GroupDetails />
        </Route>
      </Switch>}
    </>
  );
}
