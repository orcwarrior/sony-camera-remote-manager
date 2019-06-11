import _ from "lodash";
import ternInitialize from "./components/codeEditorTern";
import utils from "./logic/taskUtils";
import config from "./config";
const {apiUrl} = config;

const fetchGETConfig = {
    method: "GET",
    headers: {"Content-Type": "application/json"}
};
const fetchPostConfig = (body) => ({
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
});

async function handleResponse(res) {
    const body = await res.json();
    if (res.ok) return body;
    else throw new Error(`[${res.status}]${res.statusText}:  ${JSON.stringify(body)}`);
}

const api = {
    __photosTaken: 0,
    _call: async (method, params = []) => {
        console.log("Called call:", method, params);
        const finalParams = Array.isArray(params) ? params : [params];
        const result = await fetch(`${apiUrl}/call`,
            fetchPostConfig({method, params: finalParams}))
            .then(handleResponse);
        console.log(`${method}(${params}).res: `, result);
        return result;
    },
    halfPressShutter: function () {
        return this._call("actHalfPressShutter", []);
    },
    depressShutter: function () {
        return this._call("cancelHalfPressShutter", []);
    },
    captureBulb: function (bulbTimeMs) {
        const call = this._call.bind(this);
        return this._call("startBulbShooting", [])
            .then(() => utils.wait(bulbTimeMs))
            .then(() => this._call("stopBulbShooting"))

    },
    stopCapturingBulb: function (bulbTimeMs) {
        return this._call("stopBulbShooting")
    },
    captureBulbAndSave: function(bulbTimeMs) {
        return this.captureBulb(bulbTimeMs)
            .then((res) => console.log("bulb res: ", res));
    },
    startViewfinder: () => {
        return fetch(`${apiUrl}/viewfinder/start`, fetchGETConfig)
            .then(handleResponse)
            .catch(err => new Error(err));

    },
    stopViewfinder: () => {
        return fetch(`${apiUrl}/viewfinder/stop`, fetchGETConfig)
            .then(handleResponse)
            .catch(err => new Error(err));

    },
    capture: function () {
        return fetch(`${apiUrl}/capture`, fetchGETConfig)
            .then(handleResponse)
            .then(photoName => ++this.__photosTaken && photoName)
            .catch(err => new Error(err));
    },
    captureAndSave: function () {
        return this.capture()
            .then(({filename}) => {
                downloadUrl(`${apiUrl}/photoalbum`, filename);
                return `${apiUrl}/photoalbum/${filename}`;
            })
            .catch(err => new Error(err));
    },
    zoomIn: () => {
        return fetch(`${apiUrl}/zoom/in`, fetchGETConfig)
            .then(handleResponse)
            .catch(err => new Error(err));
    },
    zoomOut: () => {
        return fetch(`${apiUrl}/zoom/out`, fetchGETConfig)
            .then(handleResponse)
            .catch(err => new Error(err));
    },
    version: () => {
        return fetch(`${apiUrl}/version`, fetchGETConfig)
            .then(handleResponse)
            .catch(err => new Error(err));
    },
    set: (param, value) => {
        return fetch(`${apiUrl}/set/${param}/${value}`, fetchGETConfig)
            .then(handleResponse)
            .catch(err => new Error(err));
    },
    __cache: {},
    __decorate: function (availableApiList) {
        const apiGroups = _(availableApiList)
            .groupBy(api => api.substr(0, 3))
            .pick(["get", "set"])
            .mapValues(getSetArr => getSetArr.map(s => s.substr(3)))
            // .tap((val) => console.log("APIs: ", val))
            .thru(api => {
                // DK: At this point there's single set and get grouped with Available & Supported too
                const getDestructed = _.groupBy(api.get,
                    get => ((get.startsWith("Supported") && "supported")
                        || (get.startsWith("Available") && "available")
                        || ("get")));
                const getOnly = getDestructed.get;
                const supportAndAvailbale = _(getDestructed)
                    .pick(["supported", "available"])
                    .mapValues(arr => arr.map(s => s.substr(9)))
                    .value();
                delete api.get;
                const buildedApi = {...api, ...{get: getOnly}, ...supportAndAvailbale};
                return buildedApi;
            })
            .value();
        console.log("Final apis groups: ");
        console.log(JSON.stringify(apiGroups));

        const call = this.call = {};
        Object.keys(apiGroups).forEach((method) => {
            const apiGroupsOfMethod = apiGroups[method] || [];
            apiGroupsOfMethod.forEach(feature => {
                const ccFeature = camelCase(feature);
                if (!call[ccFeature]) call[ccFeature] = {};

                call[ccFeature][method] = async (params = []) => {
                    // if (["supported", "available"].includes(method)) {
                    //     if (!this.__cache[ccFeature]) this.__cache[ccFeature] = {};
                    //     else if (this.__cache[ccFeature][method]) return this.__cache[ccFeature][method];
                    //     const results = await this._call(`${methodToPrefix[method]}${feature}`, params);
                    //     this.__cache[ccFeature][method] = results;
                    //     return results;
                    // }
                    return this._call(`${methodToPrefix[method]}${feature}`, params)
                };

                call[ccFeature].next = async () => {
                    const [currentOpt, availableOps] = await call[ccFeature].available();
                    const curIdx = availableOps.indexOf(currentOpt);
                    const nxtIdx = (curIdx + 1) % availableOps.length;
                    await call[ccFeature].set(availableOps[nxtIdx]);
                    return availableOps[nxtIdx];
                };
                call[ccFeature].prev = async () => {
                    const [currentOpt, availableOps] = await call[ccFeature].available();
                    const curIdx = availableOps.indexOf(currentOpt);
                    const prevIdx = (curIdx - 1 < 0) ? availableOps.length - 1 : curIdx - 1;
                    await call[ccFeature].set(availableOps[prevIdx]);
                    return availableOps[prevIdx];

                };
            })
        });

        const methodToPrefix = {
            "supported": "getSupported",
            "available": "getAvailable",
            "get": "get",
            "set": "set",
        };

        function camelCase(s) {
            return `${s[0].toLowerCase()}${s.substr(1)}`
        }

        setTimeout(() => ternInitialize(this), 1);
    },
    __updateAvailableAPIs: function (camParams) {
        console.log(`this.call: `, this.call);
        Object.keys(this.call).forEach(method => {
            if (camParams[method])
                this.call[method].val = camParams[method];
        });
    }
};

function downloadUrl(uri, filename) {
    console.log(`downlaod: ${uri}/${filename}`);
    let link = document.createElement("a");
    link.href = `${uri}/${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default api;

/* Auto:
* [ 'getVersions',
  'getMethodTypes',
  'getApplicationInfo',
  'getAvailableApiList',
  'getEvent',
  'actTakePicture',
  'stopRecMode',
  'startLiveview',
  'stopLiveview',
  'startLiveviewWithSize',
  'actZoom',
  'actHalfPressShutter',
  'cancelHalfPressShutter',
  'setSelfTimer',
  'getSelfTimer',
  'getAvailableSelfTimer',
  'getSupportedSelfTimer',
  'getSupportedContShootingMode',
  'getSupportedContShootingSpeed',
  'getExposureMode',
  'getSupportedExposureMode',
  'setExposureCompensation',
  'getExposureCompensation',
  'getAvailableExposureCompensation',
  'getSupportedExposureCompensation',
  'setFNumber',
  'getFNumber',
  'getAvailableFNumber',
  'getSupportedFNumber',
  'setIsoSpeedRate',
  'getIsoSpeedRate',
  'getAvailableIsoSpeedRate',
  'getSupportedIsoSpeedRate',
  'getLiveviewSize',
  'getAvailableLiveviewSize',
  'getSupportedLiveviewSize',
  'setPostviewImageSize',
  'getPostviewImageSize',
  'getAvailablePostviewImageSize',
  'getSupportedPostviewImageSize',
  'getSupportedProgramShift',
  'setShootMode',
  'getShootMode',
  'getAvailableShootMode',
  'getSupportedShootMode',
  'getShutterSpeed',
  'getAvailableShutterSpeed',
  'getSupportedShutterSpeed',
  'setTouchAFPosition',
  'getTouchAFPosition',
  'setWhiteBalance',
  'getWhiteBalance',
  'getSupportedWhiteBalance',
  'getAvailableWhiteBalance',
  'getSupportedFlashMode',
  'setFocusMode',
  'getFocusMode',
  'getAvailableFocusMode',
  'getSupportedFocusMode',
  'getSupportedZoomSetting',
  'getStorageInformation',
  'setLiveviewFrameInfo',
  'getLiveviewFrameInfo' ]

*  Manual:
* [ 'getVersions',
  'getMethodTypes',
  'getApplicationInfo',
  'getAvailableApiList',
  'getEvent',
  'actTakePicture',
  'stopRecMode',
  'startLiveview',
  'stopLiveview',
  'startLiveviewWithSize',
  'actZoom',
  'actHalfPressShutter',
  'cancelHalfPressShutter',
  'setSelfTimer',
  'getSelfTimer',
  'getAvailableSelfTimer',
  'getSupportedSelfTimer',
  'getSupportedContShootingMode',
  'getSupportedContShootingSpeed',
  'getExposureMode',
  'getSupportedExposureMode',
  'getExposureCompensation',
  'getAvailableExposureCompensation',
  'getSupportedExposureCompensation',
  'setFNumber',
  'getFNumber',
  'getAvailableFNumber',
  'getSupportedFNumber',
  'setIsoSpeedRate',
  'getIsoSpeedRate',
  'getAvailableIsoSpeedRate',
  'getSupportedIsoSpeedRate',
  'getLiveviewSize',
  'getAvailableLiveviewSize',
  'getSupportedLiveviewSize',
  'setPostviewImageSize',
  'getPostviewImageSize',
  'getAvailablePostviewImageSize',
  'getSupportedPostviewImageSize',
  'getSupportedProgramShift',
  'setShootMode',
  'getShootMode',
  'getAvailableShootMode',
  'getSupportedShootMode',
  'setShutterSpeed',
  'getShutterSpeed',
  'getAvailableShutterSpeed',
  'getSupportedShutterSpeed',
  'setTouchAFPosition',
  'getTouchAFPosition',
  'setWhiteBalance',
  'getWhiteBalance',
  'getSupportedWhiteBalance',
  'getAvailableWhiteBalance',
  'getSupportedFlashMode',
  'setFocusMode',
  'getFocusMode',
  'getAvailableFocusMode',
  'getSupportedFocusMode',
  'getSupportedZoomSetting',
  'getStorageInformation',
  'setLiveviewFrameInfo',
  'getLiveviewFrameInfo' ]
* */