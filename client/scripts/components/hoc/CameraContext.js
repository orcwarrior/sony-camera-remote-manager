import React, {Component, PropTypes, Children} from "react"
import camera from "../../camera"

const CameraContext = React.createContext(camera);

export const CameraProvider = CameraContext.Provider;
export const CameraConsumer = CameraContext.Consumer;