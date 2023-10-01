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
        <span><NavLink to='/events' className='events-link'>Events  </NavLink><span>  Groups</span></span>
        <h1>Groups in Meetup</h1>
      </div>

      <div className="group-box">

        {Object.entries(groups).map((element) => {

          return (
            <div key={element[1].id} className="group">
              <NavLink to={`/groups/${element[1].id}`}>
              <img src={element.previewImage !== "No preview image" ? 'https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg' : element.previewImage}/>
              <div>


                  <h3>{element[1].name}</h3>


                <h3>{element[1].city}, {element[1].state}</h3>
                <p>{element[1].about}</p>
                <h3>{element[1].numEvents} Event{element[1].numEvents == 1 ? '' : 's'} · {element[1].private ? 'Private' : 'Public'}</h3>
              </div>
              </NavLink>
            </div>
          )})}

      </div>
    </div>
  )
}
