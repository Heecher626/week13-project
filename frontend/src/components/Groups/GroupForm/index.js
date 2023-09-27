import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { createGroup } from "../../../store/groups";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function GroupForm() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    e.preventDefault();
      let splitLocation = location.split(', ')
      let city = splitLocation[0]
      let state = splitLocation[1]
      setErrors({});
      return dispatch(
        createGroup({
          city,
          state,
          name,
          about,
          type,
          private: isPrivate,
        })
      )
      .then((e) => history.push('/groups'))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });


  };

  return (
    <>
      <h1>BECOME AN ORGANIZER</h1>
      <h2>We'll walk you through a few steps to build your local community</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>First, set your group's location</h2>
          <h3>Meetup groups meet locally, in person and type. We'll connect you with people in your area, and more can join you type.</h3>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        {errors.location && <p>{errors.location}</p>}
        <div>
          <h2>What will your group's name be?</h2>
          <h3>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {errors.name && <p>{errors.name}</p>}
        <div>
          <h2>What will your group's name be?</h2>
          <h3>People will see this when we promote your group, but you'll be able to add to it later, too.</h3>
          <ol>
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>
        {errors.about && <p>{errors.about}</p>}

        <h2>Final steps...</h2>

        <div>
          <h3>Is this an in person or online group?</h3>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        {errors.type && <p>{errors.type}</p>}

        <h3>Is this group private or public?</h3>
        <div>
          <input
            type="text"
            value={isPrivate}
            onChange={(e) => setIsPrivate(e.target.value)}
            required
          />
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
