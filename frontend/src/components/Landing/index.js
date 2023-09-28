import { NavLink } from "react-router-dom";
import './Landing.css'


export default function Landing(){
  return (

    <div className='landing-container'>

      <div className="top-box">

        <div className="top-text">
          <h1>The people platform- Where interests become friendships</h1>
          <p>Lorem Ipsum</p>
        </div>

        <img src='https://cdn.discordapp.com/attachments/324927814270713866/1155965761295224842/image.png'/>

      </div>
        <div>
          <h2>How Meetup works</h2>
          <p>Lorem Ipsum</p>
        </div>

      <div className="links-container">

        <div className="link-box">
          <img src='https://cdn.discordapp.com/attachments/324927814270713866/1155965894833479691/image.png'></img>
          <NavLink to='/groups'>See all groups</NavLink>
          <p>Lorem Ipsum</p>
        </div>

        <div className="link-box">
          <img src='https://cdn.discordapp.com/attachments/324927814270713866/1155965944959615056/image.png'></img>
          <NavLink to='/events'>Find an event</NavLink>
          <p>Lorem Ipsum</p>
        </div>

        <div className="link-box">
          <img src='https://cdn.discordapp.com/attachments/324927814270713866/1155966097267367946/image.png'></img>
          <NavLink to='/groups/new'>Start a new group</NavLink>
          <p>Lorem Ipsum</p>
        </div>
      </div>

    </div>
  )
}
