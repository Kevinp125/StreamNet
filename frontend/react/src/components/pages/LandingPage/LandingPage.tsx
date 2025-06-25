import styled from "styled-components";
import ContentContainer from "../../ContentContainer/ContentContainer";
import './landingpage.css'



export default function LandingPage() {
  return (
    <section className = "landing-section">
      <div className = "left-info">
        <h1>StreamNet</h1>
      </div>

      <aside className = "login-aside">

      <ContentContainer></ContentContainer>
      </aside>

    </section>
  );
}
