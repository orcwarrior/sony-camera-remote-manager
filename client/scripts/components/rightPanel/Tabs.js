import React, {useState} from "react";

import {allTabs, defaultTab} from "./tabs.enum";

const PanelTabs = (props) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const changeTab = (selectedTab) => {
        if (activeTab === selectedTab) return;
        setActiveTab(selectedTab);
        if (props.onTabChange) props.onTabChange(selectedTab);
    };
    const getTabClass = (tabName) => `tab ${(tabName === activeTab) ? "active" : ""}`;

    return <header className="tabs-wrapper">
        {Object.values(allTabs)
            .map(tab => <div className={getTabClass(tab)} onClick={() => changeTab(tab)}>{tab.toUpperCase()}</div>)}
    </header>;
};

export default PanelTabs;