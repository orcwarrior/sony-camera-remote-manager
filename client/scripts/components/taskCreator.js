import cameraAPI from "../CameraAPI"

const trigger = document.querySelector('#camera-trigger');
trigger.addEventListener('click', evt => {
   cameraAPI.capture();
});