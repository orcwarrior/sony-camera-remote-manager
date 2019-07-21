import React from "react";
import ReactDOM from "react-dom";
import cameraDefault from "../cameraDefault";
import {CameraProvider} from "./hoc/CameraContext";
import {CameraLiveView} from "./CameraLiveView";
import {handleCameraSocketMsgs} from "../cameraSocketIOHandler";
import CameraAppLayout from "./CameraAppLayout";
import {EditorCodeProvider} from "./rightPanel/TaskEditor/EditorCodeContext";
import {TasksProvider} from "./rightPanel/TaskEditor/TasksContext";


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

        return <EditorCodeProvider><TasksProvider>
            <CameraProvider value={decoratedCamera}>
                {children}
            </CameraProvider>
            </TasksProvider></EditorCodeProvider>
    }
};

ReactDOM.render(<App><CameraAppLayout/></App>, document.querySelector("#app"));

export default App;