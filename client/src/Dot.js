export default function Dot(side, index) {
    const isSelected = selected?.side === side && selected.index === index;
    const isFocused = focus.side === side && focus.index === index;
    const key = `${side}-${index}`;
    // const test = el => dotRefs.current[key] = el;
    // console.log(test);
    // console.log(el);
    // const currentDotRef = useRef(null);

    if (mode === 'edit') {
        return (
        <div className="flex items-center gap-2" key={key}>
            <div
            // ref={el => dotRefs.current[key] = el}
            ref={dotRefs.current[key]}
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
    } else {
        return (
        <div className="flex items-center gap-2" key={key}>
            <div
            // ref={el => dotRefs.current[key] = el}
            ref={dotRefs.current[key]}
            tabIndex={0}
            role="button"
            aria-label={getConnectionCountMessage(side, index)}
            className={`w-6 h-6 rounded-full border-4 ${
                isSelected ? 'border-purple-600' : hovered?.side === side && hovered.index === index ? 'border-blue-400' : 'border-gray-400'
            } bg-white cursor-pointer ${isFocused ? 'ring-2 ring-black' : ''}`}
            />
            <span>{side === 'left' ? leftLabels[index] : rightLabels[index]}</span>
        </div>
        );
    }
};