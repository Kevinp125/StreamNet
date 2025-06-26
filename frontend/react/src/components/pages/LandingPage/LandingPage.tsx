import styled from "styled-components";
// import "./landingpage.css";

export default function LandingPage() {
  return (
    <section className="flex h-screen items-center">
      <div className="flex-2 flex flex-col justify-center items-center">
        <img src="/Streamnet.png" alt="" className="h-96 w-[500px]" /> {/* width still arbitrary */}
        <h1 className="text-6xl text-white text-center">StreamNet</h1>
        <p className="text-2xl text-white text-center">
          Connecting streamers <br /> one collab at a time
        </p>
      </div>

      <aside className="flex-1 h-full bg-purple-300 flex flex-col justify-center items-center">
        <h2 className="text-2xl text-white">Login / Signup</h2>
      </aside>
    </section>
  );
}
