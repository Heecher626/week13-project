import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SignupFormModal from "../SignupFormModal";
import OpenModalButton from "../OpenModalButton";
import "./Landing.css";

export default function Landing() {
  let user = useSelector(state => state.session.user)
  return (
    <div className="landing-container">
      <div className="top-box">
        <div className="top-text">
          <h1>The people platform- Where interests become friendships</h1>
          <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
        </div>

        <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155965761295224842/image.png" />
      </div>
      <div className="landing-middle">
        <h2>How Meetup works</h2>
        <p>People use Meetup to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
      </div>

      <div className="links-container">
        <div className="link-box">
          <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155965894833479691/image.png"></img>
          <h3><NavLink to="/groups">See all groups</NavLink></h3>
          <p>See who's hosting local events for all the things you love</p>
        </div>

        <div className="link-box">
          <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155965944959615056/image.png"></img>
          <h3><NavLink to="/events">Find an event</NavLink></h3>
          <p>See events near you, there's plenty going on</p>
        </div>

        <div className="link-box" >
          <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155966097267367946/image.png"></img>
          { user ? <h3><NavLink to="/groups/new" disabled={!user}>Start a new group</NavLink> </h3> : <h3 style={{color:'lightgray'}}>
            Start a new group</h3>}
          <p>Create your own Meetup group, and draw from a community of millions</p>
        </div>
      </div>

      {!user && <div className="sign-up-button-div">
        <OpenModalButton
          buttonText="Join Meetup"
          modalComponent={<SignupFormModal />}
        />
      </div>}
    </div>
  );
}
