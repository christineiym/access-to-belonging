import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import YarnBoard from "./YarnBoard";

export default function PanelC() {
  const [showBack, setShowBack] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const checkScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      setShowBack(nearBottom);
    };

    checkScroll(); // In case already scrolled
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="relative bg-white min-h-screen font-sans text-black">
      {/* Header */}
      <div className="text-center pt-5 m-10">
        <h1 className="text-5xl font-extrabold text-darkPurple">Routes and Timing</h1>
        <p className="text-2xl mt-2 font-semibold">What travel barriers do you experience?</p>
      </div>

      {/* Instructional Box */}
      <div className="flex justify-center mt-6">
        <div className="bg-darkPurple text-white px-6 py-4 rounded-md max-w-2xl grid grid-cols-2 gap-8 text-left">
          <div>
            <p className="font-bold text-xl">How To</p>
            <p className="text-normal">What affects you as a traveller? Connect how you identify with what you experience in the following activity!</p>
          </div>
          <div>
            <p className="font-bold text-xl">Connect</p>
            <p className="text-normal">Connect the paths between barriers and scenarios.</p>
          </div>
        </div>
      </div>

      {/* Interactive Yarnboard (table?) */}
      <YarnBoard></YarnBoard>

      {/* Travel Time Section */}
      <div className="text-center mt-20">
        <p className="text-2xl font-semibold">How long does it take to get from Carnation to Redmond?</p>

        <div className="flex justify-center gap-10 mt-6">
          <div className="bg-tcatTeal rounded-full w-36 h-36 flex flex-col justify-center items-center text-xl font-bold">
            <p className="font-bold">BY CAR:</p>
            <p>23 min</p>
          </div>
          <div className="bg-tcatTeal rounded-full w-36 h-36 flex flex-col justify-center items-center text-xl font-bold">
            <p className="font-bold">BY BUS:</p>
            <p>2+ hours</p>
          </div>
        </div>
      </div>

      {/* QR and Map Image */}
      <div className="relative m-10 px-4 flex justify-center">
        <img
          src="https://picsum.photos/600/400"
          alt="Map from Carnation to Redmond"
          className="rounded-md max-w-full border-4 border-purple-700"
        />
        {/* <div className="absolute top-6 right-6 bg-white p-1 rounded shadow">
          <img
            src="/422844d4-372a-4960-bc30-f2b23a35a92c.png"
            alt="QR code"
            className="w-20 h-20 object-contain"
          />
        </div> */}
      </div>

      {/* Back Button (bottom-left) */}
      <div
        className={`fixed bottom-6 left-6 transition-all duration-500 ${
          showBack ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <button
          onFocus={() => window.scrollTo(0, document.body.scrollHeight)}
          onClick={() => navigate('/access-to-belonging/stories')}
          className="bg-purple-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};