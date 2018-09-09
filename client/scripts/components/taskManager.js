import cameraAPI from "../CameraAPI";
import rivets from "rivets";
import TaskManager from "../logic/TaskManager";
import codeEditor from "./codeEditor";

const taskManEl = document.querySelector(".tasks-manager");
const taskRunBtn = document.querySelector(".test-code-btn");
// TODO: This component is not that much "TaskManager"
// More it's tooling setups, etc. -> name it properly
const taskManagerModel = {
    tabs: ["Config", "Task", "Log"],
    activeTab: "Task",
    createChangeTab: function (dstTab) {
        return () => this.activeTab = dstTab;
    },
};

rivets.bind(taskManEl, taskManagerModel);
taskRunBtn.addEventListener("click", (e) => {
    codeEditor.updateTaskCode();
    const taskToRun = codeEditor.currentTaskEdited
        || {name: "Stratchpad-task", code: codeEditor.editor.getValue()};
    TaskManager.runTask(taskToRun);
});

export default taskManagerModel;