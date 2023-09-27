import { useDispatch, useSelector } from "react-redux"
import { getGroups } from "../../../store/groups"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"


export function GroupLanding() {
  const groups = useSelector(state => state.groups)

  return(
    <div>
      <div>
      <NavLink to='/Events'>Events</NavLink>
      <span>Groups</span>
      </div>

      <div>

        {Object.entries(groups).map((element) => {

          return (
            <div key={element[1].id}>
              <img src='https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg'/>
              <div>

                <NavLink to={`/groups/${element[1].id}`}>
                  <h3>{element[1].name}</h3>
                </NavLink>

                <h3>{element[1].city}, {element[1].state}</h3>
                <p>{element[1].about}</p>
                <h3>Link to events * {element[1].private ? 'Private' : 'Public'}</h3>
              </div>
            </div>
          )})}
      </div>
    </div>
  )
}
