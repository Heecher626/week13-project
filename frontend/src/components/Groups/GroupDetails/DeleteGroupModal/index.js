import { useModal } from "../../../../context/Modal"
import { useHistory } from "react-router-dom"

export default function DeleteGroupModal({groupId}) {
  const {closeModal} = useModal()
  const history = useHistory()

  const handleDelete = () => {
    history.push('/groups')
    closeModal()
  }
  return (
    <div>
      <p>{groupId}</p>
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this group?</h2>
      <button onClick={handleDelete}>Yes (Delete Group)</button>
      <button onClick={closeModal}>No (Keep Group)</button>
    </div>
  )
}
