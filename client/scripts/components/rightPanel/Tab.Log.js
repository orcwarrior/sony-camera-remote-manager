import React from "react";

export default function TabLog(props) {
    
    return <section className="log tab-content" rv-show="activeTab | eq 'Log'">
        <div className="tab-inner-container logs-container" rv-html="logs | joinMarkup">

        </div>
        <div className="btns-wrapper justify-end">
            <a className="test-code-btn btn" rv-on-click="clearLogs">
                <span>CLEAR</span><i className="material-icons">delete</i></a>
        </div>
    </section>
};