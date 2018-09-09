import taskManager from "../logic/TaskManager";
import * as rivets from "rivets";

let taskSeqModel = {
    taskManager,
    editTask: function (evt, task) {
        console.log(`edit task: `, task);
    }
};

rivets.bind(document.querySelector(".tasks-flow"), taskSeqModel);