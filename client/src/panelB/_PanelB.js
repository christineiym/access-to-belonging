import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Story from "./Story";

export default function PanelB() {
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
    <div className="relative min-h-screen bg-white font-sans text-black gap-10">
      {/* Header */}
      <div className="text-center pt-5 m-10">
        <h1 className="text-5xl font-extrabold text-darkPurple">Community Stories</h1>
        <p className="text-2xl font-semibold mt-2">Feedback about Access to Belonging</p>
      </div>

      <Story name={"Amy"} 
        location={"North Bend, WA"} 
        summary={<>Amy usually drives, but after an injury she primarily used <strong>public transportation</strong> for several months.</>}
        quote={<>“I had to attend a <strong>90-minute meeting</strong> in Carnation, 20 minutes from where I live, and, using the local transportation, to be picked up at home, taken to the meeting, picked up after the meeting and brought back home took <strong>seven and a half hours door to door</strong>. I had to attend those meetings but doing so took up my entire day because the buses are so limited and infrequent.”</>}
        takeaway={"Infrequent transit impacts connectivity to daily needs and services."}
        imageSource={"/access-to-belonging/walksheds-north_bend.png"}
        imageAltText={"North Bend Walksheds"}
      />

      <Story name={"Deborah"} 
        location={"Clarkston, WA"} 
        summary={<>Deborah primarily <strong>relies on paratransit</strong>. Intersections feel more dangerous because they lack <strong>accessible pedestrian signals</strong> and curb ramps.</>}
        quote={<>“The biggest issue here is actually a lack of sidewalks to get to the public transit. I do like using public transit when I can because [there is] a bit more control than you would with paratransit.”</>}
        takeaway={"Inaccessible sidewalks impact how disabled travellers plan their trips."}
        imageSource={"/access-to-belonging/walksheds-clarkston.png"}
        imageAltText={"Clarkston Walksheds"}
      />

      <Story name={"Nick"} 
        location={"Liberty Lake, WA"} 
        summary={<>Nick wishes there were <strong>tactile markings</strong> at the transit hubs in Spokane - even just a carpet that ran along the main path through the interior of the station - so he could navigate from one end to the other without getting disoriented.</>}
        quote={<>“I used to drive, and the thing I don't think people who can drive understand about taking the bus is how much longer it takes to go places.”</>}
        takeaway={"A lack of tactile wayfinding results in inaccurate navigation."}
        imageSource={"/access-to-belonging/walksheds-liberty_lake.png"}
        imageAltText={"Liberty Lake Walksheds"}
      />

      {/* SDF link */}
      <div className="w-80 h-80 bg-purple-200 text-black rounded-full flex items-center justify-center p-6 shadow-lg mt-10 ml-10">
        <p className="text-2xl font-medium">
            Add your story — join us in-person or virtually at <a href="https://tcat.cs.washington.edu/sdf25/"
            className="font-bold text-blue-800 hover:text-blue-700 decoration-2 hover:underline focus:outline-hidden focus:underline opacity-90"
            >our booth</a> in the 2025 Seattle Design Festival!
        </p>
      </div>

      {/* Decorative Teal Semicircle (include??) */}
      <div className="absolute top+[0px] right-12 w-80 h-40 bg-tcatTeal rounded-t-full shadow-lg m-10"></div>

      {/* Navigation Buttons; add "flex-row-reverse" after flex to reverse tab order */}
      <div
        className={`fixed left-6 right-6 bottom-6 flex justify-between items-center transition-all duration-500 ${showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <button
          onFocus={() => window.scrollTo(0, document.body.scrollHeight)}
          onClick={() => navigate('/access-to-belonging/')}
          className="bg-darkPurple text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          ← Back
        </button>
        <button
          onFocus={() => window.scrollTo(0, document.body.scrollHeight)}
          onClick={() => navigate('/access-to-belonging/routes-and-timing')}
          className="bg-darkPurple text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Next →
        </button>
      </div>
    </div>
  );
}