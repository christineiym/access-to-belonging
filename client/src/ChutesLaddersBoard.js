import { useMemo, useState } from "react";


export default function ChutesLaddersBoard({edgeLength, ladders, chutes}) {
  const [startCornerLeft, setStartCornerLeft] = useState(true);
  const [startCornerBottom, setStartCornerBottom] = useState(true);
  const [isRows, setIsRows] = useState(true);

  // sizing
  const tileSize = 70; // px per tile
  const svgSize = edgeLength * tileSize;

  // generate tile positions (one entry per board cell) in the *numbering order*
  // each entry is { row, col } where row 0 is the top row (SVG coordinate system)
  const positions = useMemo(() => {
    const N = Math.max(1, Math.floor(edgeLength));
    const pos = [];

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
  }, [edgeLength, startCornerLeft, startCornerBottom, isRows]);

  const tileCenter = (posIndex) => {
    const { row, col } = positions[posIndex - 1];
    return [col * tileSize + tileSize * 0.5, row * tileSize + tileSize * 0.5];
  };

  return (
    <div className="p-4">
      {/* Controls to tweak the state (convenience for testing) */}
      {/* <div className="mb-4 flex flex-wrap gap-4 items-center">
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
      </div> */}

      <div className="inline-block border-black">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          role="img"
          aria-label="Chute and Ladders board"
        >
          {/* outer outline */}
          <rect x={0} y={0} width={svgSize} height={svgSize} fill="none" stroke="#000" strokeWidth={3} />

          {/* tiles */}
          {positions.map((p, idx) => {
            const x = p.col * tileSize;
            const y = p.row * tileSize;
            const isLight = (p.row + p.col) % 2 === 0;
            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={tileSize}
                  height={tileSize}
                  fill={isLight ? "#95d9f4ff" : "#cd96f4ff"}
                  stroke="#000"
                  strokeWidth={0.5}
                />
                <text
                  x={x + tileSize / 2}
                  y={y + tileSize / 2}
                  fontSize={Math.max(15, Math.floor(tileSize / 2))}
                  fontFamily="Arial, Helvetica, sans-serif"
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}

          {chutes.map((chute, i) => {
            const [x1, y1] = tileCenter(chute.from);
            const [x2, y2] = tileCenter(chute.to);
            const w = chute.width; 
            return (
              <line key={`chute-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#chutePattern)" strokeWidth={w} strokeLinecap="square" />
            );
          })}

          {ladders.map((ladder, i) => {
            const [x1, y1] = tileCenter(ladder.from);
            const [x2, y2] = tileCenter(ladder.to);
            const w = ladder.width;
            return (
              <line key={`ladder-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#ladderPattern)" strokeWidth={w} strokeLinecap="square" />
            );
          })}

          <defs>
            <pattern id="chutePattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="4" height="8" fill="yellow" />
              <rect x="4" width="4" height="8" fill="black" />
            </pattern>
            <pattern id="ladderPattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
              <rect width="4" height="8" fill="white" />
              <rect x="4" width="4" height="8" fill="none" />
            </pattern>
          </defs>

        </svg>
      </div>
    </div>
  );
}
