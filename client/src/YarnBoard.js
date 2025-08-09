import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// TODO: fetch from db
const leftLabels = ['Wheelchair User', 'Cyclist', 'Avid Walker', 'Parent with a stroller', 'Transit Rider', 'White-Cane User'];
const rightLabels = ['Lack of lighting', 'Large cracks', 'No curb ramps', 'Steep inclines', 'Confusing wayfinding', 'No tactile-paving', 'No audible pedestrian signal'];

export default function YarnBoard() {
  const [mode, setMode] = useState(localStorage.getItem('hasSubmitted') ? 'view' : 'edit');
  const [connections, setConnections] = useState([]);
  const [sessionConnections, setSessionConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [focus, setFocus] = useState({ side: 'left', index: 0 });
  const [popup, setPopup] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [dragging, setDragging] = useState(null);

  const parentRef = useRef(null);

  useEffect(() => {
    setMode("view");
  }, []);

  useEffect(() => {
    // TODO: Change to actual connections in production
    // axios.get('http://localhost:3001/connections').then(res => {
    //   setConnections(res.data);
    // });
    fetch("./demo.json")
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
      console.log("Can't locate dot container;");
    }
    return dot;
  };

  const actuallyFocusDot = ({side, index}) => {
    console.log(`Current focus: ${side}-${index}`);
    setFocus({side, index});
    const currentDot = getDotByLocation(side, index);
    currentDot.focus({ preventScroll: true, focusVisible: true });
  }

  const actuallyFocusConnection = ({connectionIndex}) => {
    setFocus({connectionIndex});
    const currentConnection = []; // ??
    currentConnection.focus({ preventScroll: true, focusVisible: true });
  }

  const handleKey = (e) => { // TODO: add connection nav. Also allow nav to bottom button?. Include other?
    const currentLabels = focus.side === 'left' ? leftLabels : rightLabels;
    const otherSide = focus.side === 'left' ? 'right' : 'left';

    if (e.key === 'ArrowDown') {
      actuallyFocusDot({ ...focus, index: (focus.index + 1) % currentLabels.length });  // what about speaking?
    } else if (e.key === 'ArrowUp') {
      actuallyFocusDot({ ...focus, index: (focus.index - 1 + currentLabels.length) % currentLabels.length });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const newIndex = Math.min(focus.index, otherSide === 'left' ? leftLabels.length - 1 : rightLabels.length - 1);
      actuallyFocusDot({ side: otherSide, index: newIndex });
    }
  };

  // show connecton number. What about hover? temporarily flash, instead. Also: highlight (but don't change focus)
  const handleClick = (connectionIndex) => {
    actuallyFocusConnection({connectionIndex});
    // console.log(getConnectionCount)
  };

//   const clearConnections = () => setSessionConnections([]);

  const handleSubmit = async () => {  // TODO: update according to input form; change to base
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

  const renderDotHtml = (side, index) => {
    const key = `${side}-${index}`;

    return ( // how to mark decorative?
        <div className={`dot items-center gap-2 ${side === 'left' ? 'flex flex-row-reverse' : 'flex'}`} key={key}>
          <div
            id={key}
            className={`w-6 h-6 rounded-full border-4 border-gray-400`}
          />
          <span>{side === 'left' ? leftLabels[index] : rightLabels[index]}</span>
        </div>
      );
  }

  const renderConnections = (set) => {
    return set.map((connectionInfo, connectionIndex) => {
      console.log(connectionInfo);
      let leftIndex = connectionInfo.fromDot;
      let rightIndex = connectionInfo.toDot;

      let current_x1 = 0;
      let current_y1 = 22 + leftIndex * 20;
      let current_x2 = 100;
      let current_y2 = 22 + rightIndex * 20;

      // console.log(`connection ${connectionIndex}: from ${leftIndex} to ${rightIndex}`)
      // console.log(`line ${connectionIndex}: (${current_x1},${current_y1}) to (${current_x2},${current_y2})`);

      // className={`w-6 h-6 rounded-full border-4 ${
      //   isSelected ? 'border-purple-600' : hovered?.side === side && hovered.index === index ? 'border-blue-400' : 'border-gray-400'
      // } bg-white cursor-pointer ${isFocused ? 'ring-2 ring-black' : ''}`}
      // styilize focus

      /**
       * TODO:
       * label
       * mouse hover/click (and change focus)
       */
      return (
        <line
          tabIndex={0}
          aria-label={`${leftIndex} to ${rightIndex}, ${getConnectionCountMessage(leftIndex, rightIndex)} connections.`}
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

  // TODO: replace from the result of an aggregate call to the db!!
  const getConnectionCount = (leftIndex, rightIndex) => { // left is from, right is to
    const count = side === 'left'
      ? connections.filter(c => c.from === index).length
      : connections.filter(c => c.to === index).length;
    return count;
  }

  const toggleMode = () => {
    mode === 'edit' ? setMode('view') : setMode('edit');
  }

  // put ref in edit?
  if (mode === 'edit') {
    return (
        <div className="h-[450px]">
             <div className="relative p-10 flex justify-center gap-0 h-[370px]">
                <input>
                    {/* # an input field with drop-down and checkbox (and optional other). Submit button. */}
                </input>
                <div className="flex">
                    
                </div>
             </div>
             <div>
                <div className='flex justify-center pl-10 pr-10'>
                    <button onClick={toggleMode()} className="bg-red-600 text-white px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-2 rounded">Submit</button>
                </div>
             </div>
        </div>
    );
  } else {
    return (
        <div className="h-[450px]">
            <div className="relative p-10 flex justify-center gap-0 h-[370px]" onKeyDown={handleKey} onMouseMove={handleMouseMove} ref={parentRef}>
                <div className="flex flex-col gap-8 z-10" style={{"white-space": "nowrap"}}>
                    <p className='text-left text-xl'><strong>I am a…</strong></p> 
                    {/* list title? */}
                    <ul>
                        {leftLabels.map((_, i) => (
                            <li>${renderDotHtml('left', i)}</li>
                        ))}
                    </ul>
                </div>

                {/* set order to 3 */}
                <div className="flex pt-2.5 z-0 min-w-[30%]">
                    <svg id="connectionSvg" overflow="visible" viewBox="0 0 100 100" preserveAspectRatio="none" alt=""
                        className="z-0 w-full h-full pointer-events-none">
                        {mode === 'view' && renderConnections(connections)}
                    </svg>
                </div>

                <div className="flex flex-col gap-8 z-10" style={{"white-space": "nowrap"}}>
                    <p className='text-left text-xl'><strong>Barriers I experience…</strong></p> 
                    {/* list title? */}
                    <ul>
                        {rightLabels.map((_, i) => (
                            <li>${renderDotHtml('right', i)}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div>
                <div className='flex justify-center pl-10 pr-10'>
                    <button onClick={toggleMode} className="bg-purple-600 text-white px-4 py-2 rounded">New Submission</button>
                </div>
            </div>
        </div>
    );
  };
}