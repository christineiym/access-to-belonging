export default function GameInstructions() {
  return (
      // <div className="flex flex-col md:flex-row gap-6 max-w-sm text-white">
      <div className="p-6 flex flex-col md:flex-row justify-center items-center gap-8 text-white font-sans">
        {/* How to Play */}
        <div className="bg-purple-700 p-4 rounded-md shadow-lg max-w-sm">
          <h2 className="font-bold text-xl mb-2">How to Play</h2>
          <p className="text-sm">
            Pick a game piece and move along the “route” by drawing a scenario card
            and either advancing or going backwards. Who will reach their destination first?
          </p>
        </div>

        {/* Going Up / Down */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 bg-purple-700 p-4 rounded-md shadow-lg">
          {/* Up */}
          <div className="flex flex-row items-center gap-4 pr-4">
            <div>
              <p className="text-lg font-bold mb-2">Going Up</p>
              <p className="text-sm">If you land on a crosswalk, move up!</p>
            </div>
            <div className="w-10 h-3 bg-white border border-black rotate-12 items-center" />
          </div>
          
          {/* Down */}
          <div className="flex flex-row items-center gap-4 pr-4">
            <div>
              <p className="text-lg font-bold">Going Down</p>
              <p className="text-sm">If you land on construction tape, move down.</p>
            </div>
            <div className="w-10 h-3 bg-yellow-400 border border-black rotate-12" />
          </div>
        </div>
      </div>
  );
}