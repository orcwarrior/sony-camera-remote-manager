const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const http = require("http");
let photoAlbum = {};
module.exports = (app, camera) => {

    const apiRouter = express.Router();
    apiRouter.use(bodyParser.json());
    apiRouter.post("/call", (req, res) => {
        const {method, params} = req.body;
        camera.call(method, params, (err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        })
    });
    apiRouter.get("/viewfinder/start", (req, res) => {
        camera.startViewfinder((err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/viewfinder/stop", (req, res) => {
        camera.stopViewfinder((err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/capture", (req, res) => {
        const captureCb = (err, {photoName, photoBuffer, url} = {}) => {
            console.log(`pn: ${photoName}, bufLen: ${photoBuffer && photoBuffer.length} / err: `, err);
            if (photoName && url)
                photoAlbum[photoName] = url;

            if (err) return res.status(500).json(err);
            console.log("Photo captured, waiting until camera is IDLE again.../" + photoName);
            camera.once("ready", status => {
                console.log(`camStatus: ${status}`);
                if (photoName) {
                    return res.json({filename: photoName});
                }
            });
        };
        camera.capture(captureCb);
    });

    apiRouter.get("/zoom/in", (req, res) => {
        camera.zoomIn((err, data) => {
            if (err) console.error(err) || res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/zoom/out", (req, res) => {
        camera.zoomOut((err, data) => {
            if (err) console.error(err) || res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/set/:param/:value", (req, res) => {
        const {param, value} = req.query;
        camera.set(param, value, (err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/version", (req, res) => {
        camera.getAppVersion((err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        })
    });
    apiRouter.get("/photoalbum/:photoName", (req, res) => {
        const {photoName} = req.params;
        const photoUrl = photoAlbum[photoName];
        console.log("Getting Image: " + photoUrl);

        const camReq = http.get(photoUrl, (sonyCameraResponse) => {
           res.setHeader("Content-disposition", `attachment; filename=${photoName}`);
           res.setHeader("Content-tye", "image/jpg");
           sonyCameraResponse.pipe(res);
        });
        camReq.on("error", (err) => res.status(500).send(err));
    });

    app.use("/api", apiRouter);

    app.use(express.static("dist"));
    app.use(express.static("photos"));
};
