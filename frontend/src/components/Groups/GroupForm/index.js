import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../../store/groups";
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
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = true;
    setErrors({});
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
      history.push(`/groups/${groupId}`);
    }
  };

  return (
    <>
      <h1>BECOME AN ORGANIZER</h1>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <form onSubmit={handleSubmit}>
        <div>
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
        {errors.city && <p>{errors.city}</p>}
        <div>
          <input
            type="text"
            value={state}
            placeholder="Enter your state"
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        {errors.state && <p>{errors.state}</p>}
        <div>
          <h2>What will your group's name be?</h2>
          <h3>
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {errors.name && <p>{errors.name}</p>}
        <div>
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
          <input
            type="text"
            value={about}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>
        {errors.about && <p>{errors.about}</p>}

        <h2>Final steps...</h2>

        <div>
          <h3>Is this an in person or online group?</h3>
          <select onChange={(e) => setType(e.target.value)} required>
            <option value={"In person"}>In person</option>
            <option value={"Online"}>Online</option>
          </select>
        </div>
        {errors.type && <p>{errors.type}</p>}

        <h3>Is this group private or public?</h3>
        <div>
          <select onChange={(e) => setIsPrivate(e.target.value)} required>
            <option value={false}>Public</option>
            <option value={true}>Private</option>
          </select>
        </div>
        {errors.isPrivate && <p>{errors.isPrivate}</p>}
        {/* <div>
          <h3>
            Please add an image url for your group below:
          </h3>
          <input
            type="text"
            value={isPrivate}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}*/}
        <button type="submit">Create Group</button>
      </form>
    </>
  );
}
