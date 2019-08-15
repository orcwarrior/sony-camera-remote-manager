import cameraApi from "../CameraAPI";
import taskUtils from "./taskUtils";
import _ from "lodash";

let TaskManager, contexts;
/* TODO:
*   - Config ctx - for passing config easily
*   - make gotoTask operable
*   - check if globals works fine
*   - save sequences with filenames - store filenames record in LS; then store sequences by seq.$key
*   ...
*   - why sometimes set contains only one liveview based opt.
*   - test bulb
*   - check how to prepare file to store it when capturing bulb*/
export default function initializeTaskManager({LogsCtx, TasksCtx, EditorCodeCtx} = {}) {

    contexts = {LogsCtx, TasksCtx, EditorCodeCtx, ...contexts};
    // console.log("contexts", contexts);

    if (TaskManager) return TaskManager;

    TaskManager = {
        config: {sample: "Hello"},
        global: {},
        tasks: [],
        // runningTask: null,
        scriptCursor: {
            name: null, line: null
        },
        addTask: function (task) {
            this.tasks.push(task);
            this.tasks = _.uniqBy(this.tasks, "name");
        },
        runTask: async function (task) {
            const {LogsCtx} = contexts;
            LogsCtx.addLog(`Running task: <b>${task.name}</b>...`);
            // this.runningTask = task;
            const taskEvalCode = evalWrapper(task);
            // TODO: Fix it
            // codeEditor.setEditorCode(task);

            async function evalContext(CameraAPI, config = this.config, global = this.global,
                                       gotoTask = this.gotoTask.bind(this), utils, log) {
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
                log(`...task: ${task.name} ended in ${task.stats.duration} sec(s), taking ${task.stats.photos} photos.`);
            }

            await evalContext(cameraApi, this.config, this.global, this.gotoTask.bind(this), taskUtils, LogsCtx.addLog.bind(LogsCtx));
            this.runningTask = null;
        },
        runTasks: async function (tasks = this.tasks) {
            const {LogsCtx} = contexts;
            let sequenceStats = {
                duration: 0,
                photos: 0
            };
            // codeEditor.updateTaskCode();
            LogsCtx.clearLogs();
            return asyncForEach(tasks, async (task) => {
                await this.runTask(task);
                sequenceStats.duration += task.stats.duration;
                sequenceStats.photos += task.stats.photos;
                if (_.last(tasks) === task)
                    LogsCtx.addLog(`Full sequence ended in ${sequenceStats.duration}sec(s), taking ${sequenceStats.photos} photos.`);
            });

        },
        // pauseTasks: function () {
        //     alert("Not implemented yet!");
        // },
        gotoTask: function (taskName) {
            LogsCtx.addLog(`Goto task: ${taskName}`);
            const idx = this.tasks.findIndex(task => task.name === taskName);
            if (idx !== -1) {
                this.runTasks(this.tasks.slice(idx));
            }
        },
        saveTasks() {
            localStorage.setItem("storedTasksState", JSON.stringify({config: this.config, tasks: this.tasks}))
        },
        loadLocalStorageTasks() {
            let lsTaskMan = localStorage.getItem("storedTasksState");
            if (!lsTaskMan) return;
            lsTaskMan = JSON.parse(lsTaskMan);
            this.config = lsTaskMan.config;
            this.tasks = lsTaskMan.tasks;
            // codeEditor.setEditorCode(_.last(this.tasks));
        }
    };

    TaskManager.loadLocalStorageTasks();
    return TaskManager;


    function defaultTaskName(taskMan) {
        return `Task_${taskMan.tasks.length + 1}`;
    }


// DOM Handlers:
// const newTaskBtn = document.querySelector(".create-task-btn");
// newTaskBtn.addEventListener("click", (evt) => {
//     if (window.prompt("Name of new task", defaultTaskName(TaskManager))) {
//         const task = TaskManager.createTask();
//         TaskManager.addTask(task);
//         codeEditor.setEditorCode(task);
//     }
// });


// TODO: Some eval-stuff-logic.js:
    function evalWrapper(task) {
        const {name, code} = task;
        console.log(`task: `, task);
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
        const {codeMirror} = EditorCodeCtx;
        const {doc }= codeMirror;
        doc.clearGutter("exec-cur-line");
        doc.setGutterMarker(line, "exec-cur-line", _currentLineElement());
        TaskManager.scriptCursor = {task: taskName, line};
    }

    function __errCb(taskName, line, err) {
        const {codeMirror} = EditorCodeCtx;
        const {doc }= codeMirror;
        doc.clearGutter("exec-cur-line");
        doc.setGutterMarker(line, "exec-cur-line", _currentLineElement({error: true, errorMsg: err.toString()}));
    }

    function __clearGutters() {
        const {codeMirror} = EditorCodeCtx;
        const {doc }= codeMirror;
        setTimeout(() => doc.clearGutter("exec-cur-line"), 2000);
    }

// TODO: Utils:
    async function asyncForEach(arr, callback) {
        for (let idx = 0; idx < arr.length; idx++) {
            await callback(arr[idx], idx, arr);
        }
    }
}

export const defaultTaskCode = (taskName) => `// ${taskName}:
await utils.wait(1000);
log("Waited 1sec; ready to do sth with CameraAPI object!");
await CameraAPI.halfPressShutter()`;