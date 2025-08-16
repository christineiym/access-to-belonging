import { useState } from "react";

export default function ChutesLaddersStart({ onStart }) {
  const [gameMode, setGameMode] = useState("single"); // 'single' or 'multi'
  const [numPlayers, setNumPlayers] = useState(2);
  const [edgeLength, setEdgeLength] = useState(10);

  const handleStart = () => {
    if (onStart) {
      onStart({
        gameMode,
        numPlayers: gameMode === "multi" ? numPlayers : 2, // player + bot or multiple players
        edgeLength
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 gap-6 p-6">
      {/* Edge length */}
      <div className="flex flex-row gap-5 items-center">
        <label className="mb-1 font-medium">Board size (tiles per edge):</label>
        <input
          type="number"
          min={2}
          max={12}
          value={edgeLength}
          onChange={(e) =>
            setEdgeLength(Math.max(2, Number(e.target.value) || 2))
          }
          className="w-20 p-1 border-2 rounded text-center"
        />
      </div>

      {/* Mode selection */}
      <div className="flex gap-6">
        {/* Single Player */}
        <button
          onClick={() => setGameMode("single")}
          className={`flex flex-col items-center p-4 rounded-xl border-4 w-36 h-36 transition ${
            gameMode === "single"
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 bg-white"
          }`}
        >
          <div class="w-16 h-16 aspect-square rounded-full bg-blue-500"></div>
          <span className="font-semibold">Single Player</span>
        </button>

        {/* Multiplayer */}
        <button
          onClick={() => setGameMode("multi")}
          className={`flex flex-col items-center p-4 rounded-xl border-4 w-36 h-36 transition ${
            gameMode === "multi"
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 bg-white"
          }`}
        >
          <div class="grid grid-cols-2 gap-2">
            <div class="w-8 h-8 aspect-square rounded-full bg-red-500"></div>
            <div class="w-8 h-8 aspect-square rounded-full bg-blue-500"></div>
            <div class="w-8 h-8 aspect-square rounded-full bg-green-500"></div>
            <div class="w-8 h-8 aspect-square rounded-full bg-purple-500"></div>
          </div>
          <span className="font-semibold">Multiplayer</span>
        </button>
      </div>

      {/* Player count (only if multiplayer) */}
      {gameMode === "multi" && (
        <div className="flex flex-col items-center">
          <label className="mb-1 font-medium">Number of Players</label>
          <input
            type="number"
            min={2}
            max={4}
            value={numPlayers}
            onChange={(e) =>
              setNumPlayers(
                Math.max(2, Math.min(4, Number(e.target.value) || 2))
              )
            }
            className="w-20 p-1 border rounded text-center"
          />
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        Start
      </button>
    </div>
  );
}
