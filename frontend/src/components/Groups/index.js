import { Switch, Route } from "react-router-dom";
import { GroupLanding } from "./GroupLanding";
import GroupDetails from "./GroupDetails";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../store/groups";
import GroupForm from "./GroupForm";
import GroupUpdate from "./GroupUpdate";


export default function Groups(){
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroups()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      {isLoaded && <Switch>
        <Route exact path='/groups'>
          <GroupLanding />
        </Route>
        <Route exact path='/groups/new'>
          <GroupForm />
        </Route>
        <Route path='/groups/:groupId/edit'>
          <GroupUpdate />
        </Route>
        <Route path='/groups/:groupId'>
          <GroupDetails />
        </Route>
      </Switch>}
    </>
  );
}
