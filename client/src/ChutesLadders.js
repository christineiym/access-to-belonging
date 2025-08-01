const tiles = Array.from({ length: 64 }, (_, i) => i + 1).reverse();

const ladders = [
  { from: 47, to: 50 },
  { from: 43, to: 54 },
  { from: 11, to: 25 },
  { from: 12, to: 20 },
  { from: 13, to: 5 },
];

const slides = [
  { from: 45, to: 61 },
  { from: 34, to: 18 },
  { from: 36, to: 28 },
  { from: 30, to: 22 },
];

function isLadder(num) {
    return ladders.find(l => l.from === num || l.to === num);
} 

function isSlide(num) {
    return slides.find(s => s.from === num || s.to === num);
}

export default function ChutesLadders() {
    return (
        // Outer area
        <div className="flex flex-col md:flex-row items-center bg-gray-100 p-10 gap-8 space-y-0">

            {/* Base board */}
            <div className="grid grid-cols-8 border-4 border-black">
                {tiles.map((num) => {
                    const ladder = isLadder(num);
                    const slide = isSlide(num);
                    // const isEvenRow = Math.floor((64 - num) / 8) % 2 === 0;
                    const bg = (num + Math.floor((64 - num) / 8)) % 2 === 0 ? 'bg-tcatTeal' : 'bg-purple-200';

                    return (
                    <div
                        key={num}
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center text-black font-bold text-sm sm:text-base ${bg} border border-gray-300`}
                    >
                        {num}
                        {/* {ladder && (
                        <div className="relative w-1 h-full bg-white rotate-45 border-l-2 border-r-2 border-black" />
                        )}
                        {slide && (
                        <div className="relative w-2 h-full bg-yellow-400 rotate-45 border-l-2 border-r-2 border-black" />
                        )} */}
                    </div>
                    );
                })}
            </div>

            {/* Cards (right or left?) */}
            <div className="flex flex-row md:flex-col gap-12 items-start p-6">
                {/* Persona card */}
                <div className="flex flex-col items-center relative">
                    <div className="bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded-t-md">
                        Draw a<br />persona card!
                    </div>
                    <div className="w-32 h-48 bg-purple-700 text-white flex flex-col items-center justify-center text-center mt-2 shadow-md">
                        <p className="font-bold text-lg">Persona Card</p>
                        <div className="mt-2 text-xs">TCAT logo</div>
                    </div>
                </div>

                {/* Scenario card */}
                <div className="flex flex-col items-center relative">
                    <div className="bg-teal-500 text-white text-sm font-bold px-3 py-1 rounded-t-md">
                        Draw a<br />scenario card!
                    </div>
                    <div className="w-32 h-48 bg-purple-700 text-white flex flex-col items-center justify-center text-center mt-2 shadow-md">
                        <p className="font-bold text-lg">Scenario Card</p>
                        <div className="mt-2 text-xs">TCAT logo</div>
                    </div>
                </div>
            </div>
        </div>
    )
}