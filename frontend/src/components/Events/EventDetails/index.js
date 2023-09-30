import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOneEvent } from "../../../store/events";
import DeleteEventModal from "./DeleteEventModal";
import OpenModalButton from "../../OpenModalButton";
import DeleteGroupModal from "../../Groups/GroupDetails/DeleteGroupModal";


export default function EventDetails() {
  let dispatch = useDispatch();
  let {eventId} = useParams();
  const event = useSelector((state) => state.events[eventId])

  useEffect(() => {
    dispatch(getOneEvent(eventId))
  }, [dispatch])

  if(!event.price){
    return null
  }

  return (
    <div>
      <div>
        <NavLink to='/events'>Events</NavLink>
        <h1>{event.name}</h1>
        <h3>Hosted by </h3>
      </div>

      <OpenModalButton
        buttonText={"Delete"}
        modalComponent={<DeleteEventModal event={event} />}
      />
    </div>
  )

}
