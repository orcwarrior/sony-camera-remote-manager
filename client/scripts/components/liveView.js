import rivets from "rivets"
import "../rivets.formatters";
import {camera, CAM_STATE} from "../camera";

const paramIcons = {
    /*
cameraFunction
:
{current: "Remote Shooting", available: Array(2)}
exposureMode
:
{current: "Aperture", available: Array(0)}
flashMode
:
{current: "on", available: Array(0)}
focusMode
:
{current: "MF", available: Array(0)}
postviewImageSize
:
{current: "2M", available: Array(1)}
selfTimer
:
{current: 0, available: Array(3)}
shootMode
:
{current: "still", available: Array(1)}
shutterSpeed
:
{current: "1/3", available: Array(0)}
*/
}
let state = {
    // TO CameraAPI,
    camera,
    // socketIoState: () => camera.socketIoState,
    liveViewText: function () {
        if (camera.state === CAM_STATE.UNKNOWN)
            return "Please connect to your camera WiFI...";
        else if (camera.state === CAM_STATE.CONNECTING)
            return "Connecting with camera...";
        else return "---";
    },
    describeParam: (name, value) => {

    }
};

rivets.bind(document.querySelector("#live-view"), state);
