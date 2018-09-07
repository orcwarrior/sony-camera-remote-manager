const express = require("express");
const app = express();
const SonyCamera = require("sony-camera");

const cam = new SonyCamera();

cam.on("update", function(param, data) {
    console.log("updated: " + param  + " = ", data);
});
cam.connect((...args) => {
    console.log(cam.availableApiList);
    console.log(cam.params);
    console.log("Connected to camera!");
    console.log(args);
});

app.use(express.static('public'))

app.listen(6969);
console.log("Sony Camera API Task builder run at 6969 port");