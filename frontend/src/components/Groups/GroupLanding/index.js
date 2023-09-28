import { useDispatch, useSelector } from "react-redux"
import { getGroups } from "../../../store/groups"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import './GroupLanding.css'


export function GroupLanding() {
  const groups = useSelector(state => state.groups)

  return(
    <div className="group-landing-container">
      <div className="links">
        <NavLink to='/events'>Events</NavLink>
        <span>Groups</span>
      </div>

      <div className="group-box">

        {Object.entries(groups).map((element) => {

          return (
            <div key={element[1].id} className="group">
              <NavLink to={`/groups/${element[1].id}`}>
              <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
              <div>


                  <h3>{element[1].name}</h3>


                <h3>{element[1].city}, {element[1].state}</h3>
                <p>{element[1].about}</p>
                <h3>Link to events * {element[1].private ? 'Private' : 'Public'}</h3>
              </div>
              </NavLink>
            </div>
          )})}

      </div>
    </div>
  )
}
