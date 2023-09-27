import { csrfFetch } from "./csrf";

export const LOAD_EVENTS = 'events/LOAD_EVENTS'

const load = (events) => ({
  type: LOAD_EVENTS,
  events
})

export const getEvents = () => async dispatch => {
  let response = await csrfFetch('/api/events')

  if(response.ok){
    let events = await response.json()
    dispatch(load(events))
  }
}

const initialState = {}

const eventsReducer = (state = initialState, action) => {
  switch(action.type){
    case(LOAD_EVENTS):
      let newEvents = {}
      action.events.forEach(event => {
        newEvents[event.id] = event
      })
      return {
        ...state,
        newEvents
      }
    default:
      return state
  }

}

export default eventsReducer
