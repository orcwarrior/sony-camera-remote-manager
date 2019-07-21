import React, {useRef, useState} from "react";


const SplitPanel = ({children, onSplitResize = () => null}) => {
  const [dragStarted, setDragStarted] = useState(false);
  const RIGHT_PANEL_MIN_WIDTH = 400;
  let gridEl = useRef(null);
  let lastMouseRatio = 0.68; // default

  const cannotSetThatRatio = (ratio) => ((1 - ratio) * window.innerWidth < RIGHT_PANEL_MIN_WIDTH);
  const gridTemplateColumns = (ratio) => {
    const winWidth = window.innerWidth;
    return `${ratio * 100}% 3px auto`;
  };
  const storeMousePosRatio = (event) => lastMouseRatio = (event.clientX / window.innerWidth);
  const resizeSplitPanel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragStarted && gridEl.current) {
      lastMouseRatio = (event.clientX / window.innerWidth);
      if (cannotSetThatRatio(lastMouseRatio)) return;
      gridEl.current.style.gridTemplateColumns = gridTemplateColumns(lastMouseRatio);
      console.log(`Dragging: ${lastMouseRatio * 100}%`);

      const width = `${lastMouseRatio * 100}%`;
      onSplitResize({ratio: lastMouseRatio, width});
    }
  };
  const startDrag = (event) => setDragStarted(true);

  const splitter = <div className="split-handle" onMouseDown={startDrag}/>;
  return <div className="main-grid" ref={gridEl} onMouseMove={resizeSplitPanel}
              onMouseUp={() => setDragStarted(false)}>
    {React.Children.map(children, (child, idx) => {
      if (idx === 0) return <>{child}{splitter}</>;
      else if (idx === 1) return child;
    })}
  </div>;
};

export default SplitPanel;