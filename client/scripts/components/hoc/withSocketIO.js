import client from "socket.io-client";
import React from "react";

// DK: Tricky-Lazy initialization
let socket = () => {
  socket = client("http://localhost:6969");
  return socket;
};
export default function withSocketIO(WrappedComponent) {

  return ({children, ...props}) => <WrappedComponent socket={socket} {...props}>
    {children}
  </WrappedComponent>;
}