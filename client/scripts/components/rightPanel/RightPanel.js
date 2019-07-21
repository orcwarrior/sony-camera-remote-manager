import React, {useState} from "react";
import PanelTabs from "./Tabs";
import {allTabs, defaultTab} from "./tabs.enum";
import TabConfig from "./Tab.Config";
import TabTask from "./Tab.Task";
import TabLog from "./Tab.Log";

const RightPanel = (props) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    function renderTabContent() {
        const tabsContents = {
            [allTabs.CONFIG]: <TabConfig />,
            [allTabs.TASK]: <TabTask />,
            [allTabs.LOG]: <TabLog />
        };
        return tabsContents[activeTab];
    }
    return <div className="right-edit-panel">
        <PanelTabs onTabChange={(activeTab) => setActiveTab(activeTab)}/>
        {renderTabContent()}
    </div>
};

export default RightPanel;