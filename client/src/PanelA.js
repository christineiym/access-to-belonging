import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PanelA() {
  const [showNext, setShowNext] = useState(false);
  const navigate = useNavigate();

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
      <div className="bg-purpleMain text-white py-16 px-6 rounded-b-[50%] text-center">
        <h1 className="text-5xl font-extrabold">Access</h1>
        <h2 className="text-3xl mt-2 font-semibold">To Belonging</h2>
      </div>

      {/* Teal Circle with Text */}
      <div className="absolute right-4 top-[200px] w-72 h-72 bg-tealCircle text-black rounded-full flex items-center justify-center p-6 shadow-lg">
        <p className="text-sm font-medium">
          Read these real stories from the groundbreaking report <strong>Transportation Access for Everyone: Washington State</strong> by the Disability Mobility Initiative and Disability Rights Washington.
        </p>
      </div>

      {/* Bottom Call to Action */}
      <div className="mt-80 px-6 pb-40">
        <h3 className="text-2xl font-bold text-black">
          Let’s play an active transportation game!
        </h3>
      </div>

      {/* NEXT Button (animated in). */}
      <div
        className={`fixed bottom-6 right-6 transition-all duration-500 ${
          showNext ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* <a href="/stories">
          <button className="bg-purpleMain text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400">
            Next →
          </button>
        </a> */}
        <button
          onClick={() => navigate('/stories')}
          className="bg-purpleMain text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
