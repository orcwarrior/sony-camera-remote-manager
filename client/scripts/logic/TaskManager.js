import cameraApi from "../CameraAPI";
import taskUtils from "./taskUtils";
import _ from "lodash";
import codeEditor from "../components/codeEditor";
import log from "../components/log";

const TaskManager = {
    config: {sample: "Hello"},
    global: {},
    tasks: [],
    scriptCursor: {
        name: null, line: null
    },
    createTask: function (taskName) {
        taskName = taskName || defaultTaskName(this);
        return {
            name: taskName,
            code: defaultTaskCode(taskName)
        };
    },
    addTask: function (task) {
        this.tasks.push(task);
``        this.tasks = _.uniqBy(this.tasks, "name");
    },
    runTask: async function (task) {
        log.addLog(`Running task: <b>${task.name}</b>...`);
        const taskEvalCode = evalWrapper(task);

        async function evalContext(CameraAPI, config, global, gotoTask, utils, log) {
            // TODO: Change from eval to eval line-by-line in a loop
            // to make abortion piece of cake.
            const preTaskStats = {
                time: new Date(),
                photos: CameraAPI.__photosTaken
            };
            const taskResult = await eval(taskEvalCode);
            task.stats = {
                duration: (new Date() - preTaskStats.time) / 1000,
                photos: CameraAPI.__photosTaken - preTaskStats.photos
            };
            log(`...task: ${task.name} ended in ${task.stats.duration}sec(s), taking ${task.stats.photos} photos.`);
        }

        await evalContext(cameraApi, this.config, this.global, this.gotoTask, taskUtils, log.addLog.bind(log));
    },
    runAllTasks: async function () {
        codeEditor.updateTaskCode();
        log.clearLogs();
        asyncForEach(this.tasks, async (task) => {
            await runTask(task);
        })
    },
    pauseTasks: function () {
        alert("Not implemented yet!");
    },
    gotoTask: function (taskName) {
        console.log(`Goto task: ${taskName}`);
    }
};

function defaultTaskName(taskMan) {
    return `Task_${taskMan.tasks.length + 1}`;
}

const defaultTaskCode = (taskName) => `// ${taskName}:
await utils.wait(1000);
log("Waited 1sec; ready to do sth with CameraAPI object!");
await CameraAPI.halfPressShutter()`;

// DOM Handlers:
const newTaskBtn = document.querySelector(".create-task-btn");
newTaskBtn.addEventListener("click", (evt) => {
    window.prompt("Name of new task", defaultTaskName(TaskManager));
    const task = TaskManager.createTask();
    TaskManager.addTask(task);
    codeEditor.setCurrentTask(task);
});


// TODO: Some eval-stuff-logic.js:
function evalWrapper(task) {
    const {name, code} = task;
    const CodeWithLineCallbacks = code
        .split("\n").map((lineCode, line) => (lineCode.trim().startsWith("//")) ? lineCode :
            `__lineCb("${name}",${line}); 
            try{${lineCode}} catch(e) {return __errCb("${name}",${line},e);}`).join("\n");
    return `(async function() {
    ${CodeWithLineCallbacks}
    __clearGutters();
    return true;
    })()`;
}

function _currentLineElement({error, errorMsg} = {}) {
    let el = document.createElement("a");
    el.classList.add("cur-line-gutter");
    el.innerText = "▶";
    if (error) {
        el.classList.add("error");
        el.title = errorMsg;
        el.innerText = "❗"
    }
    return el;
}

function __lineCb(taskName, line) {
    const doc = codeEditor.editor.getDoc();
    doc.clearGutter("exec-cur-line");
    doc.setGutterMarker(line, "exec-cur-line", _currentLineElement());
    TaskManager.scriptCursor = {task: taskName, line};
}

function __errCb(taskName, line, err) {
    const doc = codeEditor.editor.getDoc();
    doc.clearGutter("exec-cur-line");
    doc.setGutterMarker(line, "exec-cur-line", _currentLineElement({error: true, errorMsg: err.toString()}));
}

function __clearGutters() {
    const doc = codeEditor.editor.getDoc();
    setTimeout(() => doc.clearGutter("exec-cur-line"), 2000);
}

// TODO: Utils:
async function asyncForEach(arr, callback) {
    for (let idx = 0; idx < array.length; idx++) {
        await callback(array[idx], idx, array);
    }
}

export default TaskManager;