import { useDispatch, useSelector } from "react-redux"
import { getGroups } from "../../../store/groups"
import { useEffect, useState } from "react"


export function GroupLanding() {
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()
  const groups = useSelector(state => state.groups)

  useEffect(() => {
    dispatch(getGroups()).then(() => setIsLoaded(true))
  }, [dispatch])

  return(
    <div>
      <span>Events</span>
      <span>Groups</span>
      <div>

        {Object.entries(groups).map((element) => (
          <div>{element[1].name}</div>
        ))}
      </div>
    </div>
  )
}
