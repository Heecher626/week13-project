import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./EventLanding.css";

let cardCreator = (event) => {
  let splitTime = event.startDate.split(" ");

  let preview = null;
  if (event.EventImages) {
    event.EventImages.forEach((image) => {
      if (image.preview) {
        preview = image.url;
      }
    });
    if (preview === null)
      preview =
        "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";
  } else {
    preview =
      event.previewImage == "No preview image"
        ? "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
        : event.previewImage;
  }
  return (
    <NavLink
      className="landing-event-card"
      key={event.id}
      to={`/events/${event.id}`}
    >
      <div key={event.id}>
        <div className="landing-event-card-upper">
          <img src={preview} />
          <div>
            <p>
              {splitTime[0]} · {splitTime[1]}
            </p>
            <h3>{event.name}</h3>
          </div>
        </div>
        <div className="landing-event-card-description">
          {event.description}
        </div>
      </div>
    </NavLink>
  );
}

export default function EventLanding() {
  const events = useSelector((state) => state.events);

  const pastEvents = [];
  const futureEvents = [];

  let currentDate = new Date();

  Object.values(events).forEach((event) => {
    let eventTime = new Date(event.startDate);
    if (eventTime < currentDate) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });

  pastEvents.sort((a, b) => {
    let aDate = new Date(a.startDate);
    let bDate = new Date(b.startDate);

    if (aDate > bDate) return -1;
    else return 1;
  });

  futureEvents.sort((a, b) => {
    let aDate = new Date(a.startDate);
    let bDate = new Date(b.startDate);

    if (aDate > bDate) return 1;
    else return -1;
  });



  return (
    <div className="event-landing-container">
      <div className="event-list-header">
        <span>
          <span className="events-bit">Events</span>
          {"   "}
          <NavLink to="/groups" className="groups-link">
            Groups
          </NavLink>
        </span>
        <h1>Events in Meetup</h1>
      </div>

      <div className="events-box">
        {futureEvents.map((event) => cardCreator(event))}
        {pastEvents.map((event) => cardCreator(event))}
      </div>
    </div>
  );
}
