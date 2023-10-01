import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { addEventImage, createEvent } from "../../../store/events";

import './EventForm.css'


export default function EventForm() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {groupId} = useParams()
  const group = useSelector((state) => state.groups[groupId])
  const [name, setName] = useState('')
  const [type, setType] = useState('In person')
  const [isPrivate, setIsPrivate] = useState(false)
  const [price, setPrice] = useState('0')
  const [startDate, setStartDate] = useState(undefined)
  const [endDate, setEndDate] = useState(undefined)
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    let success = true;
    setErrors({})
    if(preview){
      if(!preview.endsWith('jpg') && !preview.endsWith('png')){
        setErrors({preview: 'Image URL needs to end in jpg or png.'})
        return
      }
    }
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
      if(preview){
        dispatch(addEventImage(eventId, preview))
      }
      history.push(`/events/${eventId}`)
    }
  }


  return (
    <div className="event-form-container">
      <h1>Create an event for {group.name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>What is the name of your event?</h2>
          <input
          className="width-large"
          type="text"
          value={name}
          placeholder="Event Name"
          onChange={(e) => setName(e.target.value)}
          required
          />
        </div>
        {errors.name && <p className="errors">{errors.name}</p>}
        <div className="top-border">
          <h2>Is this an in person or online event?</h2>
          <select
          className="width-small"
          placeholder="(select one)"
          required
          onChange={(e) => setType(e.target.value)}>
            <option value={"In person"}>In person</option>
            <option value={"Online"}>Online</option>
          </select>
        </div>
        {errors.type && <p className="errors">{errors.type}</p>}
        <div>
          <h2>Is this event private or public?</h2>
          <select
          className="width-small"
           placeholder="(select one)"
           onChange={(e) => setIsPrivate(e.target.value)}
           required>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </div>
        {errors.isPrivate && <p className="errors">{errors.isPrivate}</p>}
        <div>
          <h2>What is the price for your event?</h2>
          <i class="fa-solid fa-dollar-sign"></i>
          {' '}
          <input
          className="price-box"
          type='number'
          value={price}
          onChange={(e) => setPrice(e.target.value)}/>
        </div>
        {errors.price && <p className="errors">{errors.price}</p>}
        <div className="top-border">
          <h2>When does your event start?</h2>
          <input
          className="width-medium"
           type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        {errors.startDate && <p className="errors">{errors.startDate}</p>}
        <div>
          <h2>When does your event end?</h2>
          <input
          className="width-medium"
           type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        {errors.endDate && <p className="errors">{errors.endDate}</p>}
        <div className="top-border">
          <h2>Please add an image url for your event below</h2>
          <input
          className="width-large"
            type='text'
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        {errors.preview && <p className="errors">{errors.preview}</p>}
        <div className="top-border">
          <h2>Please describe your event:</h2>
          <textarea
            className="big-boy"
           type='text'
           value={description}
           onChange={(e) => {setDescription(e.target.value)}}
           placeholder="Please include at least 30 characters"
          />
        </div>
        {errors.description && <p className="errors">{errors.description}</p>}
        <button type='submit' id='create-event-button'>Create Event</button>
      </form>
    </div>
  )
}
