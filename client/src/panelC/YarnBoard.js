import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import YarnBoardForm from './YarnBoardForm';

// TODO: fetch actual values from database
const leftLabels = ['Wheelchair User', 'Cyclist', 'Avid Walker', 'Parent with a stroller', 'Transit Rider', 'White-Cane User'];
const rightLabels = ['Lack of lighting', 'Large cracks', 'No curb ramps', 'Steep inclines', 'Confusing wayfinding', 'No tactile-paving', 'No audible pedestrian signal'];
const listGapHtml = 28;
const listGapSvg = 20;
const maxLen = (leftLabels.length >= rightLabels.length) ? leftLabels.length : rightLabels.length;

// Assign a color for each left-side value, using colorblind-friendly Okabe and Ito palette
// TODO: check contrast
const colors = [
  "rgb(204,121,167)",  // pink
  "rgb(213,94,0)",  // orange
  "rgb(230,159,0)",  // lighter orange
  "rgb(240,228,66)",  // yellow
  "rgb(86,180,233)",  // light blue
  "rgb(0,114,178)",  // dark blue
  "rgb(0,158,115)",  // green
  "rgb(0,0,0)",  // black
];

export default function YarnBoard() {
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'view');  // vs. edit? what if they were in the middle of editing?
  const [connections, setConnections] = useState([]);
  const [groupedConnections, setGroupedConnections] = useState([]);
  const [sessionConnections, setSessionConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [focus, setFocus] = useState({ side: 'left', index: -1 });  // Set initial focus to "none"
  const [popup, setPopup] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [focusedConnection, setFocusedConnection] = useState(null);

  const parentRef = useRef(null);
  const aggregateConnections = (data) => {
    let counts = {};

    data.forEach(item => {
      let key = JSON.stringify(item);
      counts[key] = (counts[key] || 0) + 1;
    });

    let result = Object.entries(counts).map(([key, count]) => ({
      ...JSON.parse(key),
      count
    })).sort((a, b) => a.fromDot - b.fromDot || a.toDot - b.toDot);
    return result;
  }

  useEffect(() => {
    // Fetch actual connections from backend and aggregate
    axios.get('http://localhost:3001/connections')
      .then(res => setGroupedConnections(aggregateConnections(res.data)))
      .catch(() => {
        // fallback to demo data if backend fails
        fetch("./demo.json")
          .then((res) => res.json())
          .then((json) => setGroupedConnections(aggregateConnections(json)));
      });
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  // Remove focus when clicking outside any focusable item/connection
  useEffect(() => {
    function handleDocumentClick(e) {
      // Only run in view mode
      if (mode !== 'view') return;
      // If click is outside any dot or connection line, clear focus
      const parent = parentRef.current;
      if (!parent) return;
      // Check if the click target is inside a focusable item or connection
      const isDot = e.target.closest('.dot');
      const isLine = e.target.closest('svg') && e.target.tagName === 'line';
      const isButton = e.target.closest('button.bg-purple-600');
      if (!isDot && !isLine && !isButton) {
        setFocus({ side: 'left', index: -1 });
        setFocusedConnection(null);
      }
    }
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [mode]);

  const getItemByLocation = (side, index) => {
    let item;
    if (parentRef.current) {
      const subElement = parentRef.current.querySelector(`#${side}-${index}`);
      if (subElement) {
        item = subElement;
      }
    } else {
      console.log("Can't locate item container;");
    }
    return item;
  };

  const actuallyFocusItem = ({ side, index }) => {
    console.log(`Current focus: ${side}-${index}`);
    setFocus({ side, index });
    const currentItem = getItemByLocation(side, index);
    if (currentItem) {
      currentItem.focus({ preventScroll: true, focusVisible: true });
    }
  }

  const actuallyFocusConnection = ({ connectionIndex }) => {
    console.log(`Current focus: connection-${connectionIndex}`);
    setFocus({ connectionIndex });
    setFocusedConnection(connectionIndex);
    // Focus the SVG line element
    const svg = document.getElementById('connectionSvg');
    if (svg) {
      const line = svg.querySelector(`[data-connection-index="${connectionIndex}"]`);
      if (line) line.focus({ preventScroll: true, focusVisible: true });
    }
  }

  // Helper to get the bounding box of a connection line for tooltip positioning
  const getConnectionLinePosition = (idx) => {
    const aggregatedSet = aggregateConnections(groupedConnections);
    const item = aggregatedSet[idx];
    if (!item) return { x: 0, y: 0 };
    let leftIndex = item.fromDot;
    let rightIndex = item.toDot;
    let x1 = 0;
    let y1 = listGapSvg + leftIndex * listGapSvg;
    let x2 = 100;
    let y2 = listGapSvg + rightIndex * listGapSvg;
    // SVG is inside a flex div, so get its position relative to the page
    const svg = document.getElementById('connectionSvg');
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    // Midpoint of the line, scaled to SVG's rendered size
    const svgHeight = svg.viewBox.baseVal.height || (maxLen * listGapSvg);
    const svgWidth = svg.viewBox.baseVal.width || 100;
    const pxX = rect.left + ((x1 + x2) / 2) * (rect.width / svgWidth);
    const pxY = rect.top + ((y1 + y2) / 2) * (rect.height / svgHeight);
    return { x: pxX, y: pxY };
  };

  const handleKey = (e) => {
    // Determine current focus context
    const isLeft = focus.side === 'left';
    const isRight = focus.side === 'right';
    const isConnection = typeof focus.connectionIndex === 'number';
    const leftCount = leftLabels.length;
    const rightCount = rightLabels.length;
    const connCount = groupedConnections.length;

    if (isLeft) {
      if (e.key === 'ArrowDown') {
        actuallyFocusItem({ side: 'left', index: (focus.index + 1) % leftCount });
      } else if (e.key === 'ArrowUp') {
        actuallyFocusItem({ side: 'left', index: (focus.index - 1 + leftCount) % leftCount });
      } else if (e.key === 'ArrowRight' && connCount > 0) {
        // Find a connection that starts at this left dot
        const idx = groupedConnections.findIndex(c => c.fromDot === focus.index);
        if (idx !== -1) {
          actuallyFocusConnection({ connectionIndex: idx });
        } else {
          actuallyFocusItem({ side: 'right', index: Math.min(focus.index, rightCount - 1) });
        }
      } else if (e.key === 'Tab' && !e.shiftKey) {
        // Tab from last left item to first right item
        if (focus.index === leftCount - 1) {
          e.preventDefault();
          actuallyFocusItem({ side: 'right', index: 0 });
        }
      } else if (e.key === 'Tab' && e.shiftKey) {
        // Allow default shift+tab to move out of component
      }
    } else if (isRight) {
      if (e.key === 'ArrowDown') {
        actuallyFocusItem({ side: 'right', index: (focus.index + 1) % rightCount });
      } else if (e.key === 'ArrowUp') {
        actuallyFocusItem({ side: 'right', index: (focus.index - 1 + rightCount) % rightCount });
      } else if (e.key === 'ArrowLeft' && connCount > 0) {
        // Find a connection that ends at this right dot
        const idx = groupedConnections.findIndex(c => c.toDot === focus.index);
        if (idx !== -1) {
          actuallyFocusConnection({ connectionIndex: idx });
        } else {
          actuallyFocusItem({ side: 'left', index: Math.min(focus.index, leftCount - 1) });
        }
      } else if (e.key === 'Tab' && !e.shiftKey) {
        // Tab from last right item to first connection
        if (focus.index === rightCount - 1 && connCount > 0) {
          e.preventDefault();
          actuallyFocusConnection({ connectionIndex: 0 });
        }
      } else if (e.key === 'Tab' && e.shiftKey) {
        // Shift+Tab from first right item to last left item
        if (focus.index === 0) {
          e.preventDefault();
          actuallyFocusItem({ side: 'left', index: leftCount - 1 });
        }
      }
    } else if (isConnection) {
      if (e.key === 'ArrowLeft') {
        actuallyFocusItem({ side: 'left', index: groupedConnections[focus.connectionIndex]?.fromDot ?? 0 });
      } else if (e.key === 'ArrowRight') {
        actuallyFocusItem({ side: 'right', index: groupedConnections[focus.connectionIndex]?.toDot ?? 0 });
      } else if (e.key === 'ArrowDown' && connCount > 0) {
        const next = (focus.connectionIndex + 1) % connCount;
        actuallyFocusConnection({ connectionIndex: next });
      } else if (e.key === 'ArrowUp' && connCount > 0) {
        const prev = (focus.connectionIndex - 1 + connCount) % connCount;
        actuallyFocusConnection({ connectionIndex: prev });
      } else if (e.key === 'Tab' && !e.shiftKey) {
        // Tab from last connection to New Submission button
        if (focus.connectionIndex === connCount - 1) {
          // Move focus to the button
          e.preventDefault();
          const btn = document.querySelector('button.bg-purple-600');
          if (btn) btn.focus();
        } else {
          e.preventDefault();
          actuallyFocusConnection({ connectionIndex: focus.connectionIndex + 1 });
        }
      } else if (e.key === 'Tab' && e.shiftKey) {
        // Shift+Tab from first connection to last right item
        if (focus.connectionIndex === 0) {
          e.preventDefault();
          actuallyFocusItem({ side: 'right', index: rightCount - 1 });
        } else {
          e.preventDefault();
          actuallyFocusConnection({ connectionIndex: focus.connectionIndex - 1 });
        }
      }
    }
    // Handle Shift+Tab on the New Submission button to focus last connection
    if (
      document.activeElement &&
      document.activeElement.matches('button.bg-purple-600') &&
      e.key === 'Tab' &&
      e.shiftKey &&
      groupedConnections.length > 0
    ) {
      e.preventDefault();
      actuallyFocusConnection({ connectionIndex: groupedConnections.length - 1 });
    }
  };

  // show connection number. What about hover? temporarily flash, instead. Also: highlight (but don't change focus)
  const handleClick = (connectionIndex) => {
    actuallyFocusConnection({ connectionIndex });
    // console.log(getConnectionCount)
  };

  const handleSubmit = async () => {  // TODO: update according to input form; change to base
    console.log("submitted");
    try {
      await Promise.all(
        sessionConnections.map(({ from, to }) => {
          axios.post('http://localhost:3001/connections', { from, to });
          console.log("new connection!");
          console.log(from);
          console.log(to);
        })
      );
      localStorage.setItem('hasSubmitted', 'true');
      toggleMode();
      setPopup(true);
    } catch (error) {
      console.error('Error submitting connections:', error);
    }
  };

  const renderItem = (side, index) => {
    const key = `${side}-${index}`;
    const isFocused = focus.side === side && focus.index === index;

    // Use aria-label on the li, and aria-hidden on the span to avoid double reading
    const label = side === 'left' ? leftLabels[index] : rightLabels[index];

    return (
      <li
        key={key}
        id={key}
        tabIndex={0}
        role="listitem"
        aria-label={label}
        className={`dot items-center gap-2 ${side === 'left' ? 'flex flex-row-reverse' : 'flex'} outline-none
          ${isFocused ? 'ring-2 ring-purple-600 ring-offset-2' : ''} h-[52px]
        `}
        onFocus={() => actuallyFocusItem({ side, index })}
        onClick={() => actuallyFocusItem({ side, index })}
        onBlur={e => {
          setTimeout(() => {
            if (
              parentRef.current &&
              !parentRef.current.contains(document.activeElement)
            ) {
              setFocus({ side: 'left', index: -1 });
              setFocusedConnection(null);
            }
          }, 0);
        }}
      >
        <div
          aria-hidden="true"
          className="w-6 h-6 rounded-full border-4 border-gray-400"
        />
        <span aria-hidden="true">{label}</span>
      </li>
    );
  }

  const renderConnections = (set) => {
    return set.map((item, idx) => {
      let leftIndex = item.fromDot;
      let rightIndex = item.toDot;
      let current_x1 = 0;
      let current_y1 = listGapSvg + leftIndex * listGapSvg;
      let current_x2 = 100;
      let current_y2 = listGapSvg + rightIndex * listGapSvg;
      const isFocused = focusedConnection === idx;
      const isHovered = hoveredConnection === idx;
      let strokeWidth = 2 + Math.min(item.count, 4);

      // Pick color by leftIndex, fallback to purple if out of range
      let strokeColor = `${colors[leftIndex % colors.length]}` || "#a78bfa";

      return (
        <g key={idx}>
          <line
            tabIndex={0}
            aria-label={`${leftLabels[leftIndex]} to ${rightLabels[rightIndex]}, ${item.count} connections.`}
            x1={current_x1}
            y1={current_y1}
            x2={current_x2}
            y2={current_y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            data-connection-index={idx}
            style={{
              outline: isFocused ? '3px solid #6366f1' : 'none',
              cursor: 'pointer',
              opacity: isHovered || isFocused ? 1 : 0.9
            }}
            onMouseEnter={() => setHoveredConnection(idx)}
            onMouseLeave={() => setHoveredConnection(null)}
            onFocus={() => setFocusedConnection(idx)}
            onBlur={() => setFocusedConnection(null)}
            onClick={() => handleClick(idx)}
          />
        </g>
      );
    });
  };

  // Tooltip rendering (outside SVG)
  const renderConnectionTooltip = () => {
    const idx = hoveredConnection ?? focusedConnection;
    if (typeof idx !== 'number' || !groupedConnections[idx]) return null;
    const item = groupedConnections[idx];
    const { x, y } = getConnectionLinePosition(idx);
    return (
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -120%)',
        }}
      >
        <div className="bg-white border border-purple-600 rounded px-3 py-1 text-xs text-purple-900 shadow-lg text-center">
          {leftLabels[item.fromDot]} to {rightLabels[item.toDot]}: <strong>{item.count}</strong> connection{item.count > 1 ? 's' : ''}
        </div>
      </div>
    );
  };

  const toggleMode = () => {
    mode === 'edit' ? setMode('view') : setMode('edit');
  }


  return (
    <div>
      {mode === 'view' && (
        <div className='overflow-y-auto'>
          <div className="relative p-10 flex justify-center gap-0" onKeyDown={handleKey} ref={parentRef}>
            <div className={`flex flex-col gap-[14px] h-[${28 + maxLen * 52}px]`}>
              <p className='text-center text-xl' style={{ "white-space": "nowrap" }}><strong>I am a…</strong></p>
              {/* list title? */}
              <ul className={`flex flex-col`}>
                {leftLabels.map((_, i) => (
                  renderItem('left', i)
                ))}
              </ul>
            </div>

            <div className={`flex mt-4 z-0 min-w-[30%]`}>
              <svg id="connectionSvg" height={`${maxLen * 52}px`} overflow="visible" viewBox={`0 0 100 ${maxLen * listGapSvg}`} preserveAspectRatio="none" alt=""
                className={`z-0 w-full`}>
                {renderConnections(groupedConnections)}
              </svg>
              {renderConnectionTooltip()}
            </div>

            <div className={`flex flex-col gap-[14px] h-[${28 + maxLen * 52}px]`}>
              <p className='text-center text-xl' style={{ "white-space": "nowrap" }}><strong>Barriers…</strong></p>
              {/* list title? */}
              <ul className={`flex flex-col`}>
                {rightLabels.map((_, i) => (
                  renderItem('right', i)
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className='flex justify-center pl-10 pr-10'>
              <button onClick={() => toggleMode()} className="bg-purple-600 text-white px-4 py-2 rounded">New Submission</button>
            </div>
          </div>
        </div>
      )}
      {mode === 'edit' && (
        <div className="p-10">
          <YarnBoardForm
            handleSubmit={handleSubmit}
            handleCancel={toggleMode}
            dropdownOptions={[...leftLabels, "Other"]}
            checkboxOptions={[...rightLabels, "Other"]}
          />
        </div>
      )}
    </div>
  );
}