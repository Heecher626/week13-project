import { csrfFetch } from "./csrf";

export const LOAD_EVENTS = 'events/LOAD_EVENTS'
export const ADD_EVENT = 'events/ADD_EVENT'
export const DELETE_EVENT = "events/DELETE_EVENT"

const load = (events) => ({
  type: LOAD_EVENTS,
  events
})

const add = (event) => ({
  type: ADD_EVENT,
  event
})

const del = (eventId) => ({
  type: DELETE_EVENT,
  eventId
})

export const getEvents = () => async dispatch => {
  let response = await csrfFetch('/api/events')

  if(response.ok){
    let events = await response.json()
    dispatch(load(events.Events))
  }
}

export const getOneEvent = (eventId) => async dispatch => {
  let response = await csrfFetch(`/api/events/${eventId}`)

  if(response.ok){
    let event = await response.json()
    dispatch(add(event))
  }
}

export const deleteEvent = (eventId) => async dispatch => {
  let response = await csrfFetch(`/api/events/${eventId}`, {method:'DELETE'})

  if(response.ok){
    dispatch(del(eventId))
  }
}

export const getEventsByGroup = (groupId) => async dispatch => {
  let response = await csrfFetch(`/api/groups/${groupId}/events`)

  if(response.ok){
    let events = await response.json()
    dispatch(load(events.Events))
  }
}

export const createEvent = (event, groupId) => async dispatch => {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  }

  let response = await csrfFetch(`/api/groups/${groupId}/events`, options)
  const data = await response.json()
  dispatch(add(data))
  return data
}


const initialState = {}

const eventsReducer = (state = initialState, action) => {
  switch(action.type){
    case(LOAD_EVENTS):
      let newEvents = {...state}
      action.events.forEach(event => {
        newEvents[event.id] = event
      })
      return newEvents;
    case(ADD_EVENT):
      let newState = {...state, [action.event.id]: action.event}
      return newState;
    case(DELETE_EVENT):
      let updatedState = {...state}
      delete updatedState[action.eventId]
      return updatedState;
    default:
      return state
  }

}

export default eventsReducer
