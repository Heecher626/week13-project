import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { createEvent } from "../../../store/events";



export default function EventForm() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {groupId} = useParams()
  const [name, setName] = useState('')
  const [type, setType] = useState('In person')
  const [isPrivate, setIsPrivate] = useState(false)
  const [price, setPrice] = useState(0)
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    let success = true;
    setErrors({})
    let data = await dispatch(
      createEvent({
        name,
        type,
        private: isPrivate,
        price,
        startDate,
        endDate,
        description,
        capacity: 1
      }, groupId)
    ).catch(async (res) => {
      const data = await res.json()
      if(data && data.errors) {
        setErrors(data.errors)
        success = false
      }
    })
    if(success) {
      let eventId = data.id
      history.push(`/events/${eventId}`)
    }
  }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>What is the name of your event?</h2>
          <input
          type="text"
          value={name}
          placeholder="Event Name"
          onChange={(e) => setName(e.target.value)}
          required
          />
        </div>
        <div>
          <h2>Is this an in person or online event?</h2>
          <select
          placeholder="(select one)"
          required
          onChange={(e) => setType(e.target.value)}>
            <option value={"In person"}>In person</option>
            <option value={"Online"}>Online</option>
          </select>
        </div>

        <div>
          <h2>Is this event private or public?</h2>
          <select
           placeholder="(select one)"
           onChange={(e) => setIsPrivate(e.target.value)}
           required>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </div>

        <div>
          <h2>What is the price for your event?</h2>
          <input
          type='number'
          value={price}
          onChange={(e) => setPrice(e.target.value)}/>
        </div>

        <div>
          <h2>When does your event start?</h2>
          <input
           type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <h2>When does your event end?</h2>
          <input
           type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <h2>Please describe your event:</h2>
          <input
           type='text'
           value={description}
           onChange={(e) => {setDescription(e.target.value)}}
           placeholder="Please include at least 30 characters"
          />
        </div>
        <button type='submit'>Create Event</button>
      </form>
    </div>
  )
}
