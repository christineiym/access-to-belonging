import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChutesLadders from "./ChutesLadders";
import GameInstructions from "./GameInstructions";

export default function PanelA() {
  const [showNext, setShowNext] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const checkScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      setShowNext(nearBottom);
    };

    checkScroll(); // In case already scrolled
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white font-sans text-black">
      {/* Purple Top Section */}
      <div className="relative top-0 bg-darkPurple text-white py-16 px-6 rounded-b-[50%] text-center shadow-lg">
        <h1 className="text-7xl font-extrabold">Access <br></br>To Belonging</h1>
        {/* <h2 className="text-5xl mt-2 font-semibold">To Belonging</h2> */}
      </div>

      {/* Teal Circle with Text */}
      <div className="absolute right-4 w-80 h-80 bg-tcatTeal text-black rounded-full flex items-center justify-center p-6 shadow-lg">
        <p className="font-medium">
          Read these real stories from the groundbreaking report <strong>Transportation Access for Everyone: Washington State</strong> by the Disability Mobility Initiative and Disability Rights Washington.
        </p>
      </div>

      {/* Game Introduction */}
      <div className="mt-80 px-6 pb-10">
        <h3 className="text-2xl font-bold text-black">
          Let’s play an active transportation game!
        </h3>
      </div>

      {/* TODO: change color scheme */}
      {/* Game Instructions*/}
      <GameInstructions></GameInstructions>

      {/* Game Interactive Area*/}
      <ChutesLadders></ChutesLadders>

      {/* Circle with text */}
      <div className="relative m-20 bottom+40 max-w-[400px] aspect-square rounded-full bg-purple-200 flex items-center justify-center text-center p-10 shadow-lg">
        <p className="text-lg sm:text-xl md:text-2xl font-medium">
          What makes a transportation system <strong>accessible, comfortable, and reliable</strong> for disabled community members? Let’s look next at what real transit riders across Washington have to say.
        </p>
      </div>

      {/* NEXT Button (animated in). */}
      <div
        className={`fixed bottom-6 right-6 transition-all duration-500 ${
          showNext ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <button
          onFocus={() => window.scrollTo(0, document.body.scrollHeight)}
          onClick={() => navigate('/access-to-belonging/stories')}
          className="bg-darkPurple text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
