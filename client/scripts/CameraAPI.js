import _ from "lodash";

const apiUrl = "http://localhost:6969/api";
const fetchGETConfig = {
    method: "GET",
    headers: {"Content-Type": "application/json"}
};
const fetchPostConfig = (body) => ({
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body
});

const api = {
    _call: (method, params) => {
        console.log("Called call:", method, params);
        // return fetch(`${apiUrl}/call`, fetchPostConfig({method, params}))
        //     .then(data => data.json())
        //     .catch(err => new Error(err));
    },
    startViewfinder: () => {
        return fetch(`${apiUrl}/viewfinder/start`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));

    },
    stopViewfinder: () => {
        return fetch(`${apiUrl}/viewfinder/stop`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));

    },
    capture: () => {
        return fetch(`${apiUrl}/capture`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));
    },
    zoomIn: () => {
        return fetch(`${apiUrl}/zoom/in`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));
    },
    zoomOut: () => {
        return fetch(`${apiUrl}/zoom/out`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));
    },
    version: () => {
        return fetch(`${apiUrl}/version`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));
    },
    set: (param, value) => {
        return fetch(`${apiUrl}/set/${param}/${value}`, fetchGETConfig)
            .then(data => data.json())
            .catch(err => new Error(err));
    },
    __decorate: function (availableApiList) {
        const apiGroups = _(availableApiList)
            .groupBy(api => api.substr(0, 3))
            .pick(["get", "set"])
            .mapValues(getSetArr => getSetArr.map(s => s.substr(3)))
            .tap(console.log)
            .thru(api => {
                const getDestructed = _.groupBy(api.get,
                    get => ((get.startsWith("Supported") && "supported")
                        || (get.startsWith("Available") && "available")
                        || ("get")));
                const getOnly = getDestructed.get;
                const supportAvail = _(getDestructed)
                    .pick(["supported", "available"])
                    .mapValues(arr => arr.map(s => s.substr(9)))
                    .value();
                delete api.get;
                return {...api, ...{get: getOnly}, ...supportAvail};
            })
            .value();
        console.log("Final apis groups: ");
        console.log(apiGroups);

        const call = this.call = {};
        Object.keys(apiGroups).forEach((method) => {
            apiGroups[method].forEach(key => {
                const ccKey = camelCase(key);
                if (!call[ccKey]) call[ccKey] = {};

                call[ccKey][method] = (params) => {
                    return this._call(`${keyToPrefix[key]}${key}`, params)
                }
            })
        });

        const keyToPrefix = {
            "supported": "getSupported",
            "available": "getAvailable",
            "get": "get",
            "set": "set",
        };

        function camelCase(s) {
            return `${s[0].toLowerCase()}${s.substr(1)}`
        }
    },
    __updateParams: function (camParams) {
        Object.keys(this.call).forEach(method => {
            if (camParams[method])
                this.call[method].val = camParams[method];
        });
        console.log(this);
    }
};

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