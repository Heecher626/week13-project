import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Landing.css";

export default function Landing() {
  let user = useSelector(state => state.session.user)
  return (
    <div className="landing-container">
      <div className="top-box">
        <div className="top-text">
          <h1>The people platform- Where interests become friendships</h1>
          <p>Lorem Ipsum</p>
        </div>

        <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155965761295224842/image.png" />
      </div>
      <div>
        <h2>How Meetup works</h2>
        <p>Lorem Ipsum</p>
      </div>

      <div className="links-container">
        <div className="link-box">
          <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155965894833479691/image.png"></img>
          <h3><NavLink to="/groups">See all groups</NavLink></h3>
          <p>Lorem Ipsum</p>
        </div>

        <div className="link-box">
          <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155965944959615056/image.png"></img>
          <h3><NavLink to="/events">Find an event</NavLink></h3>
          <p>Lorem Ipsum</p>
        </div>

        <div className="link-box" >
          <img src="https://cdn.discordapp.com/attachments/324927814270713866/1155966097267367946/image.png"></img>
          { user ? <h3><NavLink to="/groups/new" disabled={!user}>Start a new group</NavLink> </h3> : <h3 style={{color:'lightgray'}}>
            Start a new group</h3>}
          <p>Lorem Ipsum</p>
        </div>
      </div>

      {!user && <div>
        <button >Join Meetup</button>
      </div>}
    </div>
  );
}
