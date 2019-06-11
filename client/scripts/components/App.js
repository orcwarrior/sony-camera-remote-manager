import React from "react";
import ReactDOM from "react-dom";
import cameraDefault from "../camera";
import {CameraProvider} from "./hoc/CameraContext";
import {CameraLiveView} from "./CameraLiveView";
import {handleCameraSocketMsgs} from "../cameraSocketIOHandler";

function CameraAppLayout(props) {
    return <CameraLiveView/>;
};

class App extends React.Component {
    state = cameraDefault;
    componentDidMount() {
        handleCameraSocketMsgs(this.setState.bind(this));
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log(`prevState: `, prevState);
        // console.log("cam.state: ", this.state);
    }
    render() {
        const {liveview, ...camera} = this.state; // {...this.state, __setState: this.setState.bind(this)};
        const _setState = this.setState.bind(this);
        const decoratedCamera = {...camera, _setState};
        const {children} = this.props;
        // console.log("Render App, camera:", camera);

        return <CameraProvider value={decoratedCamera}>{children}</CameraProvider>
    }
};

ReactDOM.render(<App><CameraAppLayout/></App>, document.querySelector("#app"));

export default App;