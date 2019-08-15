import React, {useContext} from "react";
import {LogsContext} from "../../logic/contexts/LogsContext";

export default function TabLog(props) {
  const {logs, clearLogs} = useContext(LogsContext);
  return <section className="log tab-content">
    <div className="tab-inner-container logs-container">
      {logs.map((log) => <div className="log" dangerouslySetInnerHTML={{__html: log}} />)}
    </div>
    <div className="btns-wrapper justify-end">
      <a className="test-code-btn btn" onClick={clearLogs}>
        <span>CLEAR</span><i className="material-icons">delete</i></a>
    </div>
  </section>;
};