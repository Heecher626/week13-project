import { useModal } from "../../../../context/Modal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../../../../store/events";

export default function DeleteEventModal({event}){
  const dispatch = useDispatch()
  const {closeModal} = useModal()
  const history = useHistory()

  const handleDelete = () => {
    history.push(`/groups/${event.groupId}`)
    dispatch(deleteEvent(event.id))
    closeModal()
  }

  return (
    <div className="delete-modal">
      <h1>Confirm Delete</h1>
      <h2>Are you sure you want to remove this event?</h2>
      <button onClick={handleDelete} className="confirm-delete">Yes (Delete Event)</button>
      <button onClick={closeModal} className="no-delete">No (Keep Event)</button>
    </div>
  )
}
