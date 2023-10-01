import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOneEvent } from "../../../store/events";
import DeleteEventModal from "./DeleteEventModal";
import OpenModalButton from "../../OpenModalButton";
import { getOneGroup } from "../../../store/groups";

import "./EventDetails.css";

export default function EventDetails() {
  let dispatch = useDispatch();
  let { eventId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const event = useSelector((state) => state.events[eventId]);
  const allGroups = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(getOneEvent(eventId))
      .then(() => dispatch(getOneGroup(event.groupId)))
      .then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) {
    return null;
  }

  const group = allGroups[event.groupId];
  const splitStart = event.startDate.split(" ");
  const splitEnd = event.endDate.split(" ");

  let eventPreview = null;
  let groupPreview = null;
  event.EventImages.forEach((image) => {
    if (image.preview) {
      eventPreview = image.url;
    }
  });
  group.GroupImages.forEach((image) => {
    if (image.preview) {
      groupPreview = image.url;
    }
  });
  if (eventPreview === null)
    eventPreview =
      "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";
  if (groupPreview === null)
    groupPreview =
      "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg";

  return (
    <div className="event-detail">
      <div className="event-detail-heading">
        <NavLink to="/events">{"< Events"}</NavLink>
        <h1>{event.name}</h1>
        <h3>
          Hosted by {group.Organizer.firstName} {group.Organizer.lastName}
        </h3>
      </div>

      <div className="event-detail-body">
        <div className="event-detail-upper">
          <img src={eventPreview} />
          <div className="event-detail-cards">
            <div className="group-card">
              <img src={groupPreview} />
              <div>
                <h2>{group.name}</h2>
                <h3>{group.private ? "Private" : "Public"}</h3>
              </div>
            </div>
            <div className="event-info-card">
              <div className="event-times">
                <i class="fa-sharp fa-solid fa-clock"></i>
                <div>
                  <div>
                    START{" "}
                    <span>
                      {splitStart[0]} · {splitStart[1]}
                    </span>
                  </div>
                  <div>
                    END{" "}
                    <span>
                      {splitEnd[0]} · {splitEnd[1]}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <i class="fa-solid fa-dollar-sign"></i>
                <div>{event.price > 0 ? event.price.toFixed(2) : "FREE"}</div>
              </div>
              <div>
                <i class="fa-solid fa-map-pin"></i>
                <div>{event.type}</div>
                <OpenModalButton
                  buttonText={"Delete"}
                  modalComponent={<DeleteEventModal event={event} />}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="event-detail-lower">
          <h1>Details</h1>
          <h3>{event.description}</h3>
        </div>
      </div>

      <OpenModalButton
        buttonText={"Delete"}
        modalComponent={<DeleteEventModal event={event} />}
      />
    </div>
  );
}
