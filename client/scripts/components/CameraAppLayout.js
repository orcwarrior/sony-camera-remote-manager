import {CameraLiveView} from "./liveview/CameraLiveView";
import React, {useState} from "react";
// import SplitPanel from "react-split-grid";
import SplitPanel from "./SplitPanel";
import RightPanel from "./rightPanel/RightPanel";
import TasksStrip from "./TasksStrip";

function CameraAppLayout(props) {
  const [stripWidth, setStripWidth] = useState("68%");

  return <>
    <SplitPanel minSize={100} gridTemplateColumns="68% 3px 31%" onSplitResize={({width}) => setStripWidth(width)}>
      <CameraLiveView/>
      <RightPanel/>
    </SplitPanel>
    <TasksStrip width={stripWidth}/>
  </>;
};

export default CameraAppLayout;