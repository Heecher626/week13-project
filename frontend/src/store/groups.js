import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = "groups/LOAD_GROUPS"
export const ADD_GROUP = "groups/ADD_GROUP"

const load = (groups) => ({
  type: LOAD_GROUPS,
  groups
})

const add = group => ({
  type: ADD_GROUP,
  group
})

export const getGroups = () => async dispatch => {
  let response = await csrfFetch('/api/groups')

  if(response.ok){
    let groups = await response.json()
    dispatch(load(groups.Groups))
  }
}

export const getOneGroup = (groupId) => async dispatch => {
  let response = await csrfFetch(`/api/groups/${groupId}`)

  if(response.ok){
    let group = await response.json()
    dispatch(add(group))

  } else {
    console.log('error grabbing one group')
  }
}

const initialState = {};

const groupsReducer = (state = initialState, action) => {
  switch(action.type) {
    case (LOAD_GROUPS):
      let newGroups = {}
      action.groups.forEach(group => {
        newGroups[group.id] = group
      })
      return {
        ...state,
        ...newGroups
      }
    case (ADD_GROUP):
      let newState = {...state, groups: {...state.groups, [action.group.id]: action.group}}
      return newState
    default:
      return state
  }
}

export default groupsReducer
