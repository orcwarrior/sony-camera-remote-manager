import CAM_STATE from "./cameraState.enum";

let cameraDefault = {
    camStatus: {},
    state: CAM_STATE.UNKNOWN,
    socketIoState: "Socket.IO: Waiting",
    // _forcedUpdates: false,
};
export default cameraDefault;