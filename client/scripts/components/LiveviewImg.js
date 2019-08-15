import {useEffect, useState} from "react";
import React from "react";
import withSocketIO from "./hoc/withSocketIO";
import _ from "lodash";


let lastImageSetTS = 0;

function buildLiveimageListener(setLiveviewUrl, throttleMs = 100) {
  return function createNewLiveviewImg(buffer) {
    const blob = new Blob([buffer], {type: "image/jpeg"});
    const urlCreator = window.URL || window.webkitURL;
    const imgUrl = urlCreator.createObjectURL(blob);

    if (new Date().valueOf() - lastImageSetTS > throttleMs) {
      setLiveviewUrl(imgUrl);
      lastImageSetTS = new Date().valueOf();
    }
  };
}

const LiveviewImg = withSocketIO(function LiveviewImg({socket}) {

  const [liveviewUrl, setLiveviewUrl] = useState();

  // const throttledLiveviewImgGeneration = _.throttle(createNewLiveviewImg, 1200);

  useEffect(() => {
    if (_.isFunction(socket)) socket = socket();
    const eventCb = buildLiveimageListener(setLiveviewUrl, 30);
    socket.on("camera-liveview", eventCb);
    return function cleanup() {
      socket.off("camera-liveview", eventCb);
    };
  });

  return <div className="liveimg-wrapper"><img src={liveviewUrl} alt="camera viewport"/></div>;
});

export {LiveviewImg};