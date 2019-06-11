
import React from "react";
import {CameraConsumer} from "./CameraContext";


function withCamera(WrappedComponent, path) {

    return class extends React.Component {
        render(props) {
            return <CameraConsumer>{context => <WrappedComponent camera={context} {...this.props}/>}</CameraConsumer>;
            // <WrappedComponent camera={camera} {...props} />
        }
    }
}

export default withCamera;