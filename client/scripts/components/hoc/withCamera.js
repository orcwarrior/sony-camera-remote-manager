
import React, {useContext} from "react";
import {CameraContext} from "./CameraContext";


// function withCamera(WrappedComponent, path) {
//
//     return class extends React.Component {
//         render(props) {
//             return <CameraConsumer>{context => <WrappedComponent camera={context} {...this.props}/>}</CameraConsumer>;
//             // <WrappedComponent camera={camera} {...props} />
//         }
//     }
// }
function withCamera(WrappedComponent) {
    return ({children, ...props}) => {
        const {setCamera, cameraReconnect, ...camera} = useContext(CameraContext);
        return <WrappedComponent {...props} camera={camera} setCamera={setCamera} cameraReconnect={cameraReconnect}/>
    }
}
export default withCamera;