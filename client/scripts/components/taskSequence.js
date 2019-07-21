import taskManager from "../logic/TaskManager";
import codeEditor from "../components/codeEditor";
import * as rivets from "rivets";

let taskSeqModel = {
    codeEditor,
    taskManager,
    editTask: function (evt, ctx) {
        console.log(`edit task: `, ctx.task);
        codeEditor.setEditorCode(ctx.task);
    },
    startSequence: function (evt, ctx) {
        console.log(`running task sequence`);
        return this.taskManager.runTasks();
    },
    saveSequence: function (evt, ctx) {
        console.log(`save task sequence`);
        return this.taskManager.saveTasks();
    }
};

rivets.bind(document.querySelector(".tasks-flow"), taskSeqModel);