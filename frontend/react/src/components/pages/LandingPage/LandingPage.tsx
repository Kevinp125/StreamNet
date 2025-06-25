import styled from "styled-components";
import './landingpage.css'



export default function LandingPage() {
  return (
    <section className = "landing-section">
      <div className = "left-info">
        <img src="/Streamnet.png" alt="" />
        <h1>StreamNet</h1>
        <p>Connecting streamers <br/> one collab at a time</p>
      </div>

      <aside className = "login-aside">
        <h2>Login / Signup </h2>

      </aside>

    </section>
  );
}
