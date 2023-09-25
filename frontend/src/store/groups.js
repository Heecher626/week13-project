import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = "groups/LOAD_GROUPS"

const load = (groups) => ({
  type: LOAD_GROUPS,
  groups
})

export const getGroups = () => async dispatch => {
  let response = await csrfFetch('/api/groups')

  if(response.ok){
    let groups = await response.json()
    console.log("🚀 ~ file: groups.js:16 ~ getGroups ~ groups:", groups)
    dispatch(load(groups.Groups))
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
    default:
      return state
  }
}

export default groupsReducer
