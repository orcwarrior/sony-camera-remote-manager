const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const SonyCamera = require("sony-camera");

const cam = new SonyCamera();

cam.on("update", function (param, data) {
    console.log("updated: " + param + " = ", data);
});
cam.connect((...args) => {
    console.log(cam.availableApiList);
    console.log(cam.params);
    console.log("Connected to camera!");
    console.log(args);
    io.emit("camera-connected", cam);
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
        console.log("Trying reconnection on client demand...")
        cam.connect((...args) => {
            console.log(cam.availableApiList);
            console.log(cam.params);
            console.log("Connected to camera!");
            console.log(args);
            io.emit("camera-connected", cam);
            cam.startViewfinder()
        });
    });
});



app.use(express.static("dist"));

server.listen(6969);
console.log("Sony Camera API Task builder run at 6969 port");
