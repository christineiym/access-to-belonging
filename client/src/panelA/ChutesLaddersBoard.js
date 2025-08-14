export default function ChutesLaddersBoard({ edgeLength, startCornerLeft, startCornerBottom, isRows, allPositions, playerPositions, ladders, chutes }) {
  const maxPos = edgeLength ** 2;

  // sizing
  const tileSize = 70; // px per tile
  const svgSize = edgeLength * tileSize;

  // TODO: fix
  const getTileCoords = (pos) => {
    // Convert 1-based position to board coordinates based on settings
    let row, col;

    if (isRows) {  // zigzag horizontally
      row = Math.floor((pos - 1) / edgeLength);
      col = (pos - 1) % edgeLength;
      if ((startCornerBottom && row % 2 === 1) || (!startCornerBottom && row % 2 === 0)) {
        col = edgeLength - 1 - col;  // zagging back
      }
      if (!startCornerBottom) {
        row = edgeLength - 1 - row;
        if (startCornerLeft) {
          col = edgeLength - 1 - col;
        }
      }
      if (!startCornerLeft) {
        col = edgeLength - 1 - col;
      }
    } else {  // zigzag vertically
      col = Math.floor((pos - 1) / edgeLength);
      row = (pos - 1) % edgeLength;
      if ((startCornerLeft && col % 2 === 1) || (!startCornerLeft && col % 2 === 0)) {
        row = edgeLength - 1 - row;  // zagging back
      }
      if (!startCornerLeft) {
        col = edgeLength - 1 - col;
        if (startCornerBottom) {
          row = edgeLength - 1 - row;
        }
      }
      if (!startCornerBottom) {
        row = edgeLength - 1 - row;
      }
    }

    let x = col * tileSize;
    let y = (edgeLength * tileSize) - (row + 1) * tileSize;
    return { x, y };
  }

  const tileCenter = (posIndex) => {
    const { row, col } = allPositions[posIndex - 1];
    return [col * tileSize + tileSize * 0.5, row * tileSize + tileSize * 0.5];
  };


  return (
    <div className="p-4">
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
          {allPositions.map((p, idx) => {
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

          {/* Chutes and Ladders */}
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

          {/* Player tokens */}
          {playerPositions.map((player, idx) => {
            const { x, y } = getTileCoords(player.position);
            return (
              <circle
                key={player.name}
                cx={x + tileSize / 2}
                cy={y + tileSize / 2}
                r={tileSize / 6}
                fill={["red", "blue", "green", "purple"][idx % 4]}
                stroke="#000"
              />
            );
          })}

        </svg>
      </div>
    </div>
  );
}
