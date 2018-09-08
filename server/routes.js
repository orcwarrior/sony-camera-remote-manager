const express = require("express");
const bodyParser = require("body-parser");
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
        camera.capture((err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/zoom/in", (req, res) => {
        camera.zoomIn((err, data) => {
            if (err) res.status(500).json(err);
            else res.json(data);
        });
    });
    apiRouter.get("/zoom/out", (req, res) => {
        camera.zoomOut((err, data) => {
            if (err) res.status(500).json(err);
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
    app.use("/api", apiRouter)
};
