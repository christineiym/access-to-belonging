import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PanelB() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      setShowButtons(nearBottom);
    };

    checkScroll(); // In case already scrolled
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black font-sans px-6 py-12">
      <h1 className="text-4xl font-extrabold text-purpleMain text-center">Community Stories</h1>
      <h2 className="text-xl font-semibold text-center mt-2">Feedback about Access to Belonging</h2>

      {/* Amy's Story Section */}
      <div className="mt-12 space-y-6 max-w-4xl mx-auto">
        <div>
          <h3 className="text-xl font-bold text-purpleMain">Amy <span className="text-purple-700 font-normal">North Bend, WA</span></h3>
          <p className="mt-1">
            Amy usually drives, but after an injury she primarily used{" "}
            <strong>public transportation</strong> for several months.
          </p>
        </div>

        <div className="bg-purple-200 p-4 rounded font-semibold max-w-sm">
          Infrequent transit impacts connectivity to daily needs and services.
        </div>

        <blockquote className="italic border-l-4 border-tealCircle pl-4">
          “I had to attend a <strong>90-minute meeting</strong> in Carnation, 20 minutes from where I live, and, using the local transportation, to be picked up at home, taken to the meeting, picked up after the meeting and brought back home took <strong>seven and a half hours door to door</strong>. I had to attend those meetings but doing so took up my entire day because the buses are so limited and infrequent.”
        </blockquote>

        <div>
          <img src="https://via.placeholder.com/400x250.png?text=North+Bend+Walksheds" alt="North Bend Walksheds" className="border-4 border-purple-700 rounded-md" />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div
        className={`fixed bottom-6 left-6 right-6 flex justify-between items-center transition-all duration-500 ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-purpleMain text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          ← Back
        </button>
        <button
          onClick={() => navigate('/routes-and-timing')}
          className="bg-purpleMain text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export function oldPanelB() {
  return (
    <div className="bg-white text-black font-sans px-6 py-12 space-y-12">
      <h1 className="text-4xl font-extrabold text-purpleMain text-center">Community Stories</h1>
      <h2 className="text-xl font-semibold text-center">Feedback about Access to Belonging</h2>

      <div className="space-y-10">
        {/* Amy's Story */}
        <div>
          <h3 className="text-xl font-bold text-purpleMain">Amy <span className="text-black font-normal">North Bend, WA</span></h3>
          <p className="mt-1">
            Amy usually drives, but after an injury she primarily used <strong>public transportation</strong> for several months.
          </p>
          <p className="mt-2 italic border-l-4 border-tealCircle pl-4">
            “I had to attend a <strong>90-minute meeting</strong> in Carnation... took <strong>seven and a half hours door to door</strong>...”
          </p>
          <div className="mt-2 bg-purple-100 p-4 rounded text-black font-semibold max-w-sm">
            Infrequent transit impacts connectivity to daily needs and services.
          </div>
        </div>

        {/* Deborah's Story */}
        <div>
          <h3 className="text-xl font-bold text-purpleMain">Deborah <span className="text-black font-normal">Clarkston, WA</span></h3>
          <p className="mt-1">
            Deborah is from Clarkston, WA and primarily <strong>relies on paratransit</strong>... they lack <strong>accessible pedestrian signals</strong> and curb ramps.
          </p>
          <p className="mt-2 italic border-l-4 border-tealCircle pl-4">
            “The biggest issue here is actually a lack of sidewalks to get to the public transit...”
          </p>
          <div className="mt-2 bg-purple-100 p-4 rounded text-black font-semibold max-w-sm">
            Inaccessible sidewalks impact how disabled travellers plan their trips.
          </div>
        </div>

        {/* Nick's Story */}
        <div>
          <h3 className="text-xl font-bold text-purpleMain">Nick <span className="text-black font-normal">Liberty Lake, WA</span></h3>
          <p className="mt-1">
            Nick wishes there were <strong>tactile markings</strong>... so he could navigate from one end to the other without getting disoriented.
          </p>
          <p className="mt-2 italic border-l-4 border-tealCircle pl-4">
            “I used to drive, and the thing I don’t think people...”
          </p>
          <div className="mt-2 bg-purple-100 p-4 rounded text-black font-semibold max-w-sm">
            A lack of tactile wayfinding results in inaccurate navigation.
          </div>
        </div>
      </div>
    </div>
  );
}