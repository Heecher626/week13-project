import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className='sessionContainer'>
        <NavLink to='/groups/new'>
          Start a new group
        </NavLink>
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <li className="sessionContainer">
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li >
    );
  }

  return (
    <div className="navContainer">
      <div>
        <NavLink exact to="/">
          <img src='https://cdn.discordapp.com/attachments/324927814270713866/1157045644599513188/image.png?ex=65172e3a&is=6515dcba&hm=2a25009610bc62a43d301df70a8b6b4003a23602ac2467916c1d6b0dec260c5c&'/>
        </NavLink>
      </div>
      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
