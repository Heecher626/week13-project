import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup, addImageThunk } from "../../../store/groups";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import "./GroupForm.css";

export default function GroupForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("In person");
  const [isPrivate, setIsPrivate] = useState(false);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = true;
    setErrors({});
    if(preview){
      if(!preview.endsWith('jpg') && !preview.endsWith('png')){
        setErrors({preview: 'Image URL needs to end in jpg or png.'})
        return
      }
    }

    let data = await dispatch(
      createGroup({
        city,
        state,
        name,
        about,
        type,
        private: isPrivate,
      })
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
        success = false;
      }
    });
    if (success) {
      let groupId = data.id;
      if(preview){
        dispatch(addImageThunk(groupId, preview));
      }
      history.push(`/groups/${groupId}`);
    }
  };

  return (
    <div className="group-form-container">
      <h1>BECOME AN ORGANIZER</h1>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <form onSubmit={handleSubmit}>
        <div className="top-border">
          <h2>First, set your group's location</h2>
          <h3>
            Meetup groups meet locally, in person and type. We'll connect you
            with people in your area, and more can join you type.
          </h3>
          <input
            type="text"
            value={city}
            placeholder="Enter your city"
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        {errors.city && <p className="errors">{errors.city}</p>}
        <div>
          <input
            type="text"
            value={state}
            placeholder="Enter your state"
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>

        {errors.state && <p className="errors">{errors.state}</p>}
        <div className="top-border">
          <h2>What will your group's name be?</h2>
          <h3>
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </h3>
          <input
            type="text"
            value={name}
            placeholder="What is your group name?"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {errors.name && <p className="errors">{errors.name}</p>}
        <div className="top-border">
          <h2>Now describe what your group will be about</h2>
          <h3>
            People will see this when we promote your group, but you'll be able
            to add to it later, too.
          </h3>
          <ol>
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            id="about-input"
            type="textarea"
            value={about}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>
        {errors.about && <p className="errors">{errors.about}</p>}


        <div className="top-border">
          <h2>Final steps...</h2>
          <h3>Is this an in person or online group?</h3>
          <select onChange={(e) => setType(e.target.value)} required>
            <option value={"In person"}>In person</option>
            <option value={"Online"}>Online</option>
          </select>
        </div>
        {errors.type && <p className="errors">{errors.type}</p>}

        <h3>Is this group private or public?</h3>
        <div>
          <select onChange={(e) => setIsPrivate(e.target.value)} required>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </div>
        {errors.isPrivate && <p className="errors">{errors.isPrivate}</p>}
        <div>
          <h3>Please add an image url for your group below:</h3>
          <input
            type="text"
            value={preview}
            placeholder="Image Url"
            onChange={(e) => setPreview(e.target.value)}
          />
        </div>
        {errors.preview && <p className="errors">{errors.preview}</p>}
        <div className="top-border button-container">
          <button type="submit" id="create-group-button">Create Group</button>
        </div>
      </form>
    </div>
  );
}
