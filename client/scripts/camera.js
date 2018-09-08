import client from "socket.io-client"

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
    reconnect: () => {
        socket.emit('camera-reconnect', null);
    }
};
socket.on("connection", function(socket) {
    camera.socketIoState = "Socket.IO: Connected";
});

socket.on("camera-connected", function (camObj) {
    camera.api = camObj;
    console.log(camera.api);
    camera.state = CAM_STATE.CONNECTED;
});
socket.on("camera-disconnected", function (camObj) {
    camera.state = CAM_STATE.DISCONNECTED;
});

socket.on("camera-liveview", function (buffer) {
    const blob = new Blob( [ buffer ], { type: "image/jpeg" } );
    const urlCreator = window.URL || window.webkitURL;
    const imgUrl = urlCreator.createObjectURL( blob );
    camera.liveview = imgUrl;
});

export {camera, CAM_STATE};
