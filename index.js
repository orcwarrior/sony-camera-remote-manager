const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const SonyCamera = require("sony-camera");

const cam = new SonyCamera();

cam.on("update", function (param, data) {
    console.log("updated: " + param + " = ", data);
    io.emit("camera-param-update", {param, data});
});
cam.connect((...args) => {
    console.log("Connected to camera!");
    const camParams = Object.assign({}, cam.params);
    io.emit("camera-connected", {...cam, ...{params: camParams}});
    cam.startViewfinder()
});
cam.on("disconnected", () => {
    console.log("DISCONNECTED...")
    io.emit("camera-disconnected", cam);
});

cam.on("liveviewJpeg", (imgBuffer) => {
    io.emit("camera-liveview", imgBuffer);
});

io.on("connection", function (socket) {
    console.log("IO: a user connected");
    if (cam.connected)
        socket.emit("camera-connected", cam);
    socket.on("camera-reconnect", function (socket) {
        console.log("Trying reconnection on client demand...");
        cam.connect(() => {
            console.log("Connected to camera!");
            const camParams = Object.assign({}, cam.params);
            io.emit("camera-connected", {...cam, ...{params: camParams}});
            cam.startViewfinder()
        });
    });
});


app.use(express.static("dist"));

server.listen(6969);
console.log("Sony Camera API Task builder run at 6969 port");
