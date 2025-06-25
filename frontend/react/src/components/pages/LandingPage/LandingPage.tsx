import styled from "styled-components";
import ContentContainer from "../../ContentContainer/ContentContainer";
import './landingpage.css'
const Header = styled.h1`
  color: white;
`;

export default function LandingPage() {
  return (
    <section className = "landing-section">
      <div className = "left-info">
        <Header>Landing Page</Header>
      </div>

      <div className = "line-separator">

      </div>

      <aside className = "login-aside">

      <ContentContainer></ContentContainer>
      </aside>

    </section>
  );
}
