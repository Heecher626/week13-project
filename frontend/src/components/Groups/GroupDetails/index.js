import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOneGroup } from "../../../store/groups";
import { useEffect, useState } from "react";
import DeleteGroupModal from "./DeleteGroupModal";
import OpenModalButton from "../../OpenModalButton";




export default function GroupDetails(){
  const [isLoaded, setIsLoaded] = useState()
  let dispatch = useDispatch()
  const [isOwner, setIsOwner] = useState(false)
  let {groupId} = useParams()
  const group = useSelector(state => state.groups[groupId])
  const session = useSelector(state => state.session)

  useEffect(() => {
    dispatch(getOneGroup(groupId)).then(()=>{setIsLoaded(true)})
  }, [dispatch])

    if(!group.Organizer){
      return null
    }


  if(session){
    if(session.user.id === group.organizerId && isOwner !== true){
      setIsOwner(true)
      console.log('isOwner? :', isOwner)
    }
  }


  return  (
    <>
      <div>

        <div>
          <NavLink to='/groups'>Groups</NavLink>
          INSERT IMAGE HERE
        </div>

        <div>
          <h1>{group.name}</h1>
          <h4>{group.location}</h4>
          <div>
            <h4>Link to Events</h4>
            <h4>{group.private ? 'Private' : 'Public'}</h4>
          </div>
          <h4>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</h4>


          {isOwner && (<div>
            <button>Create event</button>
            <button>Update</button>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteGroupModal groupId={groupId} />}
            />
          </div>)}
        </div>
      </div>

      <div>
      <h2>Organizer</h2>

      </div>

    </>
  )
}
