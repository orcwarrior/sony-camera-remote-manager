import client from "socket.io-client"
import CameraAPI from "./CameraAPI";

const socket = client("http://localhost:6969");

const CAM_STATE = {
    UNKNOWN: "UNKNOWN",
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    LIVEVIEWING: "LIVEVIEWING",
    CAPTURING: "CAPTURING",
    DISCONNECTED: "DISCONNECTED",
};

let camera = {
    state: CAM_STATE.UNKNOWN,
    socketIoState: "Socket.IO: Waiting",
    isUpdating: false,
    reconnect: () => {
        socket.emit("camera-reconnect", null);
    },
    params: {}
};
socket.on("connection", function (socket) {
    camera.socketIoState = "Socket.IO: Connected";
});

socket.on("camera-connected", function (camObj) {
    camera.api = camObj;
    camera.status = {...camera.status, ...camObj.params};
    camera.statusKeys = Object.keys(camera.status);
    console.log(camObj);
    CameraAPI.__decorate(camObj.availableApiList);
    CameraAPI.__updateParams(camObj.params);
    camera.state = CAM_STATE.CONNECTED;
});
socket.on("camera-param-update", function (update) {
    console.log(`Camera UP: `, update);
    camera.status = {...camera.status, ...{[update.param]: update.data}};
    camera._forceUpdate = true;
    CameraAPI.__updateParams({[update.param]: update.data});
});

socket.on("camera-disconnected", function (camObj) {
    camera.state = CAM_STATE.DISCONNECTED;
    delete camera.status;
    delete camera.statusKeys;
});

socket.on("camera-liveview", function (buffer) {
    const blob = new Blob([buffer], {type: "image/jpeg"});
    const urlCreator = window.URL || window.webkitURL;
    const imgUrl = urlCreator.createObjectURL(blob);
    camera.liveview = imgUrl;
});

export {camera, CAM_STATE};
