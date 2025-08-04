import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

const leftLabels = ['Wheelchair User', 'Cyclist', 'Avid Walker', 'Parent with a stroller', 'Transit Rider'];
const rightLabels = ['Lack of lighting', 'Large cracks', 'No curb ramps', 'Steep inclines', 'Confusing wayfinding'];

export default function YarnBoard() {
  const [mode, setMode] = useState(localStorage.getItem('hasSubmitted') ? 'view' : 'edit');
  // const [mode, setMode] = useState(null);
  const [connections, setConnections] = useState([]);
  const [sessionConnections, setSessionConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [focus, setFocus] = useState({ side: 'left', index: 0 });
  const [popup, setPopup] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [preview, setPreview] = useState(null);
  // const [svgDimensions, setSvgDimensions] = useState(null);

  const parentRef = useRef(null);

  useEffect(() => {
    setMode("view");
  }, []);

  useEffect(() => {
    // TODO: Change to actual connections in production
    // axios.get('http://localhost:3001/connections').then(res => {
    //   setConnections(res.data);
    // });
    fetch("/cards.json")
      .then((res) => res.json())
      .then((json) => {
        setConnections(json);});
  }, [mode]);

  const getDotByLocation = (side, index) => {
    let dot;
    if (parentRef.current) {
      const subElement = parentRef.current.querySelector(`#${side}-${index}`);
      if (subElement) {
        dot = subElement;
      }
    } else {
      console.log("not current");
    }
    return dot;
  };

  const speak = (msg) => { // should only call when focus changes
    // const utter = new SpeechSynthesisUtterance(msg);
    // window.speechSynthesis.speak(utter);
    const currentDot = getDotByLocation(focus.side, focus.index);
    currentDot.setAttribute('aria-label', msg);
    // reset label afterward
  };

  const actuallyFocus = ({side, index}) => {
    // how to make this atomic?
    console.log(`Current focus: ${side}-${index}`);
    setFocus({side, index});  // apparently there's some sort of asynchronization going on here
    const currentDot = getDotByLocation(side, index);
    currentDot.focus({ preventScroll: true, focusVisible: true });
  }

  const handleKey = (e) => {
    // e.preventDefault();
    const currentLabels = focus.side === 'left' ? leftLabels : rightLabels;
    const otherSide = focus.side === 'left' ? 'right' : 'left';

    if (e.key === 'ArrowDown') {
      actuallyFocus({ ...focus, index: (focus.index + 1) % currentLabels.length });  // what about speaking?
    } else if (e.key === 'ArrowUp') {
      actuallyFocus({ ...focus, index: (focus.index - 1 + currentLabels.length) % currentLabels.length });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const newIndex = Math.min(focus.index, otherSide === 'left' ? leftLabels.length - 1 : rightLabels.length - 1);
      actuallyFocus({ side: otherSide, index: newIndex });
      if (selected) {
        const label = otherSide === 'left' ? leftLabels[newIndex] : rightLabels[newIndex];
        speak(`${label}. Press Enter to finish connection.`);
      }
    } else if (e.key === 'Enter') {
      actuallyFocus({ ...focus});

      if (!selected) {
        setSelected(focus);
        speak(`${currentLabels[focus.index]} is selected. Go ${otherSide} to complete a connection.`);
      } else if (selected.side !== focus.side) {
        const from = selected.side === 'left' ? selected.index : focus.index;
        const to = selected.side === 'left' ? focus.index : selected.index;
        setSessionConnections([...sessionConnections, { from, to }]);
        speak(`Connection between ${leftLabels[from]} and ${rightLabels[to]} is completed.`);
        setSelected(null);
      } else {
        setSelected(null);
        speak('Selection cleared.');
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      actuallyFocus({ ...focus});
      if (mode === 'edit') {
        const from = selected?.side === 'left' ? selected.index : focus.index;
        const to = selected?.side === 'left' ? focus.index : selected.index;
        setSessionConnections(sessionConnections.filter(c => !(c.from === from && c.to === to)));
        setSelected(null);
        speak(`Connection removed.`);
      }
    }
  };

  const handleClick = (side, index) => {
    actuallyFocus({side, index});
    if (!selected) {
      setSelected({ side, index });
      speak(`${(side === 'left' ? leftLabels : rightLabels)[index]} is selected. Go ${side === 'left' ? 'right' : 'left'} to complete a connection.`);
    } else if (selected.side !== side) {
      const from = selected.side === 'left' ? selected.index : index;
      const to = selected.side === 'left' ? index : selected.index;
      setSessionConnections([...sessionConnections, { from, to }]);
      speak(`Connection between ${leftLabels[from]} and ${rightLabels[to]} is completed.`);
      setSelected(null);
    } else {
      setSelected(null);
      speak('Selection cleared.');
    }
  };

  const clearConnections = () => setSessionConnections([]);

  const handleSubmit = async () => {
    console.log()
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

  const handleMouseDown = (side, index) => {
    setDragging({ side, index });
  };

  const handleMouseUp = (side, index) => {
    if (dragging && dragging.side !== side) {
      const from = dragging.side === 'left' ? dragging.index : index;
      const to = dragging.side === 'left' ? index : dragging.index;
      setSessionConnections([...sessionConnections, { from, to }]);
    }
    setDragging(null);
    setPreview(null);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPreview({ x: e.clientX, y: e.clientY });
    }
  };

  const renderDotHtml = (side, index) => {
    const isSelected = selected?.side === side && selected.index === index;
    const isFocused = focus.side === side && focus.index === index;
    const key = `${side}-${index}`;

    let dot;
    if (mode === 'edit') {
      dot = (
        <div className={`dot items-center gap-2 ${side === 'left' ? 'flex flex-row-reverse' : 'flex'}`} key={key}>
          <div
            tabIndex={0}
            id={key}
            role="button"
            aria-label={`${side === 'left' ? leftLabels[index] : rightLabels[index]}`}
            onClick={() => handleClick(side, index)}
            onMouseDown={() => handleMouseDown(side, index)}
            onMouseUp={() => handleMouseUp(side, index)}
            onMouseEnter={() => setHovered({ side, index })}
            onMouseLeave={() => setHovered(null)}
            className={`w-6 h-6 rounded-full border-4 ${
              isSelected ? 'border-purple-600' : hovered?.side === side && hovered.index === index ? 'border-blue-400' : 'border-gray-400'
            } bg-white cursor-pointer ${isFocused ? 'ring-2 ring-black' : ''}`}
          />
          <span>{side === 'left' ? leftLabels[index] : rightLabels[index]}</span>
        </div>
      );
    } else {
      dot = (
        <div className={`dot items-center gap-2 ${side === 'left' ? 'flex flex-row-reverse' : 'flex'}`} key={key}>
          <div
            tabIndex={0}
            id={key}
            // role="button"
            aria-label={getConnectionCountMessage(side, index)}
            // onClick={() => handleClick(side, index)}
            // onMouseDown={() => handleMouseDown(side, index)}
            // onMouseUp={() => handleMouseUp(side, index)}
            // onMouseEnter={() => setHovered({ side, index })}
            // onMouseLeave={() => setHovered(null)}
            className={`w-6 h-6 rounded-full border-4 ${
              isSelected ? 'border-purple-600' : hovered?.side === side && hovered.index === index ? 'border-blue-400' : 'border-gray-400'
            } bg-white cursor-pointer ${isFocused ? 'ring-2 ring-black' : ''}`}
          />
          <span>{side === 'left' ? leftLabels[index] : rightLabels[index]}</span>
        </div>
      );
    }
    return dot;
  };

  const renderConnections = (set) => {
    return set.map((connectionInfo, connectionIndex) => {
      let leftIndex = connectionInfo.fromDot;
      let rightIndex = connectionInfo.toDot;

      let current_x1 = 0;
      let current_y1 = 22 + leftIndex * 20;
      let current_x2 = 100;
      let current_y2 = 22 + rightIndex * 20;

      // console.log(`connection ${connectionIndex}: from ${leftIndex} to ${rightIndex}`)
      // console.log(`line ${connectionIndex}: (${current_x1},${current_y1}) to (${current_x2},${current_y2})`);

      return (
        <line
          key={connectionIndex}
          x1={current_x1}
          y1={current_y1}
          x2={current_x2}
          y2={current_y2}
          stroke="purple"
          strokeWidth={3}
        />
      );
    });
  };

  // const memoizedRenderConnections = useCallback(renderConnections, []);

  // TODO: fix!!
  const renderPreviewLine = () => {
    if (!dragging || !preview) return null;
    // const from = dotRefs.current[`${dragging.side}-${dragging.index}`]?.getBoundingClientRect();
    const from = getDotByLocation(dragging.side, dragging.index)?.getBoundingClientRect();
    if (!from) return null;
    return (
      <line
        x1={from.left + 12}
        y1={from.top + 12 + window.scrollY}
        x2={preview.x}
        y2={preview.y + window.scrollY}
        stroke="blue"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
    );
  };

  const getConnectionCountMessage = (side, index) => { // apparently left is from, right is to
    const count = side === 'left'
      ? connections.filter(c => c.from === index).length
      : connections.filter(c => c.to === index).length;
    const label = side === 'left' ? leftLabels[index] : rightLabels[index];
    const text = `${count} connections to ${label}`;
    return text;
  }

  const toggleMode = () => {
    mode === 'edit' ? setMode('view') : setMode('edit');
  }

  return (
    <div className="h-[450px]">
      <div className="relative p-10 flex justify-center gap-0 h-[370px]" onKeyDown={handleKey} onMouseMove={handleMouseMove} ref={parentRef}>
        <div className="flex flex-col gap-8 z-10" style={{"white-space": "nowrap"}}>
          <p className='text-left text-xl'><strong>I am a…</strong></p>
          {leftLabels.map((_, i) => (
            renderDotHtml('left', i)
          ))}
        </div>

        <div className="flex pt-2.5 z-0 min-w-[30%]">
          <svg id="connectionSvg" overflow="visible" viewBox="0 0 100 100" preserveAspectRatio="none" alt=""
            className="z-0 w-full h-full pointer-events-none">
            {mode === 'edit' && renderConnections(sessionConnections)}
            {mode === 'view' && renderConnections(connections)}
            {renderPreviewLine()}
          </svg>
        </div>

        <div className="flex flex-col gap-8 z-10" style={{"white-space": "nowrap"}}>
          <p className='text-left text-xl'><strong>Barriers I experience…</strong></p>
          {rightLabels.map((_, i) => (
            renderDotHtml('right', i)
          ))}
        </div>
      </div>

      {/* Buttons and popup, formerly in "absolute bottom-6 right-6 flex gap-4" */}
      <div>
        {mode === 'view'
          ? <div className='flex justify-center pl-10 pr-10'>
              <button onClick={toggleMode} className="bg-purple-600 text-white px-4 py-2 rounded">Begin New Submission</button>
            </div>
          : <div className='flex justify-center pl-10 pr-10'>
              {/* <button onClick={toggleMode()} className="bg-purple-600 text-white px-4 py-2 rounded">Cancel</button> */}
              <button onClick={clearConnections} className="bg-gray-300 px-4 py-2 rounded">Clear All</button>
              <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
            </div>
        }

        {popup && ( // TODO: go away
          <div className="w-[220px] bg-white border p-4 rounded shadow">Thank you for submitting!</div>
        )}
      </div>
    </div>
  );
};