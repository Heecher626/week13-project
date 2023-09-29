import { useDispatch, useSelector } from "react-redux"
import { getGroups } from "../../../store/groups"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

export default function EventLanding() {
  const events = useSelector(state => state.events)
  return(
    <div>
      <div>
        <span>Events</span>
        <NavLink to='/groups'>
          Groups
        </NavLink>
      </div>

      <div>
        Events in Meetup
      </div>

      <div>
        {Object.entries(events).map((element) => {
          let event = element[1]

          return (
            <div key={event.id}>
              <NavLink to={`/events/${event.id}`}>
                <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
                <div>
                  <span>{event.startDate}</span>
                  <h2>{event.name}</h2>
                  <h3>{event.description}</h3>
                </div>

              </NavLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
