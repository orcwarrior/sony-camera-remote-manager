import React from "react";
import ReactDOM from "react-dom";
import CameraAppLayout from "./CameraAppLayout";
import AppProviders from "./AppProviders";


class App extends React.Component {

  render() {
    return <AppProviders>
      <CameraAppLayout/>
    </AppProviders>;
  }
};

ReactDOM.render(<App/>, document.querySelector("#app"));

export default App;