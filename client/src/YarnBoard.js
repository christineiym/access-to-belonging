import { useEffect, useRef, useState } from 'react';
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
  const dotRefs = useRef({});
  const svgRef = useRef(null);

  const [hovered, setHovered] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setMode("view");
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/connections').then(res => setConnections(res.data));
  }, [mode]);

  // useEffect(() => {
  //   const el = dotRefs.current[`${focus.side}-${focus.index}`];
  //   el?.focus();
  //   const label = focus.side === 'left' ? leftLabels[focus.index] : rightLabels[focus.index];
  //   speak(el.id, label);
  // }, [focus, speak]);

  const speak = (msg) => {
    // const utter = new SpeechSynthesisUtterance(msg);
    // window.speechSynthesis.speak(utter);
    const currentDot = dotRefs.current[`${focus.side}-${focus.index}`];
    currentDot.setAttribute('aria-label', msg);
  };

  const handleKey = (e) => {
    e.preventDefault();
    const currentLabels = focus.side === 'left' ? leftLabels : rightLabels;
    const otherSide = focus.side === 'left' ? 'right' : 'left';

    if (e.key === 'ArrowDown') {
      setFocus({ ...focus, index: (focus.index + 1) % currentLabels.length });
    } else if (e.key === 'ArrowUp') {
      setFocus({ ...focus, index: (focus.index - 1 + currentLabels.length) % currentLabels.length });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const newIndex = Math.min(focus.index, otherSide === 'left' ? leftLabels.length - 1 : rightLabels.length - 1);
      setFocus({ side: otherSide, index: newIndex });
      if (selected) {
        const label = otherSide === 'left' ? leftLabels[newIndex] : rightLabels[newIndex];
        speak(`${label}. Press Enter to finish connection.`);
      }
    } else if (e.key === 'Enter') {
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
    try {
      await Promise.all(
        sessionConnections.map(({ from, to }) =>
          axios.post('http://localhost:3001/connections', { from, to })
        )
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

  const renderDot = (side, index) => {
    const isSelected = selected?.side === side && selected.index === index;
    const isFocused = focus.side === side && focus.index === index;
    const key = `${side}-${index}`;
    return (
      <div className="flex items-center gap-2" key={key}>
        <div
          ref={el => dotRefs.current[key] = el}
          tabIndex={0}
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
  };

  const renderConnections = (set) => {
    return set.map((c, i) => {
      const from = dotRefs.current[`left-${c.from}`]?.getBoundingClientRect();
      const to = dotRefs.current[`right-${c.to}`]?.getBoundingClientRect();
      if (!from || !to) return null;
      return (
        <line
          key={i}
          x1={from.left + 12}
          y1={from.top + 12 + window.scrollY}
          x2={to.left + 12}
          y2={to.top + 12 + window.scrollY}
          stroke="purple"
          strokeWidth={3}
        />
      );
    });
  };

  const renderPreviewLine = () => {
    if (!dragging || !preview) return null;
    const from = dotRefs.current[`${dragging.side}-${dragging.index}`]?.getBoundingClientRect();
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

  const renderViewAnnounce = (side, index) => {
    const count = side === 'left'
      ? connections.filter(c => c.from === index).length
      : connections.filter(c => c.to === index).length;
    const label = side === 'left' ? leftLabels[index] : rightLabels[index];
    const text = `${count} connections to ${label}`;
    speak(text);
  };

  const toggleMode = () => {
    mode === 'edit' ? setMode('view') : setMode('edit');
  }

  return (
    <div className="relative p-10 flex justify-center gap-20" tabIndex={0} onKeyDown={handleKey} onMouseMove={handleMouseMove}>
      <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {mode === 'edit' && renderConnections(sessionConnections)}
        {mode === 'view' && renderConnections(connections)}
        {renderPreviewLine()}
      </svg>

      <div className="flex flex-col gap-8 z-10">
        {leftLabels.map((_, i) => (
          <div
            key={i}
            onKeyDown={(e) => e.key === 'Enter' && mode === 'view' && renderViewAnnounce('left', i)}>
            {renderDot('left', i)}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 z-10">
        {rightLabels.map((_, i) => (
          <div
            key={i}
            onKeyDown={(e) => e.key === 'Enter' && mode === 'view' && renderViewAnnounce('right', i)}>
            {renderDot('right', i)}
          </div>
        ))}
      </div>

      {mode === 'view'
        ? <div className="absolute bottom-6 right-6 flex gap-4">
            <button onClick={toggleMode()} className="bg-purple-600 text-white px-4 py-2 rounded">New Submission</button>
          </div>
        : <div className="absolute bottom-6 right-6 flex gap-4">
            {/* <button onClick={toggleMode()} className="bg-purple-600 text-white px-4 py-2 rounded">Cancel</button> */}
            <button onClick={clearConnections} className="bg-gray-300 px-4 py-2 rounded">Clear All</button>
            <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
      }

      {popup && (
        <div className="fixed bottom-6 left-6 bg-white border p-4 rounded shadow">Thank you for submitting!</div>
      )}
    </div>
  );
};