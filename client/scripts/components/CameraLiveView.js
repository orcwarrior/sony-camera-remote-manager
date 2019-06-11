// import rivets from "rivets"
import "../rivets.formatters";
import CAM_STATE from "../cameraState.enum";
import React from "react";
import paramsMeta from "./CameraLiveView.paramsMeta";
import withCamera from "./hoc/withCamera";
import {reconnectCamera} from "../cameraSocketIOHandler";
import {CameraParam} from "./CameraParam";
import {LiveviewImg} from "./LiveviewImg";


function CameraStatusDescription({state}) {
    if (state === CAM_STATE.UNKNOWN)
        return <span>Please connect to your camera WiFI...</span>;
    else if (state === CAM_STATE.CONNECTING)
        return <span>Connecting with camera...</span>;
    else return null;
}

function _CameraLiveView({camera: {camStatus, state, _setState}}) {

    // "{"param":"fNumber",
    // "data":{"current":"4.0",
    // "available":["1.4","1.6","1.7","2.0","2.2","2.5","2.8","3.2","3.5","4.0","4.5","5.0","5.6","6.3","7.1","8.0","9.0","10","11","13","14","16"]}}"
    console.log(`_setState: `, _setState);
    const forcedUpdates = {
        postviewImageSize: (newVal) => _setState(({camStatus}) => {
            console.log(`(prev)camStatus: `, camStatus);
            const state = {camStatus: {
                    ...camStatus,
                    postviewImageSize: {...camStatus.postviewImageSize, current: newVal}
                }};
            console.log(`postviewImageSize.status: `, state);
            return state;
        })
    };

    function renderSingleCamParam(statKey) {
        return <CameraParam status={camStatus[statKey]} name={statKey}
                            updateCb={forcedUpdates[statKey]}
                            meta={paramsMeta[statKey]}/>
    }

    function renderCameraParams() {
        const statusKeys = Object.keys(camStatus);
        return <ul className="status-icons">
            {statusKeys.map(renderSingleCamParam)}
        </ul>
    }

    const renderCameraStatusMsgs = () =>
        <p className="center-text">
            <CameraStatusDescription state={state}/>
            <br/>
            <br/>
            {state !== "CONNECTED" ? <a className="btn" onClick={reconnectCamera}>
                <span>Try Reconnect</span>
                <i className="material-icons">refresh</i>
            </a> : null}
        </p>;

    return <section id="live-view">
        {renderCameraParams()}
        {renderCameraStatusMsgs()}
        <LiveviewImg/>
    </section>
};


// rivets.bind(document.querySelector("#live-view"), liveViewModel);
const CameraLiveView = withCamera(_CameraLiveView);
// ReactDOM.render(<CameraLiveView />, document.querySelector("#live-view"));

export {CameraLiveView};