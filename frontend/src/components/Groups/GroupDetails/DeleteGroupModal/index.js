import { useModal } from "../../../../context/Modal"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { deleteGroup } from "../../../../store/groups"
import './DeleteGroup.css'

export default function DeleteGroupModal({groupId}) {
  const dispatch = useDispatch()
  const {closeModal} = useModal()
  const history = useHistory()

  const handleDelete = () => {
    history.push('/groups')
    dispatch(deleteGroup(groupId))
    closeModal()
  }
  return (
    <div className="delete-modal">
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this group?</h2>

      <button onClick={handleDelete} className="confirm-delete">Yes (Delete Group)</button>

      <button onClick={closeModal} className="no-delete">No (Keep Group)</button>
    </div>
  )
}
