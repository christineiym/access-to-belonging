import { useEffect, useRef, useState } from "react";
import ChutesLaddersBoard from "./ChutesLaddersBoard";
import InteractiveCards from "./InteractiveCards";


export default function ChutesLadders() {
    const [mode, setMode] = useState(null);
    const [playerPositions, setPlayerPositions] = useState([
        { name: "Player 1", position: 63 },
        { name: "Player 2", position: 64 }
    ]);
    const [allPositions, setAllPositions] = useState([]);
    const [lastScenarioDraw, setLastScenarioDraw] = useState(null);
    const [lastPersonaDraw, setLastPersonaDraw] = useState(null);
    const [movers, setMovers] = useState({ chutes: [], ladders: [] });
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [announcement, setAnnouncement] = useState("");
    const [edgeLength, setEdgeLength] = useState(8);
    const [startCornerLeft, setStartCornerLeft] = useState(true);
    const [startCornerBottom, setStartCornerBottom] = useState(true);
    const [isRows, setIsRows] = useState(true);
    const [resetKey, setResetKey] = useState(0);

    const handleClear = () => {
        localStorage.clear();
        sessionStorage.clear();
        setResetKey(k => k + 1); // force remount of subcomponents
    };

    const animationRef = useRef(null);

    // Generate tile positions (one entry per board cell) in the *numbering order*
    // each entry is { row, col } where row 0 is the top row (SVG coordinate system)
    useEffect(() => {
        const N = Math.max(1, Math.floor(edgeLength));
        const pos = [];

        const generatePositions = () => {
            if (isRows) {
                // Zigzag across rows (horizontal zigzag), then move vertically between rows
                // Determine list of row indices in the order we visit them.
                const startRow = startCornerBottom ? N - 1 : 0;
                const rowStep = startCornerBottom ? -1 : 1;
                const rowIndices = [];
                for (let i = 0, r = startRow; i < N; i++, r += rowStep) rowIndices.push(r);

                for (let j = 0; j < N; j++) {
                    const row = rowIndices[j];
                    const forwardCols = Array.from({ length: N }, (_, k) => k);
                    const backwardCols = Array.from({ length: N }, (_, k) => N - 1 - k);
                    // For the first visited row we start from the left or right depending on startCornerLeft.
                    // Then alternate direction on each subsequent row to create the zigzag.
                    const cols = j % 2 === 0
                        ? (startCornerLeft ? forwardCols : backwardCols)
                        : (startCornerLeft ? backwardCols : forwardCols);

                    for (const col of cols) pos.push({ row, col });
                }
            } else {
                // Zigzag across columns (vertical zigzag), then move horizontally between columns
                const startCol = startCornerLeft ? 0 : N - 1;
                const colStep = startCornerLeft ? 1 : -1;
                const colIndices = [];
                for (let i = 0, c = startCol; i < N; i++, c += colStep) colIndices.push(c);

                for (let j = 0; j < N; j++) {
                    const col = colIndices[j];
                    const forwardRows = Array.from({ length: N }, (_, k) => k);
                    const backwardRows = Array.from({ length: N }, (_, k) => N - 1 - k);
                    // For the first visited column we start top->bottom or bottom->top depending on startCornerBottom.
                    // Then alternate direction on each subsequent column to create the vertical zigzag.
                    const rows = j % 2 === 0
                        ? (startCornerBottom ? backwardRows : forwardRows)
                        : (startCornerBottom ? forwardRows : backwardRows);

                    for (const row of rows) pos.push({ row, col });
                }
            }

            return pos;
        }
        const p = generatePositions();
        setAllPositions(p);
    }, [edgeLength, startCornerLeft, startCornerBottom, isRows]);

    // Generate movers
    const maxPos = edgeLength ** 2;
    const maxMovers = Math.floor(maxPos / 4);
    const minMovers = Math.floor(maxPos / 10);
    useEffect(() => {
        const minWidth = 10;
        const maxWidth = 14;

        const generateMovers = () => {
            /* Utilities **/
            const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
            // https://stackoverflow.com/questions/12987719/javascript-how-to-randomly-sample-items-without-replacement
            var positionBucket = [];
            for (let i = 1; i < maxPos - 1; i++) {  // nothing on start or end
                positionBucket.push(i + 1);
            }
            const getRandomFromBucket = () => {
                var randomIndex = Math.floor(Math.random() * positionBucket.length);
                return positionBucket.splice(randomIndex, 1)[0];
            }

            /* Movers **/
            let movers = { chutes: [], ladders: [] };
            const totalMovers = randInt(minMovers, maxMovers);  // Later: Ensure at least one chute and one ladder
            for (let i = 0; i < totalMovers; i++) {
                let isChute = Math.random() < 0.5;
                let from = getRandomFromBucket(1, maxPos);
                let to = isChute
                    ? randInt(1, from - 1)
                    : randInt(from + 1, maxPos);
                let width = minWidth + Math.random() * (maxWidth - minWidth);

                let mover = { from, to, width };
                if (mover) {
                    movers[isChute ? "chutes" : "ladders"].push(mover);
                }
            }

            return movers;
        }
        const m = generateMovers(edgeLength);
        setMovers(m);
    }, [edgeLength]);

    const handleCardDraw = (type, result) => {  // TODO: finish
        console.log("card drawn", type, result);
        if (type === "Scenario") {
            setLastScenarioDraw(result);
        } else {
            setLastPersonaDraw(result);
        }
    };

    // Move token on lastScenarioDraw change
    useEffect(() => {
        console.log(lastScenarioDraw);
        if (lastScenarioDraw == null || !movers) return;

        const moveValue = lastScenarioDraw.moveValue ?? Number(lastScenarioDraw); // allow num or object
        const player = playerPositions[currentPlayerIndex];
        const startPos = player.position;
        const endPos = Math.min(startPos + moveValue, movers.maxPos);

        let path = [];
        // Step along the normal move
        for (let p = startPos + 1; p <= endPos; p++) {
            path.push(p);
        }
        // Check if we land on a mover start
        const moverHit = [
            ...(movers["chutes"] || []),
            ...(movers["ladders"] || [])
        ].find(m => m.from === endPos);

        if (moverHit) {
            // Interpolate positions along mover line (simple straight step)
            path.push(moverHit.to);
        }

        movePlayer(path, player.name);

    }, [lastScenarioDraw, currentPlayerIndex, movers, playerPositions]);

    const movePlayer = (path, playerName) => {
        if (!path.length) return;
        let stepIndex = 0;

        const step = () => {
            setPlayerPositions(prevPositions =>
                prevPositions.map(p =>
                    p.name === playerName
                        ? { ...p, position: path[stepIndex] }
                        : p
                )
            );
            setAnnouncement(`${playerName} moved to tile ${path[stepIndex]}`);

            stepIndex++;
            if (stepIndex < path.length) {
                animationRef.current = setTimeout(step, 400); // adjust speed here
            } else {
                clearTimeout(animationRef.current);
            }
        };

        step();
    };

    const testSettings = true;
    return (
        // Outer area
        <div className="flex flex-col items-center justify-center bg-gray-100 p-10 gap-4 space-y-0">
            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                {/* Controls to tweak the state (convenience for testing) */}
                {testSettings && (
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <label className="flex items-center gap-2">
                            <span>Edge length</span>
                            <input
                                type="number"
                                min={2}
                                max={20}
                                value={edgeLength}
                                onChange={(e) => setEdgeLength(Math.max(2, Number(e.target.value) || 2))}
                                className="ml-2 w-20 p-1 border rounded"
                            />
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={startCornerLeft}
                                onChange={(e) => setStartCornerLeft(e.target.checked)}
                            />
                            <span>Start corner left</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={startCornerBottom}
                                onChange={(e) => setStartCornerBottom(e.target.checked)}
                            />
                            <span>Start corner bottom</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isRows}
                                onChange={(e) => setIsRows(e.target.checked)}
                            />
                            <span>Number by rows (zigzag horizontally)</span>
                        </label>
                    </div>
                )}

                {/* Status */}
                {announcement !== null && <div><strong>Last turn: </strong>{announcement}</div>}
                <div aria-live="polite" className="sr-only">
                    {announcement}
                </div>
                <button type="button"
                    onClick={handleClear}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >Reset</button>
            </div>


            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Base board */}
                <ChutesLaddersBoard edgeLength={edgeLength}
                    startCornerLeft={startCornerLeft}
                    startCornerBottom={startCornerBottom}
                    isRows={isRows}
                    allPositions={allPositions}
                    playerPositions={playerPositions}
                    ladders={movers.ladders}
                    chutes={movers.chutes}
                    key={resetKey}
                />

                {/* Cards */}
                <InteractiveCards onCardDraw={handleCardDraw}
                    key={resetKey}
                />
            </div>
        </div>
    )
}