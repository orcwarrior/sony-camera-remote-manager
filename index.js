const express = require("express");
const app = express();
const server = require("http").Server(app);
const SonyCamera = require("sony-camera");

const cam = new SonyCamera();
require("./server/events")(server, cam);
require("./server/routes")(app, cam);


app.use(express.static("dist"));

server.listen(6969);
console.log("Sony Camera API Task builder run at 6969 port");
