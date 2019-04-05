import rivets from "rivets"
import "../rivets.formatters";
import {camera, CAM_STATE} from "../camera";
import CameraAPI from "../CameraAPI";

const paramsMeta = {
    cameraFunction: {
        disabled: true,
        icon: null,
        prefix: "MODE: "
    },
    exposureMode: {
        prefix: "WHEEL: &nbsp;",
        icons: {
            "Program Auto": "insert_emoticon",
            "Aperture": "camera",
            "Shutter": "shutter_speed",
            "Manual": "settings_applications",
            "Inteligent Auto": "adb",
            "Superior Auto": "child_care"
        },
    },
    fNumber: {
        icon: "camera",
        PREFIX: "F:"
    },
    flashMode: {disabled: true, prefix: "Flash-sync: "},
    focusMode: {icon: "center_focus_weak"},
    isoSpeedRate: {icon: "iso", prefix: "ISO: "},
    postviewImageSize: {icon: "linked_camera"},
    selfTimer: {
        icons: {
            0: "timer_off",
            2: "timer_3", // FIX?
            10: "timer_10",
        }
    },
    shootMode: {
        icons: {
            "still": "camera_alt",
            "movie": "videocam",
            "audio": "per_camera_mic",
        }
    },
    shutterSpeed: {
        class: "big",
        icon: "shutter_speed"
    }
};
let liveViewModel = {
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
    describeParam: function (name) {
        if (this.camera._forceUpdate) this.camera._forceUpdate = false;
        const value = this.camera.status[name].current;
        const meta = paramsMeta[name];
        if (meta && meta.disabled) return "";
        const icon = meta && meta.icon;
        const prefix = meta && meta.prefix || "";
        const cssClass = meta && meta.class || "";
        const iconConcrete = (meta && meta.icons) ? meta.icons[value] : null;
        if (iconConcrete) return `${prefix}<i class="material-icons">${iconConcrete}</i>`;
        else if (icon) return `<i class="material-icons">${icon}</i><div class="value ${cssClass}">${prefix}${value}</div>`;
        else return `<div class="value ${cssClass}">${prefix}${value}</div>`;
    },
    clickHandler: function (event, model) {
        const {stat} = model;
        // alert("Click handler: ");
        console.log(event, model);
        CameraAPI.call[stat].next();
    },
    rightClickHandler: function (event, model) {
        const {stat} = model;
        console.log(event, model);
        CameraAPI.call[stat].prev();
        event.preventDefault();
        return false;
    }
};

rivets.bind(document.querySelector("#live-view"), liveViewModel);
export {liveViewModel};