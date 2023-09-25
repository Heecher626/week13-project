import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOneGroup } from "../../../store/groups";
import { useEffect } from "react";



export default function GroupDetails(){
  let dispatch = useDispatch()
  let {groupId} = useParams()
  const group = useSelector(state => state.groups[groupId])

  useEffect(() => {
    dispatch(getOneGroup(groupId))
  }, [dispatch])
  return (
    <>
      <div>
        {group.city}
        <div>
          <NavLink to='/groups'>Groups</NavLink>

        </div>
      </div>

      Lorem Ipsum
    </>
  )
}
