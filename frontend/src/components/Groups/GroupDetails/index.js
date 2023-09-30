import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOneGroup } from "../../../store/groups";
import { useEffect, useState } from "react";
import DeleteGroupModal from "./DeleteGroupModal";
import OpenModalButton from "../../OpenModalButton";
import "./GroupDetails.css";
import { getEventsByGroup } from "../../../store/events";

export default function GroupDetails() {
  let dispatch = useDispatch();
  const [isOwner, setIsOwner] = useState(false);
  let { groupId } = useParams();
  const group = useSelector((state) => state.groups[groupId]);
  const events = useSelector((state) => state.events)
  const session = useSelector((state) => state.session);
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    dispatch(getOneGroup(groupId))
   .then(() => dispatch(getEventsByGroup(groupId)))
   .then(() => setLoaded(true))
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  const pastEvents = []
  const futureEvents = []

  let currentDate = new Date()

  Object.values(events).forEach(event => {
    if(event.groupId == groupId){
      let eventTime = new Date(event.startDate)
      if(eventTime < currentDate){
        pastEvents.push(event)
      }else {
        futureEvents.push(event)
      }
    }
  })



  console.log('Past Events', pastEvents)
  console.log('Future Events: ', futureEvents)

  const joinButton = () => {
    alert('Feature Coming soon...')
  }

  if (session.user) {
    if (session.user.id === group.organizerId && isOwner !== true) {
      setIsOwner(true);
    }
  }

  return (
    <div className="group-details-container">
      <div>
        <div>
          <NavLink to="/groups">Groups</NavLink>
        </div>

        <div className="upper-container">
          <img src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg" />
          <div className="text-details">
            <h1>{group.name}</h1>
            <h4>{group.location}</h4>
            <span>
              <h4>{group.numEvents} Event{group.numEvents == 1 ? '' : 's'} · {group.private ? "Private" : "Public"}</h4>
            </span>
            <h4>
              Organized by {group.Organizer.firstName} {group.Organizer.lastName}
            </h4>

            {isOwner && (
              <div className="buttons-container">
                <NavLink to={`/groups/${groupId}/events/new`}>
                  <button>Create event</button>
                </NavLink>
                <NavLink to={`/groups/${groupId}/edit`}>
                  <button>Update</button>
                </NavLink>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteGroupModal groupId={groupId} />}
                />
              </div>
            )}
            {(session.user && !isOwner) && (
            <div>
              <button onClick={joinButton}>Join this group</button>
            </div>)}

          </div>
        </div>

        <div>
          <h2>Organizer</h2>
          <h4>{group.Organizer.firstName} {group.Organizer.lastName}</h4>
          <h2>What we're about</h2>
          <h4>{group.about}</h4>
          <div>
           <h2>Events ({group.numEvents})</h2>
           {futureEvents.length && <div><h2>Upcoming Events ({futureEvents.length})</h2>
              {futureEvents.map(event => {
                let split = event.startDate.split(' ')
                let date = split[0]
                let time = split[1]
                return (
                  <NavLink to={`/events/${event.id}`}>
                    <div>
                      <div>
                        <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
                        <div>
                          <p>{date} · {time}</p>
                          <h3>{event.name}</h3>
                        </div>
                      </div>
                      <div>
                        {event.description}
                      </div>
                    </div>
                  </NavLink>
                )
              })}</div>}
            {pastEvents.length && <div><h2>Past Events ({pastEvents.length})</h2>
              {pastEvents.map(event => {
                let split = event.startDate.split(' ')
                let date = split[0]
                let time = split[1]
                return (
                  <NavLink to={`/events/${event.id}`}>
                    <div>
                      <div>
                        <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
                        <div>
                          <p>{date} · {time}</p>
                          <h3>{event.name}</h3>
                        </div>
                      </div>
                      <div>
                        {event.description}
                      </div>
                    </div>
                  </NavLink>
                )
              })}</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
