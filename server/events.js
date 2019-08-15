const _ = require("lodash")
module.exports = (server, camera) => {

    const io = require("socket.io")(server);

    camera.on("update", function (param, data) {
        console.log(`updated: ${param} = ${data.available.join()} cam.ready/state= ${camera.ready}/${camera.status}`);
        io.emit("camera-param-update", {param, data});
    });
    camera.connect((...args) => {
        console.log("Connected to camera!");
        const camParams = Object.assign({}, camera.params);
        // console.log("Available APIs: ", camera.availableApiList);
        io.emit("camera-connected", {...camera, ...{params: camParams}});
        camera.startViewfinder()
    });
    camera.on("disconnected", () => {
        console.log("DISCONNECTED...");
        io.emit("camera-disconnected", camera);
        camera.connected = false;
    });

    camera.on("liveviewJpeg", _.throttle( (imgBuffer) => {
        io.emit("camera-liveview", imgBuffer);
    }, 100));

    io.on("connection", function (socket) {
        console.log("IO: a user connected, cam.conn:", camera.connected);
        if (camera.connected) {
            console.log("User connection info send!");
            socket.emit("camera-connected", camera);
        }

        socket.on("client-response", (socket, d) => {
            console.log("Client was connected back: ", socket, d)
        });

        socket.on("camera-reconnect", function (socket) {
            console.log("Trying reconnection on client demand...");
            camera.connect(() => {
                console.log("Connected to camera!");
                const camParams = Object.assign({}, camera.params);
                io.emit("camera-connected", {...camera, ...{params: camParams}});
                camera.startViewfinder()
            });
        });
    });
}