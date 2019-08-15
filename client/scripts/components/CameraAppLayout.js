import {CameraLiveView} from "./liveview/CameraLiveView";
import React, {useState} from "react";
// import SplitPanel from "react-split-grid";
import SplitPanel from "./SplitPanel";
import RightPanel from "./rightPanel/RightPanel";
import TasksStrip from "./TasksStrip";
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';

function CameraAppLayout(props) {
  const [stripWidth, setStripWidth] = useState("68%");

  return <>
    <SplitPanel minSize={100} gridTemplateColumns="68% 3px 31%" onSplitResize={({width}) => setStripWidth(width)}>
      <CameraLiveView/>
      <RightPanel/>
    </SplitPanel>
    <TasksStrip width={stripWidth}/>
    <Alert stack={{limit: 3}} />
  </>;
};

export default CameraAppLayout;