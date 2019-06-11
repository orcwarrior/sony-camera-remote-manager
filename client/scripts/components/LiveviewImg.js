import {useEffect, useState} from "react";
import {getSocket} from "../cameraSocketIOHandler";
import React from "react";


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
    }
}

function LiveviewImg(props) {

    const [liveviewUrl, setLiveviewUrl] = useState();

    // const throttledLiveviewImgGeneration = _.throttle(createNewLiveviewImg, 1200);

    useEffect(() => {
        const eventCb = buildLiveimageListener(setLiveviewUrl, 30);
        getSocket().on("camera-liveview", eventCb);
        return function cleanup() {
            getSocket().off("camera-liveview",eventCb);
        }
    });

    return <div className="liveimg-wrapper"><img src={liveviewUrl}/></div>
}

export {LiveviewImg}