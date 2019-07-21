import React, {useContext} from "react";
import TaskEditor from "./TaskEditor/TaskEditor";
import CodeMirrorTern from "./TaskEditor/CodeMirrorTern";
import {options} from "./TaskEditor/codeMirror.options";
import {EditorCodeContext} from "./TaskEditor/EditorCodeContext";
import TaskManager from "../../logic/TaskManager"
export default function TabTask(props) {
    const {currentTask} = useContext(EditorCodeContext);
    function testCode() {
        console.log(`currentTask: `, currentTask);
        TaskManager.runTask({name: "TEST-TASK", code: currentTask})
    }

    return <section className="task tab-content">
        <div className="btns-wrapper">
            <a className="test-code-btn btn" onClick={testCode}><span>TEST CODE</span><i className="material-icons">play_arrow</i></a>
            <a className="create-task-btn btn"><span>CREATE NEW TASK</span><i
                className="material-icons">add_circle_outline</i></a>
        </div>
        <div className="editor-wrapper">
            <TaskEditor />
        </div>
    </section>
};