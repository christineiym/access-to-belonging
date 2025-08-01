import { useState, useEffect, useRef } from "react";
import "./cardFlip.css";

// what about no persistence?
const getStorage = () => {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage : localStorage;
  } catch {
    return localStorage;
  }
};

export default function FlipCardStack({ type, allCards }) {
  const storage = getStorage();
  const storageKey = `${type.toLowerCase()}Deck`;

  const [remaining, setRemaining] = useState([]);
  const [drawn, setDrawn] = useState([]);
  const [animatingCard, setAnimatingCard] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const drawZoneRef = useRef(null);

  useEffect(() => {
    const stored = storage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      setRemaining(parsed.remaining || []);
      setDrawn(parsed.drawn || []);
    } else {
      setRemaining(allCards);
      setDrawn([]);
      storage.setItem(storageKey, JSON.stringify({ remaining: allCards, drawn: [] }));
    }
  }, [allCards, storageKey]);

  const handleDraw = () => {
    if (remaining.length === 0 || animatingCard) return;
    const card = remaining[0];
    const newRemaining = remaining.slice(1);
    setAnimatingCard(card);
    setAnnouncement(`Drew ${type} card: ${card.title}`);

    setTimeout(() => {
      const newDrawn = [card, ...drawn];
      setRemaining(newRemaining);
      setDrawn(newDrawn);
      setAnimatingCard(null);
      storage.setItem(storageKey, JSON.stringify({ remaining: newRemaining, drawn: newDrawn }));
    }, 500);
  };

  const reshuffle = () => {
    setRemaining(allCards);
    setDrawn([]);
    storage.setItem(storageKey, JSON.stringify({ remaining: allCards, drawn: [] }));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold">{type}</h3>

      {/* Screen Reader Announcement (invisible to sighted users) */}
      <div
        aria-live="polite"
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="flex items-end justify-center gap-10">
        {/* Remaining Pile */}
        <div className="flex flex-col items-center relative">
          <div className="text-sm text-gray-700 mb-1">{remaining.length} remaining</div>

          <div
            tabIndex={remaining.length > 0 ? 0 : -1}
            ref={drawZoneRef}
            className={`relative w-32 h-48 transition-all duration-300 transform focus:outline focus:ring-2 focus:ring-blue-400 ${remaining.length === 0 ? "opacity-30 cursor-default" : "cursor-pointer hover:scale-105"}`}
            onClick={handleDraw}
            onKeyDown={(e) => e.key === "Enter" && handleDraw()}
          >
            {remaining.map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-darkPurple border border-black text-white rounded-lg shadow-md flex items-center justify-center font-bold"
                style={{ bottom: `${-i * 1}px`, right: `${-i * 1}px`, zIndex: i }}
              >
                {i === remaining.length - 1 && (
                  <div className="text-center p-5">
                    {type} Card
                    {/* <div className="text-xs">(Face Down)</div> */}
                  </div>
                )}
              </div>
            ))}

            {animatingCard && (
              <div className="absolute inset-0 animate-slide-fade bg-white border border-black rounded-lg p-2 text-sm flex flex-col items-center justify-center z-50">
                <p className="font-bold text-center">{animatingCard.title}</p>
                <p className="text-xs text-center mt-1">{animatingCard.description}</p>
              </div>
            )}

            {remaining.length === 0 && (
              <button
                onClick={reshuffle}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-sm px-4 py-1 rounded hover:bg-green-700"
              >
                Reshuffle
              </button>
            )}
          </div>
        </div>

        {/* Drawn Pile */}
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-700 mb-1">{drawn.length} drawn</div>

          <div className="relative w-32 h-48">
            {drawn.map((card, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-white border border-black rounded-lg shadow-md p-2 flex flex-col items-center justify-center transition-opacity duration-500"
                style={{ top: `${i * 1.5}px`, left: `${i * 1.5}px`, zIndex: -i }}
              >
                <p className="font-bold text-center">{card.title}</p>
                <p className="text-center mt-1">{card.description}</p>
              </div>
            ))}

            {drawn.length === 0 && !animatingCard && (
              <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
                No cards drawn
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}