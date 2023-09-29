import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOneGroup } from "../../../store/groups";
import { useEffect, useState } from "react";
import DeleteGroupModal from "./DeleteGroupModal";
import OpenModalButton from "../../OpenModalButton";
import "./GroupDetails.css";

export default function GroupDetails() {
  let dispatch = useDispatch();
  const [isOwner, setIsOwner] = useState(false);
  let { groupId } = useParams();
  const group = useSelector((state) => state.groups[groupId]);
  const session = useSelector((state) => state.session);

  useEffect(() => {
    dispatch(getOneGroup(groupId));
  }, [dispatch]);

  if (!group.Organizer) {
    return null;
  }

  if (session.user) {
    if (session.user.id === group.organizerId && isOwner !== true) {
      setIsOwner(true);
      console.log("isOwner? :", isOwner);
    }
  }

  return (
    <div className="group-details-container">
      <div>
        <div>
          <NavLink to="/groups">Groups</NavLink>
        </div>

        <div className="upper-container">
          <img src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg" />
          <div className="text-details">
            <h1>{group.name}</h1>
            <h4>{group.location}</h4>
            <span>
              <h4>Link to Events · {group.private ? "Private" : "Public"}</h4>
            </span>
            <h4>
              Organized by {group.Organizer.firstName}{" "}
              {group.Organizer.lastName}
            </h4>

            {isOwner && (
              <div className="buttons-container">
                <NavLink to={`/groups/${groupId}/events/new`}>
                  <button>Create event</button>
                </NavLink>
                <NavLink to={`/groups/${groupId}/edit`}>
                  <button>Update</button>
                </NavLink>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteGroupModal groupId={groupId} />}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h2>Organizer</h2>
        </div>
      </div>
    </div>
  );
}
