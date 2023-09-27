import { useDispatch, useSelector } from "react-redux"
import { getGroups } from "../../../store/groups"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"

export default function EventLanding() {
  const events = useSelector(state => state.events)
  return null
}
