// import "./landingpage.css";

export default function LandingPage() {
  return (
    <section className="flex h-screen items-center">
      <div className="flex flex-2 flex-col items-center justify-center">
        <img src="/Streamnet.png" alt="" className="h-96 w-[500px]" />{" "}
        {/* width still arbitrary */}
        <h1 className="text-center text-6xl text-white">StreamNet</h1>
        <p className="text-center text-2xl text-white">
          Connecting streamers <br /> one collab at a time
        </p>
      </div>

      <aside className="bg-light-purple flex h-full flex-1 flex-col items-center justify-center">
        <h2 className="text-2xl text-white">Login / Signup</h2>
      </aside>
    </section>
  );
}
