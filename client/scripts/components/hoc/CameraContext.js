import React, {useState, useEffect} from "react";
import cameraDefault from "../../cameraDefault";
import withSocketIO from "./withSocketIO";
import CAM_STATE from "../../cameraState.enum";
import CameraAPI from "../../CameraAPI";
import _ from "lodash";

let cameraEvtsInitialized = false;

function _initializeCameraEvents(socket, setCamera) {
  if (cameraEvtsInitialized) return;
  cameraEvtsInitialized = true;
  if (_.isFunction(socket)) socket = socket();
  socket.on("camera-connected", function (camObj) {
    console.log("camera evt: (camera-connected)", camObj.params);
    setCamera((cam) => ({
      ...cam,
      api: camObj,
      state: CAM_STATE.CONNECTED,
      camStatus: camObj.params
    }));
    console.log(`camObj: `, camObj);
    CameraAPI.__decorate(camObj.availableApiList);
    CameraAPI.__updateAvailableAPIs(camObj.params);
  });

  socket.on("connection", function (socket) {
    console.log("Camera connection... ");
    socket.emit("client-response", {msg: "hi", d: new Date()});
    setCamera((cam) => ({
      ...cam,
      state: CAM_STATE.CONNECTING,
      socketIoState: "Socket.IO: Connecting"
    }));
  });
  socket.on("camera-param-update", function (update) {
    console.log("camera evt: (camera-param-update)", update.param);
    console.log(`Camera UP: `, update);
    setCamera(({camStatus, _forcedUpdates, ...cam}) => ({
      ...cam,
      camStatus: {...camStatus, [update.param]: update.data},
      _forcedUpdates: ++_forcedUpdates // DK: Needed any longer???
    }));
    CameraAPI.__updateAvailableAPIs({[update.param]: update.data});
  });

  socket.on("camera-disconnected", function (camObj) {
    setCamera((cam) => ({...cam, state: CAM_STATE.DISCONNECTED}));
  });
}

export const CameraContext = React.createContext(cameraDefault);

export const CameraConsumer = CameraContext.Consumer;

const _CameraProvider = function CameraProvider({socket, children}) {
  const [camera, setCamera] = useState(cameraDefault);

  function reconnectCamera() {
    if (_.isFunction(socket)) socket = socket(); // This sucks
    socket.emit("camera-reconnect", null);
  }

  console.log("_CameraProvider render");
  useEffect(() => {
    console.log("_CameraProvider INIT!");
    _initializeCameraEvents(socket, setCamera);
  });
  return <CameraContext.Provider
    value={{...camera, setCamera, cameraReconnect: reconnectCamera}}>{children}</CameraContext.Provider>;

};
export const CameraProvider = React.memo(withSocketIO(_CameraProvider));
