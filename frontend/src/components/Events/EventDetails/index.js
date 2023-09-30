import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOneEvent } from "../../../store/events";
import DeleteEventModal from "./DeleteEventModal";
import OpenModalButton from "../../OpenModalButton";
import DeleteGroupModal from "../../Groups/GroupDetails/DeleteGroupModal";
import { getOneGroup } from "../../../store/groups";


export default function EventDetails() {
  let dispatch = useDispatch();
  let {eventId} = useParams();
  const [isLoaded, setIsLoaded] = useState(false)
  const event = useSelector((state) => state.events[eventId])
  const allGroups = useSelector((state) => state.groups)

  useEffect(() => {
    dispatch(getOneEvent(eventId))
    .then(() => dispatch(getOneGroup(event.groupId)))
    .then(() => setIsLoaded(true))
  }, [dispatch])

  if(!isLoaded){
    return null
  }

  const group = allGroups[event.groupId]
  const splitStart = event.startDate.split(' ')
  const splitEnd = event.endDate.split(' ')
  return (
    <div>
      <div className="event-detail-heading">
        <NavLink to='/events'>Events</NavLink>
        <h1>{event.name}</h1>
        <h3>Hosted by {group.Organizer.firstName} {group.Organizer.lastName}</h3>
      </div>

      <div className="event-detail-body">
        <div className="event-details-upper">
          <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
          <div>
            <div className="group-card">
              <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
              <h2>{group.name}</h2>
              <h3>{group.private ? 'Private' : 'Public'}</h3>
            </div>
            <div className="event-info-card">
              <div className="event-times">
                <i class="fa-sharp fa-solid fa-clock"></i>
                <div>
                  <div>
                     START <span>{splitStart[0]} · {splitStart[1]}</span>
                  </div>
                  <div>
                     END <span>{splitEnd[0]} · {splitEnd[1]}</span>
                  </div>
                </div>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign"></i>
                <div>{event.price.toFixed(2)}</div>
              </div>
              <div>
                <i class="fa-solid fa-map-pin"></i>
                <div>{event.type}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="event-details-lower">
          <h1>Details</h1>
          <h3>{event.description}</h3>
        </div>
      </div>

      <OpenModalButton
        buttonText={"Delete"}
        modalComponent={<DeleteEventModal event={event} />}
      />
    </div>
  )

}
