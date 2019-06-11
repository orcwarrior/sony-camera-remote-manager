const paramsMeta = {
    cameraFunction: {
        disabled: true,
        icon: null,
        prefix: "MODE: "
    },
    exposureMode: {
        class: "multi-line",
        prefix: "WHEEL \n",
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
        prefix: "F:"
    },
    flashMode: {disabled: true, prefix: "Flash-sync: "},
    focusMode: {icon: "center_focus_weak"},
    isoSpeedRate: {icon: "iso", prefix: "ISO: "},
    postviewImageSize: {
        icon: "image",

    },
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
export default paramsMeta;