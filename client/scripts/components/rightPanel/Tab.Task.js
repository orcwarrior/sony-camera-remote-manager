import React, {useContext} from "react";
import TaskEditor from "./TaskEditor/TaskEditor";
import {EditorCodeContext} from "../../logic/contexts/EditorCodeContext";
import {TasksContext} from "../../logic/contexts/TasksContext";
import TaskManagerInitializer from "../../logic/TaskManager"

export default function TabTask(props) {
    const EditorCodeCtx = useContext(EditorCodeContext);
    const TasksCtx = useContext(TasksContext);
    const taskManager = TaskManagerInitializer();

    function testCode() {
        const {editorCode} = EditorCodeCtx;
        const currentTask = {name: "TEST-TASK", code: editorCode};
        console.log(`currentTask: `, currentTask);
        taskManager.runTask(currentTask)
    }
    function createNewTask() {
        const {editorCode} = EditorCodeCtx;
        TasksCtx.createTask({name: null, code: editorCode, active: true})
    }

    return <section className="task tab-content">
        <div className="btns-wrapper">
            <a className="test-code-btn btn" onClick={testCode}><span>TEST CODE</span><i className="material-icons">play_arrow</i></a>
            <a className="create-task-btn btn" onClick={createNewTask}><span>CREATE NEW TASK</span><i
                className="material-icons">add_circle_outline</i></a>
        </div>
        <div className="editor-wrapper">
            <TaskEditor />
        </div>
    </section>
};