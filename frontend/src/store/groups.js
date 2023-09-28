import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = "groups/LOAD_GROUPS"
export const ADD_GROUP = "groups/ADD_GROUP"
export const DELETE_GROUP = "groups/DELETE_GROUP"
export const CREATE_GROUP = 'groups/CREATE_GROUP'

const load = (groups) => ({
  type: LOAD_GROUPS,
  groups
})

const add = group => ({
  type: ADD_GROUP,
  group
})

const del = groupId => ({
  type: DELETE_GROUP,
  groupId
})

const create = group => ({
  type: CREATE_GROUP,
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

export const deleteGroup = (groupId) => async dispatch => {
  let response = await csrfFetch(`/api/groups/${groupId}`, {method: 'DELETE'})

  if (response.ok){
    dispatch(del(groupId))
  }
}

export const createGroup = group => async dispatch => {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(group)
  }
  let response = await csrfFetch('/api/groups', options)

  const data = await response.json()
  dispatch(add(data))
  console.log("🚀 ~ file: groups.js:70 ~ createGroup ~ data:", data)
  return data
}

export const updateGroup = (group, groupId) => async dispatch => {
  let options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(group)
  }
  let response = await csrfFetch(`/api/groups/${groupId}`, options)

  const data = await response.json()
  dispatch(add(data))
  return response
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
      let newState = {...state, [action.group.id]: action.group}
      return newState

    case (DELETE_GROUP):
      let updatedState = {...state}
      delete state[action.groupId]
    default:
      return state
  }
}

export default groupsReducer
