import client from "socket.io-client";
import CAM_STATE from "./cameraState.enum";
import CameraAPI from "./CameraAPI";

const socket = client("http://localhost:6969");

function handleCameraSocketMsgs(setState) {

    socket.on("connection", function (socket) {
        setState({
            state: CAM_STATE.CONNECTING,
            socketIoState: "Socket.IO: Connecting"
        });
    });

    socket.on("camera-connected", function (camObj) {
        console.log("camera evt: (camera-connected)", camObj.params);
        setState({
            api: camObj,
            state: CAM_STATE.CONNECTED,
            camStatus: camObj.params
        });
        console.log(`camObj: `, camObj);
        CameraAPI.__decorate(camObj.availableApiList);
        CameraAPI.__updateAvailableAPIs(camObj.params);
    });
    socket.on("camera-param-update", function (update) {
        console.log("camera evt: (camera-param-update)", update.param);
        console.log(`Camera UP: `, update);
        setState(({camStatus, _forcedUpdates}, props) => ({
            camStatus: {...camStatus, [update.param]: update.data},
            _forcedUpdates: ++_forcedUpdates // DK: Needed any longer???
        }));
        CameraAPI.__updateAvailableAPIs({[update.param]: update.data});
    });

    socket.on("camera-disconnected", function (camObj) {
        setState({state: CAM_STATE.DISCONNECTED});
    });
}

function reconnectCamera() {
    // setState({
    //     state: CAM_STATE.CONNECTING,
    //     socketIoState: "Socket.IO: Connecting"
    // });
    socket.emit("camera-reconnect", null);
}

function getSocket() {
    return socket;
}

export {handleCameraSocketMsgs, reconnectCamera, getSocket};